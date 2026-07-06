# BidFair — Team Setup

Monorepo with three parts: `frontend/` (Next.js + Supabase auth), `backend/`
(Go API), and `supabase/` (database schema).

---

## 1. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local     # values are pre-filled (public keys only)
npm run dev
```
Open http://localhost:3000

Needs: Node.js 20+.

---

## 2. Backend (Go)

```bash
cd backend
cp .env.example .env           # fill in DATABASE_URL + SUPABASE_JWT_SECRET
go mod tidy
go run ./cmd/server
```
API runs on http://localhost:8080. See `backend/README.md` for endpoints.

Needs: Go 1.23+ (https://go.dev/dl/). Get the JWT secret from
Supabase → Settings → API → JWT Settings.

---

## 3. Database (Supabase)

- Schema lives in `supabase/migrations/`.
- To get dashboard access, the project owner invites you:
  Supabase → Organization Settings → Team → Invite member.
- Apply schema changes via the Supabase SQL Editor (paste the migration SQL) or
  the Supabase CLI.

---

## What NOT to commit / share
- `backend/.env` — DB password + JWT secret.
- `frontend/.env.local` — safe values, but keep it out of git anyway.
- The Supabase **secret** key (`sb_secret_...`) and the Google **client secret**.

Safe to share: the Supabase **publishable** key (`sb_publishable_...`) and the
project URL — these already live in `frontend/.env.example`.
