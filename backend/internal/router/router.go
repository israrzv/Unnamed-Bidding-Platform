package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/israrzv/Unnamed-Bidding-Platform/backend/internal/config"
	"github.com/israrzv/Unnamed-Bidding-Platform/backend/internal/handlers"
	mw "github.com/israrzv/Unnamed-Bidding-Platform/backend/internal/middleware"
)

// New builds the HTTP router with all routes and middleware.
func New(cfg *config.Config, pool *pgxpool.Pool) http.Handler {
	r := chi.NewRouter()

	r.Use(chimw.RequestID)
	r.Use(chimw.RealIP)
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.FrontendOrigin},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	h := handlers.New(pool)

	r.Get("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	// Public reads.
	r.Route("/auctions", func(r chi.Router) {
		r.Get("/", h.ListOpenAuctions)
		r.Get("/active", h.GetActiveAuction)
		r.Get("/{id}/bids", h.GetAuctionBids)
	})

	// Protected writes — require a valid Supabase JWT.
	r.Group(func(r chi.Router) {
		r.Use(mw.Auth(cfg.SupabaseJWTSecret))
		r.Post("/bids", h.PlaceBid)
	})

	return r
}
