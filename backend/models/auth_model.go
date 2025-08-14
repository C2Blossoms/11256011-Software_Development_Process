package models

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"not null;unique" validate:"required"`
	Email    string `json:"email" gorm:"not null;unique" validate:"required,email"`
	Password string `json:"password" gorm:"not null" validate:"required,min=6"`
	Role     string `json:"role" gorm:"not null"`
}

type LoginRequest struct {
	Username string `json:"username" gorm:"not null"`
	Password string `json:"password" gorm:"not null"`
}

func Register(db *gorm.DB, ur *User) error {
	// hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(ur.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	ur.Password = string(hashedPassword)
	// create user in database
	if err := db.Create(ur).Error; err != nil {
		return err
	}
	return nil
}

func Login(db *gorm.DB, ul *LoginRequest) error {
	var selectedUser *User
	result := db.Where("username = ?", ul.Username).First(&selectedUser)
	if result.Error != nil {
		return result.Error
	}
	hashedPassword := []byte(selectedUser.Password)
	if err := bcrypt.CompareHashAndPassword(hashedPassword, []byte(ul.Password)); err != nil {
		return err
	}
	return nil
}
