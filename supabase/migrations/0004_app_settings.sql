-- Migration: 0004_app_settings
-- Generic key/value store for runtime-editable app configuration.
-- First user: the chat agent's system prompt (key = 'system_prompt'), which
-- is editable from /admin/inventory.
--
-- How to apply:
--   Paste this file into the Supabase SQL Editor and run.
--
-- Idempotent — safe to re-apply.

create table if not exists app_settings (
  key        text        primary key,
  value      jsonb       not null,
  updated_at timestamptz not null default now()
);
