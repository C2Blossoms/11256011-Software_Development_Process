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
		ah := r.Header.Get("Authorization")
		if !strings.HasPrefix(ah, "Bearer ") {
			http.Error(w, "Missing Token", http.StatusUnauthorized)
			return
		}
		token := strings.TrimPrefix(ah, "Bearer ")
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
