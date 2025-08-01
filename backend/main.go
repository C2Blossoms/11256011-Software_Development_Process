package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var db *sql.DB

func init() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// Create DSN
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // กำหนดว่าจะแสดง log ไปที่ไหน
		logger.Config{
			SlowThreshold:             time.Second, // กำหนดให้แสดง log เมื่อ query ช้ากว่า 1 วินาที
			LogLevel:                  logger.Info, // ระดับของ log ที่ต้องการแสดง (Silent, Error, Warn, Info)
			IgnoreRecordNotFoundError: true,        // ไม่แสดง error เมื่อไม่พบข้อมูล
			Colorful:                  true,        // แสดงสีใน log
		},
	)

	// Initialize database connection
	db, err = gorm.Open(mysql.New(mysql.Config{
		DSN:                       dsn, // ใช้ DSN ที่สร้างจาก .env
		DefaultStringSize:         256,
		SkipInitializeWithVersion: false,
	}), &gorm.Config{logger: newLogger})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	log.Println("Successfully connected to the database!")
}

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Listen(":8000")
}
