package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

// Config holds all runtime configuration, loaded from environment variables.
type Config struct {
	Port           string
	DatabaseURL    string
	SupabaseURL    string
	JWKSURL        string
	FrontendOrigin string
}

// Load reads .env (if present) and the environment into a Config.
func Load() *Config {
	_ = godotenv.Load() // ignore error: env vars may be set by the platform

	supabaseURL := strings.TrimRight(os.Getenv("SUPABASE_URL"), "/")

	cfg := &Config{
		Port:           getenv("PORT", "8080"),
		DatabaseURL:    os.Getenv("DATABASE_URL"),
		SupabaseURL:    supabaseURL,
		FrontendOrigin: getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
	}
	if supabaseURL != "" {
		cfg.JWKSURL = supabaseURL + "/auth/v1/.well-known/jwks.json"
	}

	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}
	if cfg.SupabaseURL == "" {
		log.Println("warning: SUPABASE_URL is empty — protected routes will reject all requests")
	}

	return cfg
}

func getenv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
