package models

import (
	"time"

	"gorm.io/gorm"
)

type Cart struct {
	ID        uint `gorm:"primaryKey"`
	UserID    uint `gorm:"index;not null"` // ผูกกับผู้ใช้
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Items     []CartItem
}

type CartItem struct {
	ID        uint   `gorm:"primaryKey"`
	CartID    uint   `gorm:"index;not null"`
	ProductID uint   `gorm:"index;not null"` // ใช้ Product ID ตรง (ถ้ามี Variant ค่อยขยาย)
	Qty       int    `gorm:"not null;default:1;check:qty>0"`
	UnitPrice int64  `gorm:"not null;default:0"` // price_cents snapshot ตอนใส่ตะกร้า
	Currency  string `gorm:"size:8;not null;default:'THB'"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (CartItem) TableName() string { return "cart_items" }

// unique: (cart_id, product_id) = 1 แถวต่อสินค้าในตะกร้า
func (c *CartItem) BeforeCreate(tx *gorm.DB) error {
	return tx.
		Model(&CartItem{}).
		Where("cart_id = ? AND product_id = ?", c.CartID, c.ProductID).
		FirstOrCreate(&CartItem{}, "cart_id = ? AND product_id = ?", c.CartID, c.ProductID).Error
}
