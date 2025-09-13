package models

import "time"

type OAuthAccount struct {
	ID             uint   `gorm:"primaryKey"`
	Provider       string `gorm:"index:oauth_provider_user,unique"`
	ProviderUserID string `gorm:"index:oauth_provider_user,unique"`
	UserID         uint   `gorm:"index"`
	CreatedAt      time.Time
}
