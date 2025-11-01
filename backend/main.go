package main

import (
	"log"
	"net/http"
	"os"

	// "runtime/debug"
	"strings"

	"github.com/C2Blossoms/Project_SDP/backend/config"
	dbpkg "github.com/C2Blossoms/Project_SDP/backend/db"
	handlers "github.com/C2Blossoms/Project_SDP/backend/http/handlers"
	authmw "github.com/C2Blossoms/Project_SDP/backend/http/middleware"
	"github.com/C2Blossoms/Project_SDP/backend/models"
	"github.com/C2Blossoms/Project_SDP/backend/oauth"
	"github.com/C2Blossoms/Project_SDP/backend/security"
	"github.com/rs/cors"
	"gorm.io/gorm/logger"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Config error: %v", err)
	}

	gdb, err := dbpkg.Open(cfg, logger.Info)
	if err != nil {
		log.Fatalf("DB open error: %v", err)
	}

	if cfg.DBAutoMigrate {
		if err := gdb.AutoMigrate(
			&models.User{}, &models.OAuthAccount{}, &models.RefreshToken{},
			&models.Product{}, &models.ProductImage{},
			&models.Cart{}, &models.CartItem{},
			&models.Order{}, &models.OrderItem{}, &models.Payment{},
		); err != nil {
			log.Fatalf("Automigrate error: %v", err)
		}
		log.Println("DB Migrate.")
	}

	providers := oauth.NewProviderFromEnv()
	log.Printf("oauth providers loaded: %v", providers.Names())

	jwtMgr := security.NewJWTManager(cfg)

	// ----- deps ของ handler เดิม -----
	authDeps := &handlers.AuthDeps{DB: gdb, JWT: jwtMgr}
	oauthDeps := &handlers.OAuthDeps{DB: gdb, Providers: providers, JWT: jwtMgr}
	productDeps := &handlers.ProductDeps{DB: gdb}

	// ----- middleware auth -----
	authMw := &authmw.Auth{JWT: jwtMgr}

	// ----- handlers ใหม่ (Cart/Checkout/Orders/Payments) -----
	cartH := handlers.NewCartHandlers(gdb)
	coH := handlers.NewCheckoutHandlers(gdb)
	ordH := handlers.NewOrderHandlers(gdb)
	payH := handlers.NewPaymentHandlers(gdb)

	mux := http.NewServeMux()

	// Static /uploads (แทน r.Static ของ gin)
	dir := os.Getenv("UPLOAD_DIR")
	if dir == "" {
		dir = "./uploads"
	}
	fs := http.FileServer(http.Dir(dir))
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", fs))

	// OAuth routes
	mux.HandleFunc("/auth/oauth/{provider}/start", oauthDeps.OAuthStart)
	mux.HandleFunc("/auth/oauth/{provider}/callback", oauthDeps.OAuthCallback)

	// Auth routes
	mux.HandleFunc("/auth/register", authDeps.Register)
	mux.HandleFunc("/auth/login", authDeps.Login)
	mux.HandleFunc("/auth/refresh", authDeps.Refresh)
	mux.HandleFunc("/auth/logout", authDeps.Logout)

	// Me
	mux.Handle("/me", authMw.RequireAuth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		uid, ok := authmw.UserIDFrom(r)
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		authDeps.Me(w, r, uid)
	})))

	// Cart routes
	mux.Handle("GET /cart", authMw.RequireAuth(http.HandlerFunc(cartH.GetCart)))
	mux.Handle("POST /cart/items", authMw.RequireAuth(http.HandlerFunc(cartH.AddItem)))
	mux.Handle("DELETE /cart/items", authMw.RequireAuth(http.HandlerFunc(cartH.RemoveItem)))

	// Checkout / Orders
	mux.Handle("POST /checkout/place-order", authMw.RequireAuth(http.HandlerFunc(coH.PlaceOrder)))
	mux.Handle("GET /orders/me", authMw.RequireAuth(http.HandlerFunc(ordH.ListMyOrders)))

	// Payments (mock)
	mux.Handle("POST /payments/intent", authMw.RequireAuth(http.HandlerFunc(payH.CreateIntent)))
	mux.Handle("POST /payments/mock/mark-paid", http.HandlerFunc(payH.MarkPaidMock)) // dev only

	// Products - ต้องวาง route ที่เฉพาะเจาะจงก่อน route ทั่วไป
	mux.HandleFunc("POST /products/upload-image", productDeps.UploadProductImage)
	mux.HandleFunc("/products", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			productDeps.ListProducts(w, r)
		case http.MethodPost:
			productDeps.CreateProduct(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/products/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/restore") && r.Method == http.MethodPost {
			productDeps.RestoreProduct(w, r)
			return
		}
		if strings.HasSuffix(r.URL.Path, "/images") && r.Method == http.MethodPost {
			productDeps.AddProductImage(w, r)
			return
		}
		switch r.Method {
		case http.MethodGet:
			productDeps.GetProduct(w, r)
		case http.MethodPatch, http.MethodPut:
			productDeps.UpdateProduct(w, r)
		case http.MethodDelete:
			productDeps.DeleteProduct(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	// Healthcheck
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	http.ListenAndServe(":8000", c.Handler(mux))
}
