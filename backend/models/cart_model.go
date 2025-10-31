package models

import (
	"time"

	"gorm.io/gorm"
)

type Cart struct {
	ID     uint `gorm:"primaryKey"`
	UserID uint `gorm:"not null;uniqueIndex:uq_cart_user"`
	// ให้ GORM รู้ว่า Items อ้างด้วย CartID และลบลูกเมื่อ Cart ถูกลบ
	Items     []CartItem `gorm:"foreignKey:CartID;constraint:OnDelete:CASCADE" json:"items"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

type CartItem struct {
	ID        uint   `gorm:"primaryKey"`
	CartID    uint   `gorm:"not null;index;uniqueIndex:uq_cart_product,priority:1" json:"cart_id"`
	ProductID uint   `gorm:"not null;index;uniqueIndex:uq_cart_product,priority:2" json:"product_id"`
	Qty       int    `gorm:"not null;default:1" json:"qty"`
	UnitPrice int64  `gorm:"not null;default:0" json:"unit_price"` // cents
	Currency  string `gorm:"size:8;not null;default:THB" json:"currency"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (CartItem) TableName() string { return "cart_items" }
