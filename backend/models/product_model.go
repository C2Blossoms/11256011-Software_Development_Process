package models

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Brand    string `json:"Brand" gorm:"not null"`
	Category string `json:"Category" gorm:"not null"`
	Name     string `json:"Name" gorm:"not null"`
	Price    int    `json:"Price" gorm:"not null"`
}

func GetProduct(db *gorm.DB, id uint) (*Product, error) {
	var product Product
	result := db.First(&product, id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &product, nil
}

func GetAllProducts(db *gorm.DB) ([]Product, error) {
	var products []Product
	result := db.Find(&products)
	if result.Error != nil {
		return nil, result.Error
	}
	return products, nil
}

func CreateProduct(db *gorm.DB, p *Product) error {
	result := db.Create(p)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func UpdateProduct(db *gorm.DB, id uint, new *Product) error {
	var product Product

	result := db.First(&product, id)
	if result.Error != nil {
		return result.Error
	}
	if err := db.Model(&product).Updates(new).Error; err != nil {
		return err
	}
	return nil
}

func DeleteProduct(db *gorm.DB, id uint) error {
	result := db.Delete(&Product{}, id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func RestoreProduct(db *gorm.DB, productID uint) error {
	result := db.Unscoped().
		Model(&Product{}).
		Where("id = ?", productID).
		Update("deleted_at", nil)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}
