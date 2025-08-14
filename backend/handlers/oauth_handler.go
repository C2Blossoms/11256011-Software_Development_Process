package handlers

import (
	"context"

	"cloud.google.com/go/auth/credentials/idtoken"
	"github.com/C2Blossoms/Project_SDP/backend/utils"
	"github.com/gofiber/fiber/v2"
)

const client_id = "874361970082-nuev4q7igpglhncto8oqv6osdk2fvc1q.apps.googleusercontent.com"

func OauthloginHandler(c *fiber.Ctx) error {
	var body struct {
		IDToken string `json:"id_token"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	payload, err := idtoken.Validate(context.Background(), body.IDToken, client_id)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	email, ok := payload.Claims["email"].(string)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid email claim",
		})
	}
	name, ok := payload.Claims["name"].(string)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid name claim",
		})
	}
	picture, ok := payload.Claims["picture"].(string)
	if !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid picture claim",
		})
	}

	token, err := utils.GenJWT(email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"token": token,
		"user": fiber.Map{
			"email":   email,
			"name":    name,
			"picture": picture,
		},
	})
}
