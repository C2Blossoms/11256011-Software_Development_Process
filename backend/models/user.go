package models

import "time"

type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Email        string    `json:"email" gorm:"uniqueIndex;size:255;not null"`
	PasswordHash *string   `json:"passwordhash" gorm:"size:255"`
	Name         string    `json:"name" gorm:"size100"`
	Role         string    `json:"role" gorm:"size:20;default:user"`
	Status       string    `json:"status" gorm:"sizw:20;defautl:active"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
