package utils

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

func GenJWT(user string) (string, error) {

	token := jwt.New(jwt.SigningMethodHS256)

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fiber.NewError(fiber.StatusInternalServerError, "failed to parse JWT token claims")
	}
	claims["username"] = user
	claims["exp"] = time.Now().Add(time.Minute * 15).Unix()

	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", fiber.NewError(fiber.StatusInternalServerError, "failed to sign JWT token")
	}
	return t, nil
}
