import {
  DEFAULT_SYSTEM_PROMPT,
  SYSTEM_PROMPT_KEY,
  getSystemPrompt,
} from '@/lib/chat/system-prompt'
import { deleteSetting, setSetting } from '@/lib/settings/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_PROMPT_LENGTH = 32_000

// ─── GET /api/admin/system-prompt ─────────────────────────────────────────────
// Returns the current effective prompt + the hardcoded default so the UI can
// offer a "restore default" action.

export async function GET(): Promise<Response> {
  try {
    const current = await getSystemPrompt()
    return Response.json({
      current,
      default: DEFAULT_SYSTEM_PROMPT,
      isDefault: current === DEFAULT_SYSTEM_PROMPT,
    })
  } catch (err) {
    console.error('[GET /api/admin/system-prompt] failed:', err)
    return Response.json(
      { error: 'No se pudo cargar el prompt.' },
      { status: 500 },
    )
  }
}

// ─── PUT /api/admin/system-prompt ─────────────────────────────────────────────
// Body: { prompt: string }
// Saves the prompt as the new active system message for the chat agent.

export async function PUT(req: Request): Promise<Response> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'JSON inválido.' }, { status: 400 })
  }

  if (
    !body ||
    typeof body !== 'object' ||
    typeof (body as { prompt?: unknown }).prompt !== 'string'
  ) {
    return Response.json(
      { error: 'Falta el campo "prompt" (string).' },
      { status: 400 },
    )
  }

  const prompt = (body as { prompt: string }).prompt
  const trimmed = prompt.trim()

  if (trimmed.length === 0) {
    return Response.json(
      { error: 'El prompt no puede estar vacío.' },
      { status: 422 },
    )
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return Response.json(
      { error: `El prompt excede ${MAX_PROMPT_LENGTH} caracteres.` },
      { status: 422 },
    )
  }

  try {
    await setSetting(SYSTEM_PROMPT_KEY, prompt)
    return Response.json({ ok: true, current: prompt })
  } catch (err) {
    console.error('[PUT /api/admin/system-prompt] failed:', err)
    return Response.json(
      { error: 'No se pudo guardar el prompt.' },
      { status: 500 },
    )
  }
}

// ─── DELETE /api/admin/system-prompt ──────────────────────────────────────────
// Removes the stored override, restoring the hardcoded default.

export async function DELETE(): Promise<Response> {
  try {
    await deleteSetting(SYSTEM_PROMPT_KEY)
    return Response.json({ ok: true, current: DEFAULT_SYSTEM_PROMPT })
  } catch (err) {
    console.error('[DELETE /api/admin/system-prompt] failed:', err)
    return Response.json(
      { error: 'No se pudo restaurar el prompt.' },
      { status: 500 },
    )
  }
}
