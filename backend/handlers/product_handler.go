package handlers

import (
	"strconv"

	"github.com/C2Blossoms/Project_SDP/backend/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetProductHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		productID, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid product ID",
			})
		}
		product, err := models.GetProduct(db, uint(productID))
		if err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Product not found",
			})
		}
		return c.JSON(fiber.Map{
			"product": product,
			"Message": "Product retrieved successfully",
		})
	}
}

func GetAllProductsHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		products, err := models.GetAllProducts(db)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to retrieve products",
			})
		}
		return c.JSON(fiber.Map{
			"products": products,
			"Message":  "Products retrieved successfully",
		})
	}
}

func CreateProductHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		product := new(models.Product)
		// แปลง JSON เป็น struct
		if err := c.BodyParser(product); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to parse request body",
			})
		}
		// ตรวจสอบข้อมูลเบื้องต้น
		if product.Name == "" || product.Price <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid product data",
			})
		}
		// บันทึกลง database
		if err := models.CreateProduct(db, product); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create product",
			})
		}
		// ส่ง response กลับ
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "Product created successfully",
			"product": product,
		})
	}
}

func UpdateProductHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		product := new(models.Product)
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid product ID",
			})
		}
		if err := c.BodyParser(product); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to parse request body",
			})
		}
		if err := models.UpdateProduct(db, uint(id), product); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update product",
			})
		}
		return c.JSON(fiber.Map{
			"message": "Product updated successfully",
		})
	}
}

func DeleteProductHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid product ID",
			})
		}
		if err := models.DeleteProduct(db, uint(id)); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to delete product",
			})
		}
		return c.JSON(fiber.Map{
			"message": "Product deleted successfully",
		})
	}
}

func RestoreProductHandler(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		productID, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid Product ID",
			})
		}
		err = models.RestoreProduct(db, uint(productID))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to restore product",
			})
		}
		return c.JSON(fiber.Map{
			"message": "Product restored successfully",
		})
	}
}
