package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/C2Blossoms/Project_SDP/backend/handlers"
	"github.com/C2Blossoms/Project_SDP/backend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

func init() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	// แปลงค่า MYSQL_PORT จาก string เป็น int
	port, err := strconv.Atoi(os.Getenv("MYSQL_PORT"))
	if err != nil {
		log.Fatalf("Invalid MYSQL_PORT in .env file: %v", err)
	}
	// สร้าง DSN (Data Source Name)
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("MYSQL_USER"),
		os.Getenv("MYSQL_PASSWORD"),
		os.Getenv("MYSQL_HOST_LOCAL"),
		port,
		os.Getenv("MYSQL_DATABASE"),
	)
	fmt.Println("DSN:", dsn)

	// ตั้งค่า GORM Logger
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	// Initialize database connection
	db, err = gorm.Open(mysql.New(mysql.Config{
		DSN:                       dsn,
		DefaultStringSize:         256,
		SkipInitializeWithVersion: false,
	}), &gorm.Config{Logger: newLogger})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// GORM มีการตรวจสอบการเชื่อมต่อให้แล้ว ไม่จำเป็นต้อง ping เอง
	log.Println("Successfully connected to the database!")
	db.AutoMigrate(&models.Product{}, &models.User{})
	fmt.Println("Database migrated successfully!")
}

func main() {
	app := fiber.New()

	// แก้ไข: โค้ดของ Fiber v2 ต้องมี return เสมอ
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Get("/product/:id", handlers.GetProductHandler(db))

	app.Get("/products", handlers.GetAllProductsHandler(db))

	app.Post("/product/create", handlers.CreateProductHandler(db))

	app.Put("/product/update/:id", handlers.UpdateProductHandler(db))

	app.Patch("/product/patch/:id", handlers.UpdateProductHandler(db))

	app.Delete("/product/del/:id", handlers.DeleteProductHandler(db))

	app.Put("/product/restore/:id", handlers.RestoreProductHandler(db))

	app.Post("/register", handlers.RegisterHandler(db))

	app.Post("/login", handlers.LoginHandler(db))

	app.Listen(":8000")
}
