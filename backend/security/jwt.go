package security

import (
	"fmt"
	"time"

	"github.com/C2Blossoms/Project_SDP/backend/config"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type JWTManager struct {
	AccessSecret  []byte
	RefreshSecret []byte
	AccessTTL     time.Duration
	RefreshTTL    time.Duration
}

func NewJWTManager(c config.Config) *JWTManager {
	return &JWTManager{
		AccessSecret:  c.JWTAccess,
		RefreshSecret: c.JWTRefresh,
		AccessTTL:     c.AccessTTL,
		RefreshTTL:    c.RefreshTTL,
	}
}

type AccessClaims struct {
	UserID uint   `json:"uid"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}
type RefreshClaims struct {
	UserID uint   `json:"uid"`
	JTI    string `json:"jti"`
	jwt.RegisteredClaims
}

func (m *JWTManager) NewPair(userID uint, role string) (access, refresh, jti string, accessExp, refreshExp time.Time, err error) {
	if len(m.AccessSecret) == 0 || len(m.RefreshSecret) == 0 {
		return "", "", "", time.Time{}, time.Time{}, fmt.Errorf("missing jwt secrets")
	}
	if m.AccessTTL <= 0 || m.RefreshTTL <= 0 {
		return "", "", "", time.Time{}, time.Time{}, fmt.Errorf("invalid TTL: access=%s refresh=%s", m.AccessTTL, m.RefreshTTL)
	}

	now := time.Now()
	accessExp = now.Add(m.AccessTTL)
	ac := AccessClaims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(accessExp),
		},
	}
	access, err = jwt.NewWithClaims(jwt.SigningMethodHS256, ac).SignedString(m.AccessSecret)
	if err != nil {
		return
	}

	jti = uuid.NewString()
	refreshExp = now.Add(m.RefreshTTL)
	rc := RefreshClaims{
		UserID: userID,
		JTI:    jti,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(refreshExp),
		},
	}
	refresh, err = jwt.NewWithClaims(jwt.SigningMethodHS256, rc).SignedString(m.RefreshSecret)
	return
}

func (m *JWTManager) ParseAccess(token string) (*AccessClaims, error) {
	t, err := jwt.ParseWithClaims(token, &AccessClaims{}, func(_ *jwt.Token) (any, error) {
		return m.AccessSecret, nil
	})
	if err != nil {
		return nil, err
	}
	c, ok := t.Claims.(*AccessClaims)
	if !ok || !t.Valid {
		return nil, fmt.Errorf("ivalid Access Token")
	}
	return c, nil
}

func (m *JWTManager) ParseRefresh(token string) (*RefreshClaims, error) {
	t, err := jwt.ParseWithClaims(token, &RefreshClaims{}, func(_ *jwt.Token) (any, error) {
		return m.RefreshSecret, nil
	})
	if err != nil {
		return nil, err
	}
	c, ok := t.Claims.(*RefreshClaims)
	if !ok || !t.Valid {
		return nil, fmt.Errorf("invalid Refresh Token")
	}
	return c, nil
}
