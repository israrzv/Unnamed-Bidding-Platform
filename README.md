# Unnamed Bidding Platform (BidFair)

A fair, anti-scalping ticket auction. Everyone places bids; when a sale closes,
the top **N** bids win. Built as a monorepo.

## Structure
```
.
├── frontend/    # Next.js app + Supabase authentication (TypeScript)
├── backend/     # Go API — bids, auctions, leaderboard (business logic)
└── supabase/    # Database schema / migrations
```

## How the pieces fit
- **Supabase** — Postgres database + authentication (email/password and Google).
- **frontend** — the UI and login. Users authenticate with Supabase, then call
  the Go API with their Supabase token.
- **backend** — owns all business logic. Verifies the Supabase JWT on protected
  routes and reads/writes the same Supabase Postgres.

## Getting started
Each part has its own setup:
- Frontend: see `frontend/.env.example`, then `npm install && npm run dev`.
- Backend: see `backend/README.md`, then `go mod tidy && go run ./cmd/server`.
- Database: SQL migrations live in `supabase/migrations/`.

See `TEAM_SETUP.md` for full onboarding.
