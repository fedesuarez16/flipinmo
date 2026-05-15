'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { exportInventoryCsv } from '@/lib/inventory/csv'
import { SystemPromptEditor } from './SystemPromptEditor'

// ─── Types ────────────────────────────────────────────────────────────────────

type InventoryItem = {
  id: string
  type: string
  title: string
  location: string
  zona: string | null
  price: number | null
  currency: string
  bedrooms: number | null
  bathrooms: number | null
  area_m2: number | null
  description: string | null
  features: string[]
  status: string
}

type FormState = {
  type: string
  title: string
  location: string
  zona: string
  price: string
  currency: string
  bedrooms: string
  bathrooms: string
  area_m2: string
  description: string
  features: string
  status: string
}

const EMPTY_FORM: FormState = {
  type: '',
  title: '',
  location: '',
  zona: '',
  price: '',
  currency: 'ARS',
  bedrooms: '',
  bathrooms: '',
  area_m2: '',
  description: '',
  features: '',
  status: 'available',
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

// ─── Form helpers ─────────────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-xl border border-beige-200 bg-white px-3 py-2 text-sm text-ink placeholder-neutral-400 focus:border-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-200'

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string
  htmlFor: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-medium text-neutral-500"
      >
        {label}
      </label>
      {children}
    </div>
  )
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

  const [formOpen, setFormOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [createPending, setCreatePending] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // ── Create one item via form ───────────────────────────────────────────────

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (createPending) return

    if (!form.type.trim() || !form.title.trim() || !form.location.trim()) {
      setCreateError('Tipo, título y ubicación son obligatorios.')
      return
    }

    const parseNum = (raw: string): number | null => {
      const t = raw.trim()
      if (!t) return null
      const n = Number(t)
      return isNaN(n) ? null : n
    }

    const features = form.features
      .split(/[|,]/)
      .map((f) => f.trim())
      .filter(Boolean)

    const item = {
      type: form.type.trim(),
      title: form.title.trim(),
      location: form.location.trim(),
      zona: form.zona.trim() || null,
      price: parseNum(form.price),
      currency: form.currency.trim() || 'ARS',
      bedrooms: parseNum(form.bedrooms),
      bathrooms: parseNum(form.bathrooms),
      area_m2: parseNum(form.area_m2),
      description: form.description.trim() || null,
      features,
      status: form.status || 'available',
    }

    setCreatePending(true)
    setCreateError(null)

    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify([item]),
      })
      const json = (await res.json()) as
        | { inserted: number; errors: RowError[] }
        | { error: string }

      if ('error' in json) {
        setCreateError(json.error)
        return
      }
      if (json.errors.length > 0) {
        setCreateError(json.errors[0].error)
        return
      }

      setForm(EMPTY_FORM)
      setFormOpen(false)
      await loadItems()
    } catch {
      setCreateError('No se pudo conectar con el servidor.')
    } finally {
      setCreatePending(false)
    }
  }

  // ── Load file into textarea ────────────────────────────────────────────────

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)
    setUploadResult(null)
    try {
      const text = await file.text()
      setInput(text)
    } catch {
      setUploadError('No se pudo leer el archivo.')
    } finally {
      // Reset so picking the same file again re-triggers onChange.
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ── Export CSV ─────────────────────────────────────────────────────────────

  const handleExportCsv = () => {
    if (items.length === 0) return
    const csv = exportInventoryCsv(items)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const stamp = new Date().toISOString().slice(0, 10)
    a.download = `inventario-${stamp}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const updateForm = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

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

      {/* System prompt editor */}
      <SystemPromptEditor />

      {/* New property form (collapsible) */}
      <section className="mb-6 rounded-2xl border border-beige-100 bg-white">
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="font-sans text-base font-semibold text-ink">
            Nueva propiedad
          </span>
          <span className="text-xs text-neutral-500">
            {formOpen ? 'Cerrar' : 'Cargar manualmente'}
          </span>
        </button>

        {formOpen && (
          <form onSubmit={handleCreateItem} className="border-t border-beige-100 px-6 py-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tipo *" htmlFor="f-type">
                <input
                  id="f-type"
                  type="text"
                  value={form.type}
                  onChange={(e) => updateForm('type', e.target.value)}
                  placeholder="apartment, house, office…"
                  className={inputCls}
                />
              </Field>

              <Field label="Título *" htmlFor="f-title">
                <input
                  id="f-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="Depto 2 amb con balcón"
                  className={inputCls}
                />
              </Field>

              <Field label="Ubicación *" htmlFor="f-location">
                <input
                  id="f-location"
                  type="text"
                  value={form.location}
                  onChange={(e) => updateForm('location', e.target.value)}
                  placeholder="Palermo, CABA"
                  className={inputCls}
                />
              </Field>

              <Field label="Zona" htmlFor="f-zona">
                <input
                  id="f-zona"
                  type="text"
                  value={form.zona}
                  onChange={(e) => updateForm('zona', e.target.value)}
                  placeholder="centro, este, oeste…"
                  className={inputCls}
                />
              </Field>

              <Field label="Precio" htmlFor="f-price">
                <input
                  id="f-price"
                  type="number"
                  value={form.price}
                  onChange={(e) => updateForm('price', e.target.value)}
                  placeholder="180000"
                  className={inputCls}
                />
              </Field>

              <Field label="Moneda" htmlFor="f-currency">
                <select
                  id="f-currency"
                  value={form.currency}
                  onChange={(e) => updateForm('currency', e.target.value)}
                  className={inputCls}
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </Field>

              <Field label="Dormitorios" htmlFor="f-bedrooms">
                <input
                  id="f-bedrooms"
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => updateForm('bedrooms', e.target.value)}
                  placeholder="2"
                  className={inputCls}
                />
              </Field>

              <Field label="Baños" htmlFor="f-bathrooms">
                <input
                  id="f-bathrooms"
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => updateForm('bathrooms', e.target.value)}
                  placeholder="1"
                  className={inputCls}
                />
              </Field>

              <Field label="Superficie (m²)" htmlFor="f-area">
                <input
                  id="f-area"
                  type="number"
                  value={form.area_m2}
                  onChange={(e) => updateForm('area_m2', e.target.value)}
                  placeholder="52"
                  className={inputCls}
                />
              </Field>

              <Field label="Estado" htmlFor="f-status">
                <select
                  id="f-status"
                  value={form.status}
                  onChange={(e) => updateForm('status', e.target.value)}
                  className={inputCls}
                >
                  <option value="available">Disponible</option>
                  <option value="reserved">Reservado</option>
                  <option value="sold">Vendido</option>
                </select>
              </Field>

              <Field
                label="Features (separadas por | o coma)"
                htmlFor="f-features"
                className="md:col-span-2"
              >
                <input
                  id="f-features"
                  type="text"
                  value={form.features}
                  onChange={(e) => updateForm('features', e.target.value)}
                  placeholder="pool | garage | balcony"
                  className={inputCls}
                />
              </Field>

              <Field label="Descripción" htmlFor="f-desc" className="md:col-span-2">
                <textarea
                  id="f-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  placeholder="Luminoso, vista abierta, cocina integrada…"
                  className={inputCls + ' resize-y'}
                />
              </Field>
            </div>

            {createError && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {createError}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={createPending}
                className="rounded-full border border-ink bg-ink px-5 py-2 text-sm font-medium text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {createPending ? 'Guardando…' : 'Guardar propiedad'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(EMPTY_FORM)
                  setCreateError(null)
                }}
                disabled={createPending}
                className="rounded-full border border-beige-300 bg-white px-5 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Limpiar
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Bulk upload (CSV / JSON) — collapsible */}
      <section className="mb-10 rounded-2xl border border-beige-100 bg-beige-50">
        <button
          type="button"
          onClick={() => setBulkOpen((v) => !v)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <span className="font-sans text-base font-semibold text-ink">
            Importar CSV o JSON
          </span>
          <span className="text-xs text-neutral-500">
            {bulkOpen ? 'Cerrar' : 'Abrir'}
          </span>
        </button>

        {bulkOpen && (
          <div className="border-t border-beige-100 px-6 py-5">
            {/* CSV format hint */}
            <p className="mb-3 text-xs text-neutral-500">
              Formato CSV esperado (primera fila = encabezado, features separados por |):
            </p>
            <pre className="mb-4 overflow-x-auto rounded-lg bg-ink px-4 py-3 text-xs text-cream">
              {`type,title,location,zona,price,currency,bedrooms,bathrooms,area_m2,description,features,status\napartment,"Depto Palermo","Palermo, CABA",centro,180000,USD,2,1,52,"Luminoso",pool|garage,available`}
            </pre>

            {/* File picker */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                onChange={handleFilePick}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-beige-300 bg-white px-4 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-80"
              >
                Adjuntar archivo…
              </button>
              <span className="text-xs text-neutral-500">
                o pegá el contenido abajo
              </span>
            </div>

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

            {uploadError && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {uploadError}
              </p>
            )}
          </div>
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

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExportCsv}
              disabled={items.length === 0}
              className="rounded-full border border-beige-300 bg-white px-4 py-1.5 text-xs font-medium text-ink transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Exportar CSV
            </button>
            <button
              onClick={handleClearAll}
              disabled={clearPending || items.length === 0}
              className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-700 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {clearPending ? 'Borrando…' : 'Borrar todo'}
            </button>
          </div>
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
                  <th className="px-4 py-3 font-medium text-neutral-500">Zona</th>
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
                      {item.zona ? (
                        <span className="inline-block rounded-full bg-beige-50 px-2.5 py-0.5 text-xs font-medium text-beige-600 border border-beige-200">
                          {item.zona}
                        </span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </td>
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
