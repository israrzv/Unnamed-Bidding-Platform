-- BidFair schema for Supabase
-- Run this in the Supabase dashboard -> SQL Editor (or via the Supabase CLI).

-- =====================================================================
-- Tables
-- =====================================================================

-- Public profile for each auth user (usernames shown on the leaderboard).
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  username   text unique not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.auctions (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  ticket_count int not null default 100 check (ticket_count > 0),
  is_open      boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.bids (
  id         uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  amount     int not null check (amount > 0), -- stored in cents
  created_at timestamptz not null default now(),
  -- one bid per person per auction
  unique (auction_id, user_id)
);

create index if not exists bids_auction_amount_idx
  on public.bids (auction_id, amount desc, created_at asc);

-- =====================================================================
-- Auto-create a profile when a new auth user signs up (email or Google)
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base  text;
  uname text;
begin
  base := lower(regexp_replace(
    coalesce(
      new.raw_user_meta_data ->> 'user_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    '[^a-z0-9_]', '', 'g'
  ));

  if base is null or length(base) = 0 then
    base := 'user';
  end if;

  -- Append a short random suffix to keep usernames unique.
  uname := left(base, 18) || substr(md5(random()::text), 1, 4);

  insert into public.profiles (id, username, avatar_url)
  values (new.id, uname, new.raw_user_meta_data ->> 'avatar_url');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.auctions enable row level security;
alter table public.bids     enable row level security;

-- Profiles: anyone can read (leaderboard), users manage only their own row.
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Auctions: readable by everyone.
drop policy if exists "auctions_select_all" on public.auctions;
create policy "auctions_select_all" on public.auctions
  for select using (true);

-- Bids: readable by everyone; a logged-in user may insert exactly one bid
-- for themselves on an OPEN auction. No updates or deletes (bids are final).
drop policy if exists "bids_select_all" on public.bids;
create policy "bids_select_all" on public.bids
  for select using (true);

drop policy if exists "bids_insert_own" on public.bids;
create policy "bids_insert_own" on public.bids
  for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.auctions a
      where a.id = auction_id and a.is_open
    )
  );

-- =====================================================================
-- Seed a first auction (only if none exist)
-- =====================================================================
insert into public.auctions (title, description, ticket_count, is_open)
select
  'Launch Event — General Admission',
  'Single-bid sale. The top bidders win a ticket. One bid per person.',
  100,
  true
where not exists (select 1 from public.auctions);
