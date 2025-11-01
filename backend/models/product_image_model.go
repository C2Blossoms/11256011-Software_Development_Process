package models

import (
	"time"
)

type ProductImage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ProductID uint      `gorm:"not null;index:idx_product_images_product" json:"product_id"`
	ImageURL  string    `gorm:"size:1024;not null" json:"image_url"`
	IsPrimary bool      `gorm:"default:false;index:idx_product_images_product" json:"is_primary"`
	CreatedAt time.Time `json:"created_at"`
}

