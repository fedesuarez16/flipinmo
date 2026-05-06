-- Migration: 0001_chat_agent
-- Phase 2: chat_sessions + chat_messages tables.
-- Phase 3: inventory_items table + Spanish FTS index.
--
-- How to apply:
--   Option A (recommended): paste the ENTIRE file into Supabase SQL Editor and run.
--   Option B: `supabase db push` if you have the Supabase CLI configured.
--
-- This migration is idempotent — safe to re-apply (all statements use IF NOT EXISTS).

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ─── Chat sessions ────────────────────────────────────────────────────────────
create table if not exists chat_sessions (
  id                uuid        primary key default gen_random_uuid(),
  client_session_id text        unique not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ─── Chat messages ────────────────────────────────────────────────────────────
-- content stores the full Anthropic content array as JSONB, e.g.:
--   [{ "type": "text", "text": "Hola" }]
--   [{ "type": "tool_use", "id": "toolu_...", "name": "search_inventory", "input": {...} }]
--   [{ "type": "tool_result", "tool_use_id": "toolu_...", "content": "..." }]
create table if not exists chat_messages (
  id         uuid        primary key default gen_random_uuid(),
  session_id uuid        not null references chat_sessions(id) on delete cascade,
  role       text        not null check (role in ('user', 'assistant')),
  content    jsonb       not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_session
  on chat_messages(session_id, created_at);

-- ─── Inventory items (Phase 3) ────────────────────────────────────────────────
-- Vertical-agnostic product catalogue.
-- `features` is a pipe-separated array stored natively as text[].
-- `meta` is a free-form JSONB column for vertical-specific extras.
create table if not exists inventory_items (
  id          uuid        primary key default gen_random_uuid(),
  type        text        not null,
  title       text        not null,
  location    text        not null,
  price       numeric,
  currency    text                     default 'ARS',
  bedrooms    int,
  bathrooms   int,
  area_m2     numeric,
  description text,
  features    text[]                   default '{}',
  status      text        not null     default 'available' check (status in ('available', 'reserved', 'sold')),
  meta        jsonb                    default '{}'::jsonb,
  created_at  timestamptz              default now()
);

-- Spanish full-text search index across title, description, and location.
-- Apply query via: to_tsvector('spanish', coalesce(title,'') || ' ' || ...)
create index if not exists idx_inventory_fts
  on inventory_items
  using gin (
    to_tsvector('spanish',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(location, '')
    )
  );

-- Composite index for common filter pattern: status + type.
create index if not exists idx_inventory_status
  on inventory_items(status);
