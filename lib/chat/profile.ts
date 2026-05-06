import 'server-only'

import { getSupabase } from '@/lib/supabase'

// ─── Re-export types from the client-safe module ─────────────────────────────
// Types and enum arrays live in profile-types.ts (no server-only) so client
// components can import them without triggering a build error. Server code
// imports from here (profile.ts) and gets everything in one place.

export type {
  Intent,
  PropertyType,
  Currency,
  Urgency,
  Temperature,
  LeadProfile,
  LeadProfilePatch,
} from '@/lib/chat/profile-types'

export {
  INTENTS,
  PROPERTY_TYPES,
  CURRENCIES,
  URGENCIES,
  TEMPERATURES,
} from '@/lib/chat/profile-types'

// Pull the types into scope for use in the helper functions below.
import type {
  Intent,
  PropertyType,
  Currency,
  Urgency,
  Temperature,
  LeadProfile,
  LeadProfilePatch,
} from '@/lib/chat/profile-types'
import {
  INTENTS,
  PROPERTY_TYPES,
  CURRENCIES,
  URGENCIES,
  TEMPERATURES,
} from '@/lib/chat/profile-types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isProfileEmpty(profile: LeadProfile): boolean {
  return Object.keys(profile).length === 0
}

// ─── Deep-merge logic ─────────────────────────────────────────────────────────

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/**
 * Merge `patch` into `current` following the design-locked semantics:
 * - `null` value → delete the key from the result.
 * - Array value → REPLACE (never append).
 * - Plain object (contact, budget) → recurse.
 * - Scalar → overwrite.
 * - Key absent in patch → keep current value.
 */
function deepMergeLeadProfile(
  current: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...current }

  for (const key of Object.keys(patch)) {
    const patchVal = patch[key]

    if (patchVal === null) {
      // Explicit null ⇒ remove the field.
      delete result[key]
    } else if (Array.isArray(patchVal)) {
      // Arrays REPLACE.
      result[key] = patchVal
    } else if (isPlainObject(patchVal) && isPlainObject(result[key])) {
      // Both sides are plain objects ⇒ recurse.
      result[key] = deepMergeLeadProfile(
        result[key] as Record<string, unknown>,
        patchVal,
      )
    } else {
      // Scalar or new object where current had no matching key ⇒ assign.
      result[key] = patchVal
    }
  }

  return result
}

// ─── Enum validation ──────────────────────────────────────────────────────────

/**
 * Validate and strip invalid enum values from a raw patch before merging.
 * Invalid values for enum fields are silently dropped; the rest of the patch
 * is still applied (per spec Domain 1 and design §4).
 */
function validateEnums(patch: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = { ...patch }

  if ('intent' in clean && clean['intent'] !== null) {
    if (!INTENTS.includes(clean['intent'] as Intent)) {
      delete clean['intent']
    }
  }

  if ('urgency' in clean && clean['urgency'] !== null) {
    if (!URGENCIES.includes(clean['urgency'] as Urgency)) {
      delete clean['urgency']
    }
  }

  if ('temperature' in clean && clean['temperature'] !== null) {
    if (!TEMPERATURES.includes(clean['temperature'] as Temperature)) {
      delete clean['temperature']
    }
  }

  if ('property_types' in clean && Array.isArray(clean['property_types'])) {
    const validated = (clean['property_types'] as unknown[]).filter(
      (v) => typeof v === 'string' && PROPERTY_TYPES.includes(v as PropertyType),
    )
    clean['property_types'] = validated
  }

  // Validate currency inside budget object.
  if (
    'budget' in clean &&
    isPlainObject(clean['budget']) &&
    'currency' in (clean['budget'] as Record<string, unknown>)
  ) {
    const budget = { ...(clean['budget'] as Record<string, unknown>) }
    if (
      budget['currency'] !== null &&
      !CURRENCIES.includes(budget['currency'] as Currency)
    ) {
      delete budget['currency']
    }
    clean['budget'] = budget
  }

  return clean
}

// ─── Deep-equal check ────────────────────────────────────────────────────────

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== typeof b) return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((v, i) => deepEqual(v, b[i]))
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every((k) => deepEqual(a[k], b[k]))
  }
  return false
}

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Returns the stored `lead_profile` for a session, or `{}` if the session
 * does not exist. Does NOT create the session row.
 */
export async function getLeadProfile(
  clientSessionId: string,
): Promise<LeadProfile> {
  const { data, error } = await getSupabase()
    .from('chat_sessions')
    .select('lead_profile')
    .eq('client_session_id', clientSessionId)
    .maybeSingle()

  if (error) {
    throw new Error(
      `[profile] getLeadProfile failed for "${clientSessionId}": ${error.message}`,
    )
  }

  if (!data) return {}

  return (data.lead_profile ?? {}) as LeadProfile
}

/**
 * Merge a patch into the stored profile for a session.
 *
 * Steps:
 * 1. Validate enums — drop invalid leaf values, keep rest.
 * 2. Fetch current profile.
 * 3. Deep-merge using design-locked semantics (null=remove, array=replace, object=recurse).
 * 4. If merged === current, short-circuit with no DB write.
 * 5. Otherwise UPDATE chat_sessions SET lead_profile = merged WHERE client_session_id.
 *
 * Throws if the session row does not exist — session creation is the caller's
 * responsibility (done earlier in the chat POST flow via loadHistory → getOrCreateSession).
 *
 * Returns `{ profile, changed }`.
 */
export async function mergeLeadProfile(
  clientSessionId: string,
  patch: LeadProfilePatch,
): Promise<{ profile: LeadProfile; changed: boolean }> {
  const validatedPatch = validateEnums(
    patch as Record<string, unknown>,
  ) as LeadProfilePatch

  const current = await getLeadProfile(clientSessionId)

  const merged = deepMergeLeadProfile(
    current as Record<string, unknown>,
    validatedPatch as Record<string, unknown>,
  ) as LeadProfile

  if (deepEqual(merged, current)) {
    return { profile: current, changed: false }
  }

  const { error } = await getSupabase()
    .from('chat_sessions')
    .update({ lead_profile: merged, updated_at: new Date().toISOString() })
    .eq('client_session_id', clientSessionId)

  if (error) {
    throw new Error(
      `[profile] mergeLeadProfile failed for "${clientSessionId}": ${error.message}`,
    )
  }

  return { profile: merged, changed: true }
}

/**
 * Resets the lead_profile to `{}` for a session.
 * No error if the row does not exist.
 */
export async function resetLeadProfile(
  clientSessionId: string,
): Promise<void> {
  const { error } = await getSupabase()
    .from('chat_sessions')
    .update({ lead_profile: {}, updated_at: new Date().toISOString() })
    .eq('client_session_id', clientSessionId)

  if (error) {
    throw new Error(
      `[profile] resetLeadProfile failed for "${clientSessionId}": ${error.message}`,
    )
  }
}
