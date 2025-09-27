package models

import "time"

type Product struct {
	ID          uint    `gorm:"primaryKey"`
	SKU         string  `gorm:"uniqueIndex;size:64;not null"`
	Name        string  `gorm:"size:128;not null"`
	Description string  `gorm:"type:text"`
	Price       float64 `gorm:"type:decimal(10,2);not null"`
	Stock       int     `gorm:"not null;default:0"`
	Status      string  `gorm:"size:20;not null;default:active"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
