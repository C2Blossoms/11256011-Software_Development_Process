package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2" // แก้ไข import เป็น fiber/v2
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// แก้ไข: ประกาศตัวแปร db ให้เป็นประเภท *gorm.DB
var db *gorm.DB

func init() {
	// โหลด environment variables จากไฟล์ .env
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	var host string
	if os.Getenv("MYSQL_HOST_LOCAL") != "" {
		host = os.Getenv("MYSQL_HOST_LOCAL")
	} else {
		// ถ้าไม่มี ให้ใช้ MYSQL_HOST ซึ่งเป็นชื่อ service ของ Docker
		host = os.Getenv("MYSQL_HOST")
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
		host,
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
}

func main() {
	app := fiber.New()

	print(db)

	// แก้ไข: โค้ดของ Fiber v2 ต้องมี return เสมอ
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Listen(":8000")
}
