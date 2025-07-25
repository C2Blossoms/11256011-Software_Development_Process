package main

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// Handler functions

// getBooks godoc
// @Summary Get all books
// @Description Get details of all books
// @Tags books
// @Accept  json
// @Produce  json
// @Security BearerAuth
// @Success 200 {array} Book
// @Router /books [get]
func getBooks(c *fiber.Ctx) error {
	return c.JSON(books)
}

// getBook godoc
// @Summary Get a book by ID
// @Description Get book details by ID
// @Tags books
// @Produce  json
// @Param id path int true "Book ID"
// @Success 200 {object} Book
// @Failure 400 {string} string "Bad Request"
// @Failure 404 {string} string "Not Found"
// @Router /books/{id} [get]
// @Security BearerAuth
func getBook(c *fiber.Ctx) error {
	bookId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString((err.Error()))
	}

	for _, book := range books {
		if book.ID == bookId {
			return c.JSON(book)
		}
	}
	return c.SendStatus(fiber.StatusNotFound)
}

// createBook godoc
// @Summary Post new book
// @Description Create a new book
// @Tags books
// @Accept json
// @Produce json
// @Param book body Book true "Book info"
// @Success 201 {object} Book
// @Failure 400 {string} string "Bad Request"
// @Router /books [post]
// @Security BearerAuth
func createBook(c *fiber.Ctx) error {
	book := new(Book)
	if err := c.BodyParser(book); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString((err.Error()))
	}
	books = append(books, *book)
	return c.JSON(book)
}

// updateBook godoc
// @Summary Update detail of a book
// @Description Update detail of a book by ID
// @Tags books
// @Accept json
// @Produce json
// @Param id path int true "Book ID"
// @Param book body Book true "Update book info"
// @Success 200 {object} Book
// @Failure 400 {string} string "Bad Request"
// @Failure 404 {string} string "Not Found"
// @Router /books/{id} [put]
// @Security BearerAuth
func updateBook(c *fiber.Ctx) error {
	bookId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString((err.Error()))
	}

	bookUpdate := new(Book)
	if err := c.BodyParser(bookUpdate); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString((err.Error()))
	}

	for i, book := range books {
		if book.ID == bookId {
			books[i].Title = bookUpdate.Title
			books[i].Author = bookUpdate.Author
			return c.Status(fiber.StatusOK).JSON(books[i])
		}
	}
	return c.SendStatus(fiber.StatusNotFound)

}

// deleteBook godoc
// @Summary Delete all details of a book
// @Description Delete detail of a book by ID
// @Tags books
// @Accept json
// @Produce json
// @Param id path int true "Book ID"
// @Success 204 {string} string "StatusNoContent"
// @Failure 400 {string} string "Bad Request"
// @Failure 404 {string} string "Not Found"
// @Router /books/{id} [delete]
// @Security BearerAuth
func deleteBook(c *fiber.Ctx) error {
	bookId, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString((err.Error()))
	}

	for i, book := range books {
		if book.ID == bookId {
			books = append(books[:i], books[i+1:]...)
			return c.SendStatus(fiber.StatusNoContent)
		}
	}
	return c.SendStatus(fiber.StatusNotFound)
}
