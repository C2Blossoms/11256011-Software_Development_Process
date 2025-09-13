package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"runtime/debug"

	"github.com/C2Blossoms/Project_SDP/backend/config"
	"github.com/C2Blossoms/Project_SDP/backend/db"
	"github.com/C2Blossoms/Project_SDP/backend/http/handlers"
	"github.com/C2Blossoms/Project_SDP/backend/http/middleware"
	"github.com/C2Blossoms/Project_SDP/backend/models"
	"github.com/C2Blossoms/Project_SDP/backend/oauth"
	"github.com/C2Blossoms/Project_SDP/backend/security"
	"gorm.io/gorm/logger"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Config error: %v", err)
	}

	gdb, err := db.Open(cfg, logger.Info)
	if err != nil {
		log.Fatalf("DB open error: %v", err)
	}

	if cfg.DBAutoMigrate {
		if err := gdb.AutoMigrate(&models.User{}, &models.OAuthAccount{}, &models.RefreshToken{}); err != nil {
			log.Fatalf("Automigrate error: %v", err)
		}
		log.Println("DB Migrate.")
	}

	providers := oauth.NewProviderFromEnv()
	log.Printf("oauth providers loaded: %v", providers.Names())

	jwtMgr := security.NewJWTManager(cfg)
	authDeps := &handlers.AuthDeps{DB: gdb, JWT: jwtMgr}
	oauthDeps := &handlers.OAuthDeps{DB: gdb, Providers: providers, JWT: jwtMgr}
	authMw := &middleware.Auth{JWT: jwtMgr}

	mux := http.NewServeMux()

	mux.HandleFunc("GET /auth/oauth/{provider}/start", oauthDeps.OAuthStart)
	mux.HandleFunc("GET /auth/oauth/{provider}/callback", oauthDeps.OAuthCallback)
	mux.HandleFunc("POST /auth/register", authDeps.Register)
	mux.HandleFunc("POST /auth/login", authDeps.Login)
	mux.HandleFunc("POST /auth/refresh", authDeps.Refresh)
	mux.HandleFunc("POST /auth/logout", authDeps.Logout)

	mux.Handle("/me", authMw.RequireAuth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		uid, ok := middleware.UserIDFrom(r)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		authDeps.Me(w, r, uid)
	})))

	// Healthcheck
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) {
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	handler := recoverMW(cors(mux))

	addr := ":" + defaultIfEmpty(os.Getenv("PORT"), "8000")
	log.Println("Listening on", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatal(err)
	}
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Vary", "Origin")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func defaultIfEmpty(v, d string) string {
	if v == "" {
		return d
	}
	return v
}

func recoverMW(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				stack := debug.Stack()
				log.Printf("PANIC %s %s : %v\n%s", r.Method, r.URL.Path, rec, stack)
				http.Error(w, "internal server error", http.StatusInternalServerError)
			}
		}()
		log.Printf("CALL %s %s", r.Method, r.URL.Path) // trace request เข้า
		next.ServeHTTP(w, r)
	})
}
