import 'server-only'

import { getSupabase } from '@/lib/supabase'
import {
  FOLLOWUP_CHANNELS,
  type Followup,
  type FollowupChannel,
} from '@/lib/chat/profile-types'

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Returns the stored followups array for a session, or [] if the session does
 * not exist. Does NOT create the session row.
 */
export async function getFollowups(
  clientSessionId: string,
): Promise<Followup[]> {
  const { data, error } = await getSupabase()
    .from('chat_sessions')
    .select('followups')
    .eq('client_session_id', clientSessionId)
    .maybeSingle()

  if (error) {
    throw new Error(
      `[followups] getFollowups failed for "${clientSessionId}": ${error.message}`,
    )
  }

  if (!data) return []

  return (data.followups ?? []) as Followup[]
}

/**
 * Append a new followup to the array.
 * Validates `channel` against the enum — invalid values are rejected (throws).
 * Returns the FULL updated followups array so callers can emit it via SSE.
 */
export async function addFollowup(
  clientSessionId: string,
  input: { when: string; channel: string; note: string },
): Promise<Followup[]> {
  const when = input.when?.trim()
  const note = input.note?.trim()
  const channel = input.channel as FollowupChannel

  if (!when || !note) {
    throw new Error('[followups] addFollowup: "when" and "note" are required.')
  }
  if (!FOLLOWUP_CHANNELS.includes(channel)) {
    throw new Error(
      `[followups] addFollowup: invalid channel "${input.channel}".`,
    )
  }

  const current = await getFollowups(clientSessionId)
  const next: Followup = {
    id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    when,
    channel,
    note,
    created_at: new Date().toISOString(),
  }
  const merged = [...current, next]

  const { error } = await getSupabase()
    .from('chat_sessions')
    .update({ followups: merged, updated_at: new Date().toISOString() })
    .eq('client_session_id', clientSessionId)

  if (error) {
    throw new Error(
      `[followups] addFollowup failed for "${clientSessionId}": ${error.message}`,
    )
  }

  return merged
}

/**
 * Resets the followups array to []. No-op if the session row does not exist.
 */
export async function resetFollowups(
  clientSessionId: string,
): Promise<void> {
  const { error } = await getSupabase()
    .from('chat_sessions')
    .update({ followups: [], updated_at: new Date().toISOString() })
    .eq('client_session_id', clientSessionId)

  if (error) {
    throw new Error(
      `[followups] resetFollowups failed for "${clientSessionId}": ${error.message}`,
    )
  }
}
