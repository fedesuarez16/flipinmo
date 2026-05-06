import { deleteItem, getItemById } from '@/lib/inventory/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ─── DELETE /api/admin/inventory/[id] ────────────────────────────────────────

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
): Promise<Response> {
  const { id } = params

  if (!id) {
    return Response.json({ error: 'id es requerido.' }, { status: 400 })
  }

  // Check existence first to return 404 when item not found.
  let exists: boolean
  try {
    const item = await getItemById(id)
    exists = item !== null
  } catch (err) {
    console.error(`[DELETE /api/admin/inventory/${id}] getItemById failed:`, err)
    return Response.json({ error: 'Error al verificar el ítem.' }, { status: 500 })
  }

  if (!exists) {
    return Response.json({ error: 'Ítem no encontrado.' }, { status: 404 })
  }

  try {
    await deleteItem(id)
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error(`[DELETE /api/admin/inventory/${id}] deleteItem failed:`, err)
    return Response.json({ error: 'No se pudo eliminar el ítem.' }, { status: 500 })
  }
}
