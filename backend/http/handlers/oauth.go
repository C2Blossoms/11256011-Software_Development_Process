package handlers

import (
	crand "crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/C2Blossoms/Project_SDP/backend/models"
	"github.com/C2Blossoms/Project_SDP/backend/oauth"
	"github.com/C2Blossoms/Project_SDP/backend/security"

	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

type OAuthDeps struct {
	DB        *gorm.DB
	Providers *oauth.Providers
	JWT       *security.JWTManager
}

// --- Utils ---
func setStateCookie(w http.ResponseWriter, state string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   300, // 5 นาที
	})
}
func getStateCookie(r *http.Request) (string, error) {
	c, err := r.Cookie("oauth_state")
	if err != nil {
		return "", err
	}
	return c.Value, nil
}
func newState() string {
	b := make([]byte, 24)
	if _, err := crand.Read(b); err != nil {
		panic(err)
	}
	return base64.RawURLEncoding.EncodeToString(b)
}

// --- Routes ---
func (h *OAuthDeps) OAuthStart(w http.ResponseWriter, r *http.Request) {
	provider := r.PathValue("provider")
	if h.Providers == nil || h.Providers.Configs == nil {
		http.Error(w, "oauth not configured", http.StatusServiceUnavailable)
		return
	}
	conf, ok := h.Providers.Configs[provider]
	if !ok {
		http.Error(w, "unsupported provider", http.StatusNotFound)
		return
	}
	state := newState()
	setStateCookie(w, state)
	authURL := conf.AuthCodeURL(state)
	http.Redirect(w, r, authURL, http.StatusFound)
}

func (h *OAuthDeps) OAuthCallback(w http.ResponseWriter, r *http.Request) {
	provider := r.PathValue("provider")
	conf, ok := h.Providers.Configs[provider]
	if !ok {
		http.Error(w, "unsupported provider", http.StatusNotFound)
		return
	}

	state := r.URL.Query().Get("state")
	code := r.URL.Query().Get("code")
	want, err := getStateCookie(r)
	if err != nil || want != state {
		http.Error(w, "Invalid state", http.StatusNotFound)
		return
	}
	tok, err := conf.Exchange(r.Context(), code)
	if err != nil {
		http.Error(w, "Token exchange failed", http.StatusUnauthorized)
		return
	}

	// ดึง userinfo ตาม provider
	var email, name, providerUserID string
	switch provider {
	case "google":
		email, name, providerUserID, err = fetchGoogleProfile(tok)
	case "facebook":
		email, name, providerUserID, err = fetchFacebookProfile(tok)
	default:
		http.Error(w, "unsupported provider", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "fetch profile failed", http.StatusBadGateway)
		return
	}

	// upsert user + oauth_accounts
	var user models.User
	var oa models.OAuthAccount
	tx := h.DB.Begin()
	if err := tx.Where("provider = ? AND provider_user_id = ?", provider, providerUserID).First(&oa).Error; err == nil {
		// มีบัญชี OAuth เดิม → โหลด user
		if err := tx.First(&user, oa.UserID).Error; err != nil {
			tx.Rollback()
			http.Error(w, "user missing", 500)
			return
		}
	} else {
		// ยังไม่มี mapping
		// ลองหา user เดิมจาก email
		if err := tx.Where("email = ?", email).First(&user).Error; err != nil {
			// ไม่มี user เลย → สร้างใหม่ (ไม่มีรหัสผ่าน)
			user = models.User{Email: email, Name: name, Role: "user", Status: "active"}
			if err := tx.Create(&user).Error; err != nil {
				tx.Rollback()
				http.Error(w, "create user failed", 500)
				return
			}
		}
		oa = models.OAuthAccount{Provider: provider, ProviderUserID: providerUserID, UserID: user.ID}
		if err := tx.Create(&oa).Error; err != nil {
			tx.Rollback()
			http.Error(w, "link oauth failed", 500)
			return
		}
	}
	if err := tx.Commit().Error; err != nil {
		http.Error(w, "db error", 500)
		return
	}

	// ออก JWT คู่ใหม่
	at, rt, jti, _, refreshExp, err := h.JWT.NewPair(user.ID, user.Role)
	if err != nil {
		http.Error(w, "token error", 500)
		return
	}
	// เก็บ refresh token
	h.DB.Create(&models.RefreshToken{UserID: user.ID, JTI: jti, ExpiresAt: refreshExp})

	_ = json.NewEncoder(w).Encode(map[string]any{
		"access_token":  at,
		"refresh_token": rt,
		"token_type":    "Bearer",
		"expires_in":    int(h.JWT.AccessTTL.Seconds()),
		"user":          map[string]any{"id": user.ID, "email": user.Email, "name": user.Name, "role": user.Role},
		"oauth":         map[string]string{"provider": provider, "provider_user_id": providerUserID},
	})
}

// --- Provider-specific profile fetchers ---

func fetchGoogleProfile(tok *oauth2.Token) (email, name, sub string, err error) {
	req, _ := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v3/userinfo", nil)
	req.Header.Set("Authorization", "Bearer "+tok.AccessToken)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		b, _ := io.ReadAll(resp.Body)
		return "", "", "", fmt.Errorf("google userinfo status %d: %s", resp.StatusCode, string(b))
	}
	var out struct {
		Sub     string `json:"sub"`
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
	}
	if err = json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return
	}
	return out.Email, out.Name, out.Sub, nil
}

func fetchFacebookProfile(tok *oauth2.Token) (email, name, id string, err error) {
	u := "https://graph.facebook.com/v16.0/me?fields=id,name,email"
	req, _ := http.NewRequest("GET", u, nil)
	req.Header.Set("Authorization", "Bearer "+tok.AccessToken)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		b, _ := io.ReadAll(resp.Body)
		return "", "", "", fmt.Errorf("fb userinfo %d: %s", resp.StatusCode, string(b))
	}
	var out struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	if err = json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return
	}
	return out.Email, out.Name, out.ID, nil
}
