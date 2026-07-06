package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all runtime configuration, loaded from environment variables.
type Config struct {
	Port              string
	DatabaseURL       string
	SupabaseJWTSecret string
	FrontendOrigin    string
}

// Load reads .env (if present) and the environment into a Config.
func Load() *Config {
	_ = godotenv.Load() // ignore error: env vars may be set by the platform

	cfg := &Config{
		Port:              getenv("PORT", "8080"),
		DatabaseURL:       os.Getenv("DATABASE_URL"),
		SupabaseJWTSecret: os.Getenv("SUPABASE_JWT_SECRET"),
		FrontendOrigin:    getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
	}

	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
	if cfg.SupabaseJWTSecret == "" {
		log.Println("warning: SUPABASE_JWT_SECRET is empty — protected routes will reject all requests")
	}

	return cfg
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
