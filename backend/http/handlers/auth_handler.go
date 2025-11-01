package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/C2Blossoms/Project_SDP/backend/models"
	"github.com/C2Blossoms/Project_SDP/backend/security"
	"gorm.io/gorm"
)

type AuthDeps struct {
	DB  *gorm.DB
	JWT *security.JWTManager
}

type registerReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

// Register
func (h *AuthDeps) Register(w http.ResponseWriter, r *http.Request) {
	var in registerReq

	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if in.Email == "" || len(in.Password) < 8 {
		http.Error(w, "Validation", http.StatusUnprocessableEntity)
		return
	}

	var cnt int64

	h.DB.Model(&models.User{}).Where("email = ?", in.Email).Count(&cnt)
	if cnt > 0 {
		http.Error(w, "Email Exists", http.StatusConflict)
		return
	}

	hash, _ := security.HashPassword(in.Password)
	u := models.User{Email: in.Email, PasswordHash: &hash, Name: in.Name, Role: "user", Status: "active"}
	if err := h.DB.Create(&u).Error; err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(map[string]any{"id": u.ID, "email": u.Email, "name": u.Name})
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login
func (h *AuthDeps) Login(w http.ResponseWriter, r *http.Request) {
	var in loginReq

	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	var u models.User

	if err := h.DB.Where("email = ?", in.Email).First(&u).Error; err != nil {
		http.Error(w, "Invalid Credentials", http.StatusUnauthorized)
		return
	}

	if u.PasswordHash == nil {
		log.Println("login error: user has no password hash (maybe OAuth-only account)")
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	pw := strings.TrimSpace(in.Password)
	if err := security.CheckPassword(*u.PasswordHash, pw); err != nil {
		log.Printf("login error: password mismatch for user %s: %v", u.Email, err)
		http.Error(w, "Invalid Credentials", http.StatusUnauthorized)
		return
	}

	if u.Status != "active" {
		http.Error(w, "Account not active", http.StatusForbidden)
		return
	}

	at, rt, jti, _, refreshExp, err := h.JWT.NewPair(u.ID, u.Role)
	if err != nil {
		log.Printf("jwt.NewPair error: %v", err)
		http.Error(w, "Token Error", http.StatusInternalServerError)
		return
	}

	h.DB.Create(&models.RefreshToken{UserID: u.ID, JTI: jti, ExpiresAt: refreshExp})

	_ = json.NewEncoder(w).Encode(map[string]any{
		"access_token":  at,
		"refresh_token": rt,
		"token_type":    "Bearer",
		"expires_in":    int(h.JWT.AccessTTL.Seconds()),
		"user":          map[string]any{"id": u.ID, "email": u.Email, "name": u.Name, "role": u.Role},
	})
}

type refreshReq struct {
	RefreshToken string `json:"refresh_token"`
}

// Refresh Token
func (h *AuthDeps) Refresh(w http.ResponseWriter, r *http.Request) {
	var in refreshReq

	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	rc, err := h.JWT.ParseRefresh(in.RefreshToken)
	if err != nil {
		http.Error(w, "Invalid Token", http.StatusUnauthorized)
		return
	}

	var rt models.RefreshToken
	if err := h.DB.Where("jti = ? AND revoked = FALSE AND expires_at > ?", rc.JTI, time.Now()).First(&rt).Error; err != nil {
		http.Error(w, "Refresh Rovoked/Expired", http.StatusUnauthorized)
		return
	}

	// Get user to preserve role
	var u models.User
	if err := h.DB.First(&u, rc.UserID).Error; err != nil {
		http.Error(w, "User Not Found", http.StatusNotFound)
		return
	}

	at, newRT, newJTI, _, newExp, err := h.JWT.NewPair(rc.UserID, u.Role)
	if err != nil {
		http.Error(w, "Token Error", http.StatusInternalServerError)
		return
	}

	h.DB.Model(&rt).Update("revoked", true)
	h.DB.Create(&models.RefreshToken{UserID: rc.UserID, JTI: newJTI, ExpiresAt: newExp})

	_ = json.NewEncoder(w).Encode(map[string]any{
		"access_token":  at,
		"refresh_token": newRT,
		"token_type":    "Bearer",
		"expires_in":    int(h.JWT.AccessTTL.Seconds()),
	})
}

type logoutReq struct {
	RefreshToken string `json:"refresh_token"`
}

// Logout
func (h *AuthDeps) Logout(w http.ResponseWriter, r *http.Request) {
	var in logoutReq
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	rc, err := h.JWT.ParseRefresh(in.RefreshToken)
	if err != nil {
		http.Error(w, "Invalid Token", http.StatusUnauthorized)
		return
	}
	h.DB.Model(&models.RefreshToken{}).Where("jti = ?", rc.JTI).Update("revoked", true)
	w.WriteHeader(http.StatusNoContent)
}

// My Profile
func (h *AuthDeps) Me(w http.ResponseWriter, r *http.Request, userID uint) {
	var u models.User
	if err := h.DB.First(&u, userID).Error; err != nil {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	_ = json.NewEncoder(w).Encode(map[string]any{
		"id": u.ID, "email": u.Email, "name": u.Name, "role": u.Role, "status": u.Status,
	})
}

// Create Admin - สำหรับสร้าง admin account ง่ายๆ (ต้องใช้ secret key)
type createAdminReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	SecretKey string `json:"secret_key"` // Secret key จาก environment variable
}

func (h *AuthDeps) CreateAdmin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var in createAdminReq
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	// ตรวจสอบ secret key (จาก environment variable)
	expectedSecret := os.Getenv("CREATE_ADMIN_SECRET")
	if expectedSecret == "" {
		expectedSecret = "create-admin-secret-2024" // Default secret (แนะนำให้เปลี่ยนใน production)
	}

	if in.SecretKey != expectedSecret {
		http.Error(w, "Invalid Secret Key", http.StatusUnauthorized)
		return
	}

	// Validation
	if in.Email == "" || len(in.Password) < 8 || in.Name == "" {
		http.Error(w, "Validation: Email, Password (min 8 chars), and Name are required", http.StatusUnprocessableEntity)
		return
	}

	// Check if user already exists
	var existingUser models.User
	result := h.DB.Where("email = ?", in.Email).First(&existingUser)
	if result.Error == nil {
		// User exists, update to admin
		hash, err := security.HashPassword(in.Password)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		existingUser.PasswordHash = &hash
		existingUser.Role = "admin"
		existingUser.Status = "active"
		existingUser.Name = in.Name

		if err := h.DB.Save(&existingUser).Error; err != nil {
			http.Error(w, "DB Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{
			"message": "Admin updated successfully",
			"user": map[string]any{
				"id": existingUser.ID, "email": existingUser.Email, "name": existingUser.Name, "role": existingUser.Role,
			},
		})
		return
	}

	// Create new admin user
	hash, err := security.HashPassword(in.Password)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	user := models.User{
		Email:        in.Email,
		PasswordHash: &hash,
		Name:         in.Name,
		Role:         "admin",
		Status:       "active",
	}

	if err := h.DB.Create(&user).Error; err != nil {
		http.Error(w, "DB Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(map[string]any{
		"message": "Admin created successfully",
		"user": map[string]any{
			"id": user.ID, "email": user.Email, "name": user.Name, "role": user.Role,
		},
	})
}
