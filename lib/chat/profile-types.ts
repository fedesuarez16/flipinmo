// ─── Enum types (client-safe — no server-only import) ─────────────────────────
// This file is intentionally free of `import 'server-only'` so that client
// components can import the LeadProfile type without triggering a build error.
// The runtime helpers (getLeadProfile, mergeLeadProfile, etc.) live in
// lib/chat/profile.ts which IS server-only.

export type Intent = 'buy' | 'rent' | 'invest'
export type PropertyType = 'apartment' | 'house' | 'ph' | 'loft' | 'office'
export type Currency = 'USD' | 'ARS'
export type Urgency = 'now' | '3_months' | 'exploring'
export type Temperature = 'frio' | 'tibio' | 'caliente'

export type LeadProfile = {
  name?: string
  contact?: { email?: string; phone?: string }
  intent?: Intent
  property_types?: PropertyType[]
  locations?: string[]
  budget?: { min?: number; max?: number; currency?: Currency }
  bedrooms_min?: number
  must_haves?: string[]
  urgency?: Urgency
  temperature?: Temperature
  notes?: string
}

/**
 * Partial LeadProfile where fields may be explicitly null (used to signal
 * "remove this field" in the merge protocol). Any field absent from the patch
 * is left unchanged in the stored profile.
 */
export type LeadProfilePatch = {
  [K in keyof LeadProfile]?: LeadProfile[K] | null
}

// Runtime enum arrays — kept here so formatters and validators can import them
// without pulling in server-only code.
export const INTENTS: readonly Intent[] = ['buy', 'rent', 'invest']
export const PROPERTY_TYPES: readonly PropertyType[] = [
  'apartment',
  'house',
  'ph',
  'loft',
  'office',
]
export const CURRENCIES: readonly Currency[] = ['USD', 'ARS']
export const URGENCIES: readonly Urgency[] = ['now', '3_months', 'exploring']
export const TEMPERATURES: readonly Temperature[] = ['frio', 'tibio', 'caliente']

// ─── Follow-ups (CRM panel) ───────────────────────────────────────────────────

export type FollowupChannel = 'call' | 'whatsapp' | 'email' | 'visit'

export const FOLLOWUP_CHANNELS: readonly FollowupChannel[] = [
  'call',
  'whatsapp',
  'email',
  'visit',
]

export type Followup = {
  id: string
  /** Human-readable schedule label, e.g. "mañana 10am", "viernes 18hs". */
  when: string
  channel: FollowupChannel
  /** Brief note about what's going to be discussed/done. */
  note: string
  /** ISO timestamp of when the followup was scheduled. */
  created_at: string
}
