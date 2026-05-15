-- Migration: 0005_inventory_zona
-- Adds a `zona` field to inventory_items so admins can tag properties with a
-- coarse zone (e.g. "centro", "este", "oeste") in addition to the free-form
-- `location` string.
--
-- How to apply:
--   Paste this file into the Supabase SQL Editor and run.
--
-- Idempotent — safe to re-apply.

alter table inventory_items
  add column if not exists zona text;

create index if not exists idx_inventory_zona
  on inventory_items(zona);
