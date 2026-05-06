import 'server-only'

import type Anthropic from '@anthropic-ai/sdk'
import { getSupabase } from '@/lib/supabase'
import { resetLeadProfile } from '@/lib/chat/profile'
import { resetFollowups } from '@/lib/chat/followups'

// ─── JSONB content block shapes ──────────────────────────────────────────────
// These mirror Anthropic's content array serialised verbatim into Postgres.

type TextBlock = {
  type: 'text'
  text: string
}

type ToolUseBlock = {
  type: 'tool_use'
  id: string
  name: string
  input: Record<string, unknown>
}

type ToolResultContentItem =
  | string
  | Array<{ type: 'text'; text: string } | { type: 'image'; source: unknown }>

type ToolResultBlock = {
  type: 'tool_result'
  tool_use_id: string
  content: ToolResultContentItem
}

export type ContentBlock = TextBlock | ToolUseBlock | ToolResultBlock

// ─── Session helpers ──────────────────────────────────────────────────────────

/**
 * Returns the DB uuid for a given client session id.
 * Upserts the row so calling this is always safe regardless of whether
 * the session already exists.
 */
async function getOrCreateSession(clientSessionId: string): Promise<string> {
  const { data, error } = await getSupabase()
    .from('chat_sessions')
    .upsert(
      { client_session_id: clientSessionId, updated_at: new Date().toISOString() },
      { onConflict: 'client_session_id', ignoreDuplicates: false },
    )
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(
      `[history] getOrCreateSession failed for "${clientSessionId}": ${error?.message ?? 'no data returned'}`,
    )
  }

  return data.id as string
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Loads the last 20 messages for the session in Anthropic MessageParam shape,
 * oldest first. If the session doesn't exist yet it is created.
 */
export async function loadHistory(
  clientSessionId: string,
): Promise<Anthropic.MessageParam[]> {
  const sessionId = await getOrCreateSession(clientSessionId)

  const { data, error } = await getSupabase()
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    throw new Error(
      `[history] loadHistory failed for session "${clientSessionId}": ${error.message}`,
    )
  }

  // Reverse so oldest is first (we fetched DESC to apply LIMIT correctly).
  const rows = (data ?? []).reverse()

  return rows.map((row) => ({
    role: row.role as 'user' | 'assistant',
    // content is stored as a JSONB array — pass through directly.
    content: row.content as Anthropic.MessageParam['content'],
  }))
}

/**
 * Persists a message to the DB.
 *
 * A plain string `content` is normalised to `[{ type: 'text', text }]`
 * for consistency with the JSONB content-array contract.
 */
export async function appendMessage(
  clientSessionId: string,
  role: 'user' | 'assistant',
  content: ContentBlock[] | string,
): Promise<void> {
  const sessionId = await getOrCreateSession(clientSessionId)

  const blocks: ContentBlock[] =
    typeof content === 'string'
      ? [{ type: 'text', text: content }]
      : content

  const { error } = await getSupabase().from('chat_messages').insert({
    session_id: sessionId,
    role,
    content: blocks,
  })

  if (error) {
    throw new Error(
      `[history] appendMessage failed (role="${role}", session="${clientSessionId}"): ${error.message}`,
    )
  }
}

/**
 * Resets a session to a clean slate: clears the lead_profile FIRST, then
 * deletes all chat_messages. Order is intentional per design D-11:
 * - If profile reset fails → 500 is returned and messages remain intact
 *   (partial state where messages survive is less confusing than the reverse).
 * - If profile reset succeeds and message delete fails → profile is already
 *   cleared; the caller should propagate the error.
 *
 * Used by DELETE /api/chat.
 */
export async function resetSession(clientSessionId: string): Promise<void> {
  // Step 1: reset profile FIRST (D-11). Throws on failure → caller gets 500,
  // messages are untouched.
  await resetLeadProfile(clientSessionId)

  // Step 1b: reset followups. Same cascade rule — fail before touching messages.
  await resetFollowups(clientSessionId)

  // Step 2: delete messages.
  const sessionId = await getOrCreateSession(clientSessionId)

  const { error } = await getSupabase()
    .from('chat_messages')
    .delete()
    .eq('session_id', sessionId)

  if (error) {
    throw new Error(
      `[history] resetSession failed for session "${clientSessionId}": ${error.message}`,
    )
  }
}
