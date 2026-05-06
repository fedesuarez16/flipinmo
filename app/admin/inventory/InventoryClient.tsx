'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type InventoryItem = {
  id: string
  type: string
  title: string
  location: string
  price: number | null
  currency: string
  bedrooms: number | null
  area_m2: number | null
  status: string
}

type RowError = {
  row: number
  error: string
}

type UploadResult = {
  inserted: number
  errors: RowError[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncateId(id: string): string {
  return id.slice(0, 8) + '…'
}

function formatPrice(price: number | null, currency: string): string {
  if (price === null) return '—'
  return `${currency} ${price.toLocaleString('es-AR')}`
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    available: 'Disponible',
    reserved: 'Reservado',
    sold: 'Vendido',
  }
  return labels[status] ?? status
}

function statusClasses(status: string): string {
  switch (status) {
    case 'available':
      return 'bg-beige-50 text-beige-600 border border-beige-200'
    case 'reserved':
      return 'bg-amber-50 text-amber-700 border border-amber-200'
    case 'sold':
      return 'bg-neutral-100 text-neutral-500 border border-neutral-200'
    default:
      return 'bg-neutral-100 text-neutral-500 border border-neutral-200'
  }
}

// ─── InventoryClient ──────────────────────────────────────────────────────────

export function InventoryClient() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [clearPending, setClearPending] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ── Load items ─────────────────────────────────────────────────────────────

  const loadItems = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/inventory')
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const json = (await res.json()) as { items: InventoryItem[] }
      setItems(json.items)
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : 'No se pudo cargar el inventario.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  // ── Upload CSV ─────────────────────────────────────────────────────────────

  const handleUploadCsv = async () => {
    if (!input.trim() || pending) return
    setPending(true)
    setUploadResult(null)
    setUploadError(null)

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'content-type': 'text/csv' },
        body: input,
      })
      const json = (await res.json()) as UploadResult | { error: string }

      if ('error' in json) {
        setUploadError(json.error)
      } else {
        setUploadResult(json)
        await loadItems()
      }
    } catch {
      setUploadError('No se pudo conectar con el servidor.')
    } finally {
      setPending(false)
    }
  }

  // ── Upload JSON ────────────────────────────────────────────────────────────

  const handleUploadJson = async () => {
    if (!input.trim() || pending) return

    let parsed: unknown
    try {
      parsed = JSON.parse(input)
    } catch {
      setUploadError('El contenido no es JSON válido.')
      return
    }

    if (!Array.isArray(parsed)) {
      setUploadError('El JSON debe ser un array de ítems.')
      return
    }

    setPending(true)
    setUploadResult(null)
    setUploadError(null)

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed),
      })
      const json = (await res.json()) as UploadResult | { error: string }

      if ('error' in json) {
        setUploadError(json.error)
      } else {
        setUploadResult(json)
        await loadItems()
      }
    } catch {
      setUploadError('No se pudo conectar con el servidor.')
    } finally {
      setPending(false)
    }
  }

  // ── Delete one item ────────────────────────────────────────────────────────

  const handleDelete = async (id: string) => {
    if (deletingId) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) {
        const json = (await res.json()) as { error?: string }
        alert(json.error ?? 'No se pudo eliminar el ítem.')
      }
      await loadItems()
    } catch {
      alert('No se pudo conectar con el servidor.')
    } finally {
      setDeletingId(null)
    }
  }

  // ── Clear all ──────────────────────────────────────────────────────────────

  const handleClearAll = async () => {
    if (clearPending) return
    const confirmed = window.confirm(
      '¿Estás seguro de que querés borrar TODOS los ítems del inventario? Esta acción no se puede deshacer.',
    )
    if (!confirmed) return

    setClearPending(true)
    try {
      const res = await fetch('/api/admin/inventory', { method: 'DELETE' })
      const json = (await res.json()) as { deleted?: number; error?: string }
      if (json.error) {
        alert(json.error)
      } else {
        await loadItems()
      }
    } catch {
      alert('No se pudo conectar con el servidor.')
    } finally {
      setClearPending(false)
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Page header */}
      <header className="mb-10">
        <p className="mb-1 font-serif italic text-beige-500 text-sm tracking-wide">
          — Admin
        </p>
        <h1 className="font-sans text-3xl font-bold text-ink">
          Inventario
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Subí ítems en formato CSV o JSON. Los errores por fila se muestran debajo del formulario.
        </p>
      </header>

      {/* Upload section */}
      <section className="mb-10 rounded-2xl border border-beige-100 bg-beige-50 p-6">
        <h2 className="mb-3 font-sans text-base font-semibold text-ink">
          Subir ítems
        </h2>

        {/* CSV format hint */}
        <p className="mb-3 text-xs text-neutral-500">
          Formato CSV esperado (primera fila = encabezado, features separados por |):
        </p>
        <pre className="mb-4 overflow-x-auto rounded-lg bg-ink px-4 py-3 text-xs text-cream">
          {`type,title,location,price,currency,bedrooms,bathrooms,area_m2,description,features,status\napartment,"Depto Palermo","Palermo, CABA",180000,USD,2,1,52,"Luminoso",pool|garage,available`}
        </pre>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          placeholder="Pegá tu CSV o JSON aquí…"
          className="w-full rounded-xl border border-beige-200 bg-white p-3 font-mono text-xs text-ink placeholder-neutral-400 focus:border-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-200 resize-y"
        />

        <div className="mt-3 flex flex-wrap gap-3">
          <button
            onClick={handleUploadCsv}
            disabled={!input.trim() || pending}
            className="rounded-full border border-ink bg-ink px-5 py-2 text-sm font-medium text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? 'Subiendo…' : 'Subir CSV'}
          </button>

          <button
            onClick={handleUploadJson}
            disabled={!input.trim() || pending}
            className="rounded-full border border-beige-300 bg-white px-5 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? 'Subiendo…' : 'Subir JSON'}
          </button>
        </div>

        {/* Upload result */}
        {uploadResult && (
          <div className="mt-4 rounded-xl border border-beige-200 bg-white p-4 text-sm">
            <p className="font-medium text-ink">
              {uploadResult.inserted} ítem{uploadResult.inserted !== 1 ? 's' : ''} insertado{uploadResult.inserted !== 1 ? 's' : ''} correctamente.
            </p>
            {uploadResult.errors.length > 0 && (
              <div className="mt-2">
                <p className="mb-1 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  Errores por fila
                </p>
                <ul className="space-y-1">
                  {uploadResult.errors.map((e, i) => (
                    <li key={i} className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      <span className="font-semibold">Fila {e.row}:</span> {e.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Upload error */}
        {uploadError && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {uploadError}
          </p>
        )}
      </section>

      {/* Inventory table */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-sans text-base font-semibold text-ink">
            Ítems actuales{' '}
            {!loading && (
              <span className="text-sm font-normal text-neutral-400">
                ({items.length})
              </span>
            )}
          </h2>

          <button
            onClick={handleClearAll}
            disabled={clearPending || items.length === 0}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-700 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {clearPending ? 'Borrando…' : 'Borrar todo'}
          </button>
        </div>

        {loadError && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-neutral-400">Cargando inventario…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-beige-200 px-6 py-12 text-center text-neutral-400">
            <p className="text-sm">No hay ítems en el inventario.</p>
            <p className="mt-1 text-xs">Subí un CSV o JSON para agregar ítems.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-beige-100">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-beige-100 bg-beige-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-neutral-500">ID</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Tipo</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Título</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Ubicación</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Precio</th>
                  <th className="px-4 py-3 font-medium text-neutral-500">Estado</th>
                  <th className="px-4 py-3 font-medium text-neutral-500 text-right">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-50 bg-white">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-beige-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-neutral-400">
                      {truncateId(item.id)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{item.type}</td>
                    <td className="px-4 py-3 font-medium text-ink">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{item.location}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {formatPrice(item.price, item.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses(item.status)}`}
                      >
                        {statusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="rounded-full border border-red-100 px-3 py-1 text-xs text-red-600 transition-opacity hover:bg-red-50 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {deletingId === item.id ? 'Borrando…' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
