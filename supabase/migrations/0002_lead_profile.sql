-- Migration 0002: add lead_profile column to chat_sessions
-- Idempotent: ADD COLUMN IF NOT EXISTS.
-- Additive only — no existing columns or rows are altered.

alter table chat_sessions
  add column if not exists lead_profile jsonb not null default '{}'::jsonb;
