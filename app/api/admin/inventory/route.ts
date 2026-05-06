import { listItems, upsertItems, clearAll } from '@/lib/inventory/store'
import { parseInventoryCsv } from '@/lib/inventory/csv'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ─── GET /api/admin/inventory ─────────────────────────────────────────────────

export async function GET(): Promise<Response> {
  try {
    const items = await listItems({ limit: 1000 })
    return Response.json({ items })
  } catch (err) {
    console.error('[GET /api/admin/inventory] listItems failed:', err)
    return Response.json(
      { error: 'No se pudo cargar el inventario.' },
      { status: 500 },
    )
  }
}

// ─── POST /api/admin/inventory ────────────────────────────────────────────────
// Dispatches on Content-Type:
//   text/csv         → parseInventoryCsv → upsertItems
//   application/json → parse array       → upsertItems
//   else             → 415

export async function POST(req: Request): Promise<Response> {
  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.startsWith('text/csv')) {
    let csv: string
    try {
      csv = await req.text()
    } catch {
      return Response.json({ error: 'No se pudo leer el cuerpo CSV.' }, { status: 400 })
    }

    const { rows, errors: parseErrors } = parseInventoryCsv(csv)

    if (rows.length === 0 && parseErrors.length > 0) {
      return Response.json({ inserted: 0, errors: parseErrors }, { status: 422 })
    }

    try {
      const { inserted, errors: insertErrors } = await upsertItems(rows)
      return Response.json({
        inserted,
        errors: [...parseErrors, ...insertErrors],
      })
    } catch (err) {
      console.error('[POST /api/admin/inventory] upsertItems (CSV) failed:', err)
      return Response.json(
        { error: 'Error al insertar ítems.' },
        { status: 500 },
      )
    }
  }

  if (contentType.startsWith('application/json')) {
    let payload: unknown
    try {
      payload = await req.json()
    } catch {
      return Response.json({ error: 'JSON inválido.' }, { status: 400 })
    }

    if (!Array.isArray(payload)) {
      return Response.json(
        { error: 'El cuerpo debe ser un array JSON de ítems.' },
        { status: 422 },
      )
    }

    try {
      const { inserted, errors } = await upsertItems(payload)
      return Response.json({ inserted, errors })
    } catch (err) {
      console.error('[POST /api/admin/inventory] upsertItems (JSON) failed:', err)
      return Response.json(
        { error: 'Error al insertar ítems.' },
        { status: 500 },
      )
    }
  }

  return Response.json(
    { error: 'Content-Type debe ser text/csv o application/json.' },
    { status: 415 },
  )
}

// ─── DELETE /api/admin/inventory ─────────────────────────────────────────────

export async function DELETE(): Promise<Response> {
  try {
    const { deleted } = await clearAll()
    return Response.json({ deleted })
  } catch (err) {
    console.error('[DELETE /api/admin/inventory] clearAll failed:', err)
    return Response.json(
      { error: 'No se pudo borrar el inventario.' },
      { status: 500 },
    )
  }
}
