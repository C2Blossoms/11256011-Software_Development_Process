package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID          uint   `gorm:"primaryKey"`
	UserID      uint   `gorm:"index;not null"`
	Status      string `gorm:"size:32;index;not null;default:'placed'"` // placed|paid|shipped|delivered|canceled
	Subtotal    int64  `gorm:"not null;default:0"`
	ShippingFee int64  `gorm:"not null;default:0"`
	Discount    int64  `gorm:"not null;default:0"`
	Total       int64  `gorm:"not null;default:0"`
	Currency    string `gorm:"size:8;not null;default:'THB'"`
	Note        string `gorm:"size:255"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
	Items       []OrderItem
	Payments    []Payment
}

type OrderItem struct {
	ID        uint   `gorm:"primaryKey"`
	OrderID   uint   `gorm:"index;not null"`
	ProductID uint   `gorm:"index;not null"`
	Qty       int    `gorm:"not null;default:1"`
	UnitPrice int64  `gorm:"not null"`
	Currency  string `gorm:"size:8;not null;default:'THB'"`
}

type Payment struct {
	ID          uint   `gorm:"primaryKey"`
	OrderID     uint   `gorm:"index;not null"`
	Provider    string `gorm:"size:32;not null;default:'mock'"`
	Amount      int64  `gorm:"not null"`
	Currency    string `gorm:"size:8;not null;default:'THB'"`
	Status      string `gorm:"size:32;not null;default:'pending'"` // pending|paid|failed|refunded
	ProviderRef string `gorm:"size:128;index"`                     // ref/intent id จาก gateway (mock เก็บ UUID)
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
}
