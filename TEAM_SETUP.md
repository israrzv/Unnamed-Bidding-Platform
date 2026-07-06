# BidFair — Team Setup

Two paths depending on what a teammate needs. Most people only need **Path 1**.

---

## Path 1 — Run the app against the shared Supabase (recommended)

This lets a teammate run the full app locally while using the same hosted
Supabase project (same database, same users).

### Steps
1. Install [Node.js](https://nodejs.org) (v20+).
2. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
3. Copy the env template and it's ready to go (the values are already filled in):
   ```bash
   cp .env.example .env.local
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

### Getting Supabase dashboard access
To see the database, users, and auth settings in the Supabase dashboard, the
project owner invites them:
- Supabase dashboard → **Organization Settings → Team → Invite member** (by email).

That's it. No MCP or Docker needed for normal development.

---

## Path 2 — Local Supabase + Kiro MCP tooling (optional, advanced)

Only needed if a teammate wants to run a **local** Supabase stack and use the
Supabase MCP tools inside Kiro (for schema work, migrations, etc.). This runs
entirely on their machine and is independent of the hosted project.

### Prerequisites
1. **Docker Desktop** — https://www.docker.com/products/docker-desktop (must be running).
2. **Supabase CLI** — https://supabase.com/docs/guides/cli
3. **Kiro** with the **supabase-local** power installed (Kiro → Powers panel → install "supabase-local").

### Steps
1. From the repo root, start the local stack:
   ```bash
   supabase start
   ```
   This spins up a local Postgres + Supabase API (default at `http://127.0.0.1:54321`).
2. Kiro's MCP config (`~/.kiro/settings/mcp.json`) is managed by the power and
   points at the local stack:
   ```json
   {
     "powers": {
       "mcpServers": {
         "power-supabase-local-supabase": {
           "url": "http://127.0.0.1:54321/mcp",
           "disabled": false
         }
       }
     }
   }
   ```
3. Apply the project schema to the local stack (migrations live in `supabase/migrations/`).
4. Reconnect the MCP server in Kiro if needed: command palette →
   "Kiro: Focus on MCP Servers View".

> Note: the MCP URL is `127.0.0.1` — it only ever talks to *that developer's own*
> local Supabase. It is not a shared connection and cannot be handed to someone
> as a file. Each developer sets it up on their own machine.

---

## What NOT to share
- The **secret** Supabase key (`sb_secret_...`) — full access, bypasses security.
- The **database password** / `DATABASE_URL` / `DIRECT_URL` — keep in `.env` only.
- The Google **Client Secret** (`GOCSPX-...`) — lives in Supabase + `.env` only.

The publishable key (`sb_publishable_...`) and project URL are safe to share.
