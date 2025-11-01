package handlers

import (
	crand "crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

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

// ---------------- Utils ----------------

func newState() string {
	b := make([]byte, 24)
	if _, err := crand.Read(b); err != nil {
		panic(err)
	}
	return base64.RawURLEncoding.EncodeToString(b)
}

func setTempCookie(w http.ResponseWriter, name, val string, maxAgeSec int) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    val,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   maxAgeSec,
	})
}

func getCookie(r *http.Request, name string) (string, error) {
	c, err := r.Cookie(name)
	if err != nil {
		return "", err
	}
	return c.Value, nil
}

func delCookie(w http.ResponseWriter, name string) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
}

func setAuthCookies(w http.ResponseWriter, access, refresh string) {
	secure := strings.EqualFold(os.Getenv("APP_ENV"), "production")

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    access,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   secure,
		// อายุเท่ากับ TTL ของ access ก็ได้ แต่ถ้าไม่มี ให้สั้นๆไว้
		MaxAge: 60 * 60, // 1 ชม.
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refresh,
		Path:     "/auth",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   secure,
		MaxAge:   30 * 24 * 60 * 60, // 30 วัน ตัวอย่าง
	})
}

// --------------- Routes ----------------

func (h *OAuthDeps) OAuthStart(w http.ResponseWriter, r *http.Request) {
	// ตรวจ provider ให้ชัดก่อน
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

	// รับ redirect_to (default เป็นหน้า finish)
	redirectTo := r.URL.Query().Get("redirect_to")
	if redirectTo == "" {
		redirectTo = "http://localhost:3000/oauth/finish"
	}

	// สร้าง state + เก็บสองคุกกี้ชั่วคราว 5 นาที
	state := newState()
	setTempCookie(w, "oauth_state", state, 300)
	setTempCookie(w, "oauth_redirect", redirectTo, 300)

	// ไปหน้าอนุญาตของ provider
	// เพิ่ม prompt=select_account เพื่อให้เลือกบัญชีใหม่ง่ายขึ้นตอน dev
	url := conf.AuthCodeURL(state, oauth2.SetAuthURLParam("prompt", "select_account"))
	http.Redirect(w, r, url, http.StatusFound)
}

func (h *OAuthDeps) OAuthCallback(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	provider := r.PathValue("provider")
	conf, ok := h.Providers.Configs[provider]
	if !ok {
		http.Error(w, "unsupported provider", http.StatusNotFound)
		return
	}

	// ตรวจ state
	state := r.URL.Query().Get("state")
	code := r.URL.Query().Get("code")

	want, err := getCookie(r, "oauth_state")
	if err != nil || want == "" || want != state {
		http.Error(w, "invalid state", http.StatusBadRequest)
		return
	}

	// แลกโค้ดเป็นโทเคน
	tok, err := conf.Exchange(r.Context(), code)
	if err != nil {
		http.Error(w, "token exchange failed", http.StatusUnauthorized)
		return
	}

	// ดึงข้อมูลผู้ใช้ตาม provider
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
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			http.Error(w, "panic", 500)
		}
	}()

	if err := tx.Where("provider = ? AND provider_user_id = ?", provider, providerUserID).First(&oa).Error; err == nil {
		// เคยลิงก์แล้ว → โหลด user
		if err := tx.First(&user, oa.UserID).Error; err != nil {
			tx.Rollback()
			http.Error(w, "user missing", 500)
			return
		}
	} else {
		// ยังไม่ลิงก์ → หา user จาก email ก่อน
		if err := tx.Where("email = ?", email).First(&user).Error; err != nil {
			// ไม่มี user → สร้างใหม่
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

	// ออก JWT
	at, rt, jti, _, refreshExp, err := h.JWT.NewPair(user.ID, user.Role)
	if err != nil {
		http.Error(w, "token error", 500)
		return
	}
	// เก็บ refresh JTI
	h.DB.Create(&models.RefreshToken{UserID: user.ID, JTI: jti, ExpiresAt: refreshExp})

	// ตั้งคุกกี้สำหรับ frontend
	setAuthCookies(w, at, rt)

	// อ่าน redirect แล้วล้างคุกกี้ temp
	redirectTo, _ := getCookie(r, "oauth_redirect")
	if redirectTo == "" {
		redirectTo = "http://localhost:3000/oauth/finish"
	}
	delCookie(w, "oauth_state")
	delCookie(w, "oauth_redirect")

	// ถ้า client ขอ JSON (เช่นเรียกผ่าน XHR) ก็ส่ง JSON แทนได้
	accept := r.Header.Get("Accept")
	if strings.Contains(accept, "application/json") {
		_ = json.NewEncoder(w).Encode(map[string]any{
			"access_token":  at,
			"refresh_token": rt,
			"token_type":    "Bearer",
			"expires_in":    int(h.JWT.AccessTTL.Seconds()),
			"user":          map[string]any{"id": user.ID, "email": user.Email, "name": user.Name, "role": user.Role},
			"oauth":         map[string]string{"provider": provider, "provider_user_id": providerUserID},
			"took_ms":       time.Since(start).Milliseconds(),
		})
		return
	}

	// ปกติ: redirect กลับหน้า finish
	http.Redirect(w, r, redirectTo, http.StatusFound)
}

// --------- Provider-specific profile fetchers ---------

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
