package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

func first(vals ...string) string {
	for _, v := range vals {
		if v != "" {
			return v
		}
	}
	return ""
}

type Config struct {
	MySQLUser     string
	MySQLPassword string
	MySQLHost     string
	MySQLPORT     int
	MySQLDB       string
	Env           string
	JWTAccess     []byte
	JWTRefresh    []byte
	AccessTTL     time.Duration
	RefreshTTL    time.Duration
	DBAutoMigrate bool
}

func LoadConfig() (Config, error) {
	// Load .env file
	_ = godotenv.Load()
	var c Config
	var err error

	// Query form env
	c.Env = os.Getenv("APP_ENV")
	c.MySQLUser = first(os.Getenv("DB_USER"), os.Getenv("MYSQL_USER"))
	c.MySQLPassword = first(os.Getenv("DB_PASSWORD"), os.Getenv("MYSQL_PASSWORD"))
	c.MySQLHost = first(os.Getenv("DB_HOST"), os.Getenv("MYSQL_HOST"), "mysql")
	c.MySQLDB = first(os.Getenv("DB_NAME"), os.Getenv("MYSQL_DATABASE"))
	p := first(os.Getenv("DB_PORT"), os.Getenv("MYSQL_PORT"), "3306")

	if c.MySQLUser == "" || c.MySQLPassword == "" || c.MySQLHost == "" || c.MySQLDB == "" || p == "" {
		return c, fmt.Errorf("Missing required .env: %w", err)
	}

	c.MySQLPORT, err = strconv.Atoi(p)
	if err != nil {
		return c, fmt.Errorf("invalid MYSQL_PORT: %w", err)
	}

	c.JWTAccess = []byte(os.Getenv("JWT_ACCESS_SECRET"))
	c.JWTRefresh = []byte(os.Getenv("JWT_REFRESH_SECRET"))
	if len(c.JWTAccess) == 0 || len(c.JWTRefresh) == 0 {
		return c, fmt.Errorf("Missing JWT Secret: %w", err)
	}

	accessMin, _ := strconv.Atoi(defaultIfEmpty(os.Getenv("ACCESS_TTL_MIN"), "15"))
	refreshDay, _ := strconv.Atoi(defaultIfEmpty(os.Getenv("REFRESH_TTL_DAY"), "7"))
	c.AccessTTL = time.Duration(accessMin) * time.Minute
	c.RefreshTTL = time.Duration(refreshDay) * 24 * time.Hour

	c.DBAutoMigrate = os.Getenv("DB_AUTOMIGRATE") == "true"

	return c, nil
}

func defaultIfEmpty(v, d string) string {
	if v == "" {
		return d
	}
	return v
}
