package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/C2Blossoms/Project_SDP/backend/security"
)

type ctxKey string

const (
	ctxUserID ctxKey = "uid"
	ctxRole   ctxKey = "role"
)

func UserIDFrom(r *http.Request) (uint, bool) {
	v := r.Context().Value(ctxUserID)
	if v == nil {
		return 0, false
	}
	return v.(uint), true
}

func RoleFrom(r *http.Request) (string, bool) {
	v := r.Context().Value(ctxRole)
	if v == nil {
		return "", false
	}
	return v.(string), true
}

type Auth struct {
	JWT *security.JWTManager
}

func (a *Auth) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1) ลองอ่านจาก Authorization: Bearer ...
		var token string
		if ah := r.Header.Get("Authorization"); strings.HasPrefix(ah, "Bearer ") {
			token = strings.TrimPrefix(ah, "Bearer ")
		}

		// 2) ถ้าไม่มี ให้ลองจากคุกกี้ access_token
		if token == "" {
			if c, err := r.Cookie("access_token"); err == nil {
				token = c.Value
			}
		}

		if token == "" {
			http.Error(w, "Missing Token", http.StatusUnauthorized)
			return
		}

		claims, err := a.JWT.ParseAccess(token)
		if err != nil {
			http.Error(w, "Invalid Token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), ctxUserID, claims.UserID)
		ctx = context.WithValue(ctx, ctxRole, claims.Role)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RequireRole(role string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			roleVal, ok := RoleFrom(r)
			if !ok || roleVal != role {
				http.Error(w, "Forbidden", http.StatusForbidden)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
