package handlers

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
)

type Auction struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description *string   `json:"description"`
	TicketCount int       `json:"ticketCount"`
	IsOpen      bool      `json:"isOpen"`
	CreatedAt   time.Time `json:"createdAt"`
}

type OpenAuction struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	TicketCount int    `json:"ticketCount"`
	LiveCount   int    `json:"liveCount"`
}

type RankedBid struct {
	Rank      int    `json:"rank"`
	BidID     string `json:"bidId"`
	UserID    string `json:"userId"`
	Username  string `json:"username"`
	Amount    int    `json:"amount"`
	IsWinning bool   `json:"isWinning"`
}

// GET /auctions/active
func (h *Handler) GetActiveAuction(w http.ResponseWriter, r *http.Request) {
	var a Auction
	err := h.DB.QueryRow(r.Context(),
		`select id, title, description, ticket_count, is_open, created_at
		   from auctions
		  where is_open = true
		  order by created_at desc
		  limit 1`,
	).Scan(&a.ID, &a.Title, &a.Description, &a.TicketCount, &a.IsOpen, &a.CreatedAt)
	if err != nil {
		writeJSON(w, http.StatusOK, nil) // no active auction
		return
	}
	writeJSON(w, http.StatusOK, a)
}

// GET /auctions  (open auctions with live participant counts)
func (h *Handler) ListOpenAuctions(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(r.Context(),
		`select a.id, a.title, a.ticket_count, count(b.id) as live_count
		   from auctions a
		   left join bids b on b.auction_id = a.id
		  where a.is_open = true
		  group by a.id
		  order by a.created_at desc`,
	)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to load auctions")
		return
	}
	defer rows.Close()

	list := []OpenAuction{}
	for rows.Next() {
		var o OpenAuction
		if err := rows.Scan(&o.ID, &o.Title, &o.TicketCount, &o.LiveCount); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to read auctions")
			return
		}
		list = append(list, o)
	}
	writeJSON(w, http.StatusOK, list)
}

// GET /auctions/{id}/bids  (ranked; top ticket_count are winning)
func (h *Handler) GetAuctionBids(w http.ResponseWriter, r *http.Request) {
	auctionID := chi.URLParam(r, "id")

	var ticketCount int
	if err := h.DB.QueryRow(r.Context(),
		`select ticket_count from auctions where id = $1`, auctionID,
	).Scan(&ticketCount); err != nil {
		writeError(w, http.StatusNotFound, "auction not found")
		return
	}

	rows, err := h.DB.Query(r.Context(),
		`select b.id, b.user_id, p.username, b.amount,
		        row_number() over (order by b.amount desc, b.created_at asc) as rank
		   from bids b
		   join profiles p on p.id = b.user_id
		  where b.auction_id = $1`,
		auctionID,
	)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to load bids")
		return
	}
	defer rows.Close()

	bids := []RankedBid{}
	for rows.Next() {
		var b RankedBid
		if err := rows.Scan(&b.BidID, &b.UserID, &b.Username, &b.Amount, &b.Rank); err != nil {
			writeError(w, http.StatusInternalServerError, "failed to read bids")
			return
		}
		b.IsWinning = b.Rank <= ticketCount
		bids = append(bids, b)
	}
	writeJSON(w, http.StatusOK, bids)
}
