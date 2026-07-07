package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"

	"github.com/israrzv/Unnamed-Bidding-Platform/backend/internal/config"
	"github.com/israrzv/Unnamed-Bidding-Platform/backend/internal/database"
	"github.com/israrzv/Unnamed-Bidding-Platform/backend/internal/router"
)

func main() {
	cfg := config.Load()

	pool, err := database.Connect(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database connect: %v", err)
	}
	defer pool.Close()

	// Build the JWT key function from Supabase's JWKS (asymmetric keys).
	keyfn := jwksKeyfunc(cfg.JWKSURL)

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router.New(cfg, pool, keyfn),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("BidFair API listening on :%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	// Graceful shutdown on Ctrl+C / SIGTERM.
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("shutdown error: %v", err)
	}
}

// jwksKeyfunc returns a jwt.Keyfunc backed by the Supabase JWKS endpoint.
// If the URL is missing or unreachable, it returns a keyfunc that rejects all
// tokens, so protected routes fail closed rather than open.
func jwksKeyfunc(jwksURL string) jwt.Keyfunc {
	if jwksURL == "" {
		return func(*jwt.Token) (interface{}, error) {
			return nil, errors.New("JWKS not configured")
		}
	}
	k, err := keyfunc.NewDefault([]string{jwksURL})
	if err != nil {
		log.Printf("warning: could not load JWKS from %s: %v", jwksURL, err)
		return func(*jwt.Token) (interface{}, error) {
			return nil, errors.New("JWKS unavailable")
		}
	}
	log.Printf("loaded JWKS from %s", jwksURL)
	return k.Keyfunc
}
