package handlers

import "gorm.io/gorm"

type ProductDeps struct {
	DB *gorm.DB
}
