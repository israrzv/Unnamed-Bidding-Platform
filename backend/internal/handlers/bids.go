package handlers

import (
	"encoding/json"
	"errors"
	"math"
	"net/http"

	"github.com/jackc/pgx/v5/pgconn"

	mw "github.com/israrzv/Unnamed-Bidding-Platform/backend/internal/middleware"
)

type placeBidRequest struct {
	Amount float64 `json:"amount"` // dollars from the client
}

// POST /bids  (protected — requires a valid Supabase JWT)
func (h *Handler) PlaceBid(w http.ResponseWriter, r *http.Request) {
	userID := mw.UserID(r.Context())
	if userID == "" {
		writeError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	var req placeBidRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Amount <= 0 {
		writeError(w, http.StatusBadRequest, "enter a valid bid amount")
		return
	}
	amountCents := int(math.Round(req.Amount * 100))
	if amountCents <= 0 {
		writeError(w, http.StatusBadRequest, "bid must be greater than zero")
		return
	}

	// Find the open auction.
	var auctionID string
	if err := h.DB.QueryRow(r.Context(),
		`select id from auctions where is_open = true order by created_at desc limit 1`,
	).Scan(&auctionID); err != nil {
		writeError(w, http.StatusBadRequest, "there is no open sale to bid on")
		return
	}

	// Insert. The unique(auction_id, user_id) constraint enforces one bid each.
	_, err := h.DB.Exec(r.Context(),
		`insert into bids (auction_id, user_id, amount) values ($1, $2, $3)`,
		auctionID, userID, amountCents,
	)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			writeError(w, http.StatusConflict,
				"You have already placed your bid. Each person can bid only once.")
			return
		}
		writeError(w, http.StatusInternalServerError, "could not place your bid")
		return
	}

	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}
