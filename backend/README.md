# BidFair — Go Backend

The business-logic API: auctions, bids, and the leaderboard. Authentication is
handled by Supabase on the frontend; this service **verifies** the Supabase JWT
on protected routes.

## Stack
- [chi](https://github.com/go-chi/chi) — HTTP router
- [pgx](https://github.com/jackc/pgx) — Postgres (Supabase) driver + pool
- [golang-jwt](https://github.com/golang-jwt/jwt) — JWT verification

## Layout
```
backend/
├── cmd/server/         # main entrypoint
└── internal/
    ├── config/         # env loading
    ├── database/       # pgx connection pool
    ├── middleware/     # Supabase JWT auth
    ├── handlers/       # HTTP handlers (auctions, bids)
    └── router/         # routes + middleware wiring
```

## Run
```bash
cp .env.example .env    # then fill in DATABASE_URL and SUPABASE_URL
go mod tidy             # resolve dependencies
go run ./cmd/server
```
Server starts on `http://localhost:8080`.

## Endpoints
| Method | Path                   | Auth | Purpose                          |
|--------|------------------------|------|----------------------------------|
| GET    | `/health`              | no   | health check                     |
| GET    | `/auctions`            | no   | open auctions + live counts      |
| GET    | `/auctions/active`     | no   | the current active auction       |
| GET    | `/auctions/{id}/bids`  | no   | ranked bids (top N are winning)  |
| POST   | `/bids`                | yes  | place a bid (one per user)       |

## Auth note
The JWT middleware verifies tokens against the project's **JWKS** (asymmetric
ES256/RS256 keys) fetched from `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`.
No shared secret is needed — set `SUPABASE_URL` and it works.

## Prerequisite
Go 1.23+ must be installed: https://go.dev/dl/
