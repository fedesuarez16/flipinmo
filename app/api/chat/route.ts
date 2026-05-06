import { writeError } from '@/lib/chat/sse'
import { runAgent } from '@/lib/chat/agent-loop'

// Node runtime required — Anthropic SDK streaming breaks on Edge (see design §11).
export const runtime = 'nodejs'
// force-dynamic prevents Next.js from buffering the SSE stream.
export const dynamic = 'force-dynamic'

const SSE_HEADERS: ResponseInit['headers'] = {
  'content-type': 'text/event-stream',
  'cache-control': 'no-cache, no-transform',
  connection: 'keep-alive',
}

type ChatBody = {
  sessionId?: unknown
  message?: unknown
}

// ─── POST /api/chat — SSE streaming (agentic loop) ───────────────────────────

export async function POST(req: Request): Promise<Response> {
  let body: ChatBody
  try {
    body = (await req.json()) as ChatBody
  } catch {
    return Response.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  const sessionId =
    typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
  const message =
    typeof body.message === 'string' ? body.message.trim() : ''

  if (!sessionId || !message) {
    return Response.json(
      { error: 'sessionId y message son requeridos.' },
      { status: 400 },
    )
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await runAgent({ sessionId, userMessage: message, controller })
      } catch (err) {
        // runAgent handles its own errors internally via writeError.
        // This outer catch handles synchronous throws (e.g. env var missing)
        // that escape before runAgent sets up the loop.
        const msg =
          err instanceof Error ? err.message : 'Error inesperado al iniciar el agente.'
        writeError(controller, msg)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, { headers: SSE_HEADERS })
}

// ─── DELETE /api/chat — reset session ────────────────────────────────────────
// Body: { sessionId: string }
// Decision D-7: JSON body, not query param (symmetric with POST; no UUID encoding).

import { resetSession } from '@/lib/chat/history'

type DeleteBody = {
  sessionId?: unknown
}

export async function DELETE(req: Request): Promise<Response> {
  let body: DeleteBody
  try {
    body = (await req.json()) as DeleteBody
  } catch {
    return Response.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  const sessionId =
    typeof body.sessionId === 'string' ? body.sessionId.trim() : ''

  if (!sessionId) {
    return Response.json({ error: 'sessionId es requerido.' }, { status: 400 })
  }

  try {
    await resetSession(sessionId)
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/chat] resetSession failed:', err)
    return Response.json(
      { error: 'No se pudo reiniciar la sesión.' },
      { status: 503 },
    )
  }
}
