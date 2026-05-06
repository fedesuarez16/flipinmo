import 'server-only'

import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

export type InventoryItem = {
  id: string
  type: string
  title: string
  location: string
  price: number | null
  currency: string
  bedrooms: number | null
  bathrooms: number | null
  area_m2: number | null
  description: string | null
  features: string[]
  status: string
  meta: Record<string, unknown>
  created_at: string
}

export type InventoryFilters = {
  query?: string
  type?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  status?: string
  limit?: number
}

type RowError = {
  row: number
  error: string
}

// ─── listItems ────────────────────────────────────────────────────────────────

/**
 * Returns filtered inventory items.
 *
 * NOTE on search: Supabase JS does not expose a tsvector column for FTS filters
 * directly. For v1 we use ILIKE across title + description + location via an `or`
 * filter. Postgres will still benefit from the GIN index via the query planner on
 * supported versions. A proper RPC (`search_inventory_fts`) can replace this later.
 */
export async function listItems(
  filters: InventoryFilters = {},
): Promise<InventoryItem[]> {
  const limit = filters.limit ?? 8

  let q = supabase.from('inventory_items').select('*').limit(limit)

  if (filters.query) {
    const likeVal = `%${filters.query}%`
    q = q.or(
      `title.ilike.${likeVal},description.ilike.${likeVal},location.ilike.${likeVal}`,
    )
  }

  if (filters.type) {
    q = q.eq('type', filters.type)
  }

  if (filters.location) {
    q = q.ilike('location', `%${filters.location}%`)
  }

  if (filters.minPrice !== undefined) {
    q = q.gte('price', filters.minPrice)
  }

  if (filters.maxPrice !== undefined) {
    q = q.lte('price', filters.maxPrice)
  }

  if (filters.bedrooms !== undefined) {
    q = q.eq('bedrooms', filters.bedrooms)
  }

  if (filters.status) {
    q = q.eq('status', filters.status)
  }

  const { data, error } = await q.order('created_at', { ascending: false })

  if (error) {
    throw new Error(`[inventory/store] listItems failed: ${error.message}`)
  }

  return (data ?? []) as InventoryItem[]
}

// ─── getItemById ─────────────────────────────────────────────────────────────

export async function getItemById(id: string): Promise<InventoryItem | null> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw new Error(`[inventory/store] getItemById failed for "${id}": ${error.message}`)
  }

  return (data ?? null) as InventoryItem | null
}

// ─── upsertItems ──────────────────────────────────────────────────────────────

/**
 * Inserts a batch of items. Does NOT upsert by default — use clearAll() first
 * if you want a clean state. Per-row errors are collected and returned without
 * aborting the whole batch.
 */
export async function upsertItems(
  items: Partial<InventoryItem>[],
): Promise<{ inserted: number; errors: RowError[] }> {
  if (items.length === 0) {
    return { inserted: 0, errors: [] }
  }

  const errors: RowError[] = []
  let inserted = 0

  // Insert in batch for efficiency; fall back to row-by-row on batch failure.
  const { error: batchError } = await supabase
    .from('inventory_items')
    .insert(items)

  if (!batchError) {
    inserted = items.length
  } else {
    // Batch rejected — insert row by row to collect per-row errors.
    for (let i = 0; i < items.length; i++) {
      const { error: rowError } = await supabase
        .from('inventory_items')
        .insert(items[i])

      if (rowError) {
        errors.push({ row: i + 1, error: rowError.message })
      } else {
        inserted++
      }
    }
  }

  return { inserted, errors }
}

// ─── deleteItem ───────────────────────────────────────────────────────────────

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`[inventory/store] deleteItem failed for "${id}": ${error.message}`)
  }
}

// ─── clearAll ─────────────────────────────────────────────────────────────────

/**
 * Deletes ALL rows from inventory_items.
 * Supabase requires at least one filter on .delete() for safety —
 * we use a "not equals a nil UUID" trick that always matches all real rows.
 */
export async function clearAll(): Promise<{ deleted: number }> {
  const { data, error } = await supabase
    .from('inventory_items')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
    .select('id')

  if (error) {
    throw new Error(`[inventory/store] clearAll failed: ${error.message}`)
  }

  return { deleted: (data ?? []).length }
}
