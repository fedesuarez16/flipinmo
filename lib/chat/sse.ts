// SSE frame-writing helpers.
// No 'server-only' guard needed here — this module has no SDK deps and is
// only ever called from API route handlers (which are already server-side).

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
