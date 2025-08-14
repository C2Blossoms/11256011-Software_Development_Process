package handlers

import (
	"time"

	"github.com/C2Blossoms/Project_SDP/backend/models"
	"github.com/C2Blossoms/Project_SDP/backend/utils"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

var validate = validator.New()

func RegisterHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		regis := new(models.User)
		if err := c.BodyParser(regis); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
		if err := validate.Struct(regis); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": "Validate failed",
				"errors":  err.Error(),
			})
		}
		defaultRole := "user"
		regis.Role = defaultRole
		if err := models.Register(db, regis); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
		return c.JSON(fiber.Map{
			"status":  "success",
			"message": "user registered successfully",
		})
	}
}

func LoginHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := new(models.LoginRequest)
		if err := c.BodyParser(user); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}

		if err := models.Login(db, user); err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
		t, err := utils.GenJWT(user.Username)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"status":  "error",
				"message": err.Error(),
			})
		}
		c.Cookie(&fiber.Cookie{
			Name:     "token",
			Value:    t,
			Expires:  time.Now().Add(time.Minute * 15),
			HTTPOnly: true,
		})
		return c.JSON(fiber.Map{
			"status":  "success",
			"message": "user logged in successfully",
			"token":   t,
		})
	}
}
