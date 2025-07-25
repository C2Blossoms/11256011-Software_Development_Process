package main

import (
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// สมมุติว่าใช้ใน-memory slice แทน database
var users []User
var jwtSecret = []byte("your_secret_key")

func Register(c *fiber.Ctx) error {
	var user User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).SendString("Invalid input")
	}
	user.ID = uint(len(users) + 1)

	hashpassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashpassword)
	fmt.Println("Hash : ", user.Password)

	users = append(users, user)
	return c.JSON(fiber.Map{"message": "Register success"})
}

func Login(c *fiber.Ctx) error {
	var creds User
	if err := c.BodyParser(&creds); err != nil {
		return c.Status(400).SendString("Invalid input")
	}
	// ตรวจสอบว่า username/password ตรงหรือไม่
	for _, u := range users {
		err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(creds.Password))
		if err == nil {
			// สร้าง JWT token
			token := jwt.New(jwt.SigningMethodHS256)
			claims := token.Claims.(jwt.MapClaims)
			claims["username"] = u.Username
			claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

			t, err := token.SignedString(jwtSecret)
			if err != nil {
				return c.Status(500).SendString("Failed to generate token")
			}
			return c.JSON(fiber.Map{"token": t})
		}
	}
	return c.Status(401).SendString("Unauthorized")
}

func ProtectedRoute(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return c.Status(401).SendString("Missing Bearer token")
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).SendString("Invalid or expired token")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		fmt.Println("Username:", claims["username"])
		return c.SendString(fmt.Sprintf("Welcome %v 🎉", claims["username"]))
	}

	return c.Status(401).SendString("Failed to extract claims")
}
