-- Migration: 0003_followups
-- Adds a followups JSONB array column to chat_sessions for the CRM panel.
--
-- Each entry has the shape:
--   { "id": "f-...", "when": "mañana 10am", "channel": "call|whatsapp|email|visit",
--     "note": "...", "created_at": "ISO datetime" }
--
-- How to apply:
--   Paste this file into the Supabase SQL Editor and run.
--
-- Idempotent — safe to re-apply.

alter table chat_sessions
  add column if not exists followups jsonb not null default '[]'::jsonb;
