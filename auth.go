package main

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Email    string
	Password string
}

var memberUser = User{
	Email:    "user@example.com",
	Password: "password123",
}

// Login functions
// Login godoc
// @Summary  Admin login
// @Description Login and receive JWT token
// @Tags Auth
// @Accept  json
// @Produce  json
// @Param credentials body User true "Login credentials"
// @Security BearerAuth
// @Success 200 {object} map[string]string "Login Success"
// @Failure 400 {string} string "Bad Request"
// @Failure 401 {string} string "Unauthorized"
// @Failure 500 {string} string "InternalServer Error"
// @Router /login [post]
func Login(c *fiber.Ctx) error {
	user := new(User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}
	if err := bcrypt.CompareHashAndPassword([]byte(memberUser.Password), []byte(user.Password)); err != nil {
		return fiber.ErrUnauthorized
	}
	// Create Token
	token := jwt.New(jwt.SigningMethodHS256)
	// Set claims
	claims := token.Claims.(jwt.MapClaims)
	claims["email"] = user.Email
	claims["role"] = "admin"
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.SendStatus(fiber.StatusInternalServerError)
	}

	return c.JSON(fiber.Map{
		"message": "Login Success",
		"token":   t})
}
