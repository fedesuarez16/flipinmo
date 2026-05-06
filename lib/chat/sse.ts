// SSE frame-writing helpers.
// No 'server-only' guard needed here — this module has no SDK deps and is
// only ever called from API route handlers (which are already server-side).

import type { Followup, LeadProfile } from '@/lib/chat/profile-types'

const encoder = new TextEncoder()

function write(
  controller: ReadableStreamDefaultController<Uint8Array>,
  raw: string,
): void {
  controller.enqueue(encoder.encode(raw))
}

/**
 * Emits: event: text\ndata: {"delta":"..."}\n\n
 */
export function writeText(
  controller: ReadableStreamDefaultController<Uint8Array>,
  delta: string,
): void {
  write(controller, `event: text\ndata: ${JSON.stringify({ delta })}\n\n`)
}

/**
 * Emits: event: tool\ndata: {"name":"...","status":"..."}\n\n
 * Decision D-2: single 'tool' event with status discriminator ('running' | 'done' | 'error').
 */
export function writeTool(
  controller: ReadableStreamDefaultController<Uint8Array>,
  name: string,
  status: 'running' | 'done' | 'error',
): void {
  write(controller, `event: tool\ndata: ${JSON.stringify({ name, status })}\n\n`)
}

/**
 * Emits: event: error\ndata: {"message":"..."}\n\n
 * Terminal — no frames should follow.
 */
export function writeError(
  controller: ReadableStreamDefaultController<Uint8Array>,
  message: string,
): void {
  write(controller, `event: error\ndata: ${JSON.stringify({ message })}\n\n`)
}

/**
 * Emits: event: done\ndata: {}\n\n
 * Terminal — no frames should follow.
 */
export function writeDone(
  controller: ReadableStreamDefaultController<Uint8Array>,
): void {
  write(controller, `event: done\ndata: {}\n\n`)
}

/**
 * Emits: event: profile\ndata: {full LeadProfile JSON}\n\n
 * Carries the FULL profile (not a diff) so the client can atomically replace
 * its local state. Only emitted when a tool call produces a profileUpdate.
 */
export function writeProfile(
  controller: ReadableStreamDefaultController<Uint8Array>,
  profile: LeadProfile,
): void {
  write(controller, `event: profile\ndata: ${JSON.stringify(profile)}\n\n`)
}

/**
 * Emits: event: followups\ndata: [Followup, ...]\n\n
 * Carries the FULL followups array so the client can atomically replace state.
 * Only emitted after a successful schedule_followup tool call.
 */
export function writeFollowups(
  controller: ReadableStreamDefaultController<Uint8Array>,
  followups: Followup[],
): void {
  write(controller, `event: followups\ndata: ${JSON.stringify(followups)}\n\n`)
}
