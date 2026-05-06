import { getLeadProfile } from '@/lib/chat/profile'
import { getFollowups } from '@/lib/chat/followups'

// Node runtime — uses Supabase service-role key (server-only).
export const runtime = 'nodejs'
// force-dynamic: no static caching on this endpoint.
export const dynamic = 'force-dynamic'

// ─── GET /api/chat/profile — hydration endpoint ───────────────────────────────
// Query param: ?sessionId=<clientSessionId>
//
// Responses:
//   200 { profile: LeadProfile, followups: Followup[] }
//   400 { error: string }   — missing sessionId param

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')?.trim() ?? ''

  if (!sessionId) {
    return Response.json({ error: 'sessionId requerido' }, { status: 400 })
  }

  try {
    const [profile, followups] = await Promise.all([
      getLeadProfile(sessionId),
      getFollowups(sessionId),
    ])
    return Response.json({ profile, followups })
  } catch (err) {
    console.error('[GET /api/chat/profile] hydration failed:', err)
    return Response.json(
      { error: 'No se pudo obtener el estado del lead.' },
      { status: 503 },
    )
  }
}
