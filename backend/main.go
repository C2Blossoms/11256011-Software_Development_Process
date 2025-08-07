package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *gorm.DB

func init() {
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
		os.Getenv("PMA_HOST"),
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
	db.AutoMigrate(&Product{})
	fmt.Println("Database migrated successfully!")
}

func main() {
	app := fiber.New()

	// แก้ไข: โค้ดของ Fiber v2 ต้องมี return เสมอ
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Get("/products/:id", GetProductHandler(db))

	app.Get("/products", GetAllProductsHandler(db))

	app.Post("/products", CreateProductHandler(db))

	app.Put("/products/:id", UpdateProductHandler(db))

	app.Patch("/products/:id", UpdateProductHandler(db))

	app.Delete("/products/:id", DeleteProductHandler(db))

	app.Listen(":8000")
}
