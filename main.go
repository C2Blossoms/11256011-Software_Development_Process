package main

import (
	"github.com/gofiber/fiber/v2"
)

var books []Book

type Book struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Author string `json:"author"`
}

func main() {
	app := fiber.New()

	books = append(books, Book{ID: 1, Title: "1984", Author: "George Orwell"})
	books = append(books, Book{ID: 2, Title: "The Great Gatsby", Author: "F. Scott Fitzgerald"})

	app.Get("/books", Getbooks)
	app.Get("/books/:id", Getbook)
	app.Post("/books", CreateBook)
	app.Put("/books/:id", UpdateBook)
	app.Delete("/books/:id", DeleteBook)

	app.Post("/upload", uploadFile)

	app.Listen(":8080")
}
