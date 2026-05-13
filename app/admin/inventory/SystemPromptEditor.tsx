'use client'

import { useCallback, useEffect, useState } from 'react'

type PromptResponse = {
  current: string
  default: string
  isDefault: boolean
}

export function SystemPromptEditor() {
  const [draft, setDraft] = useState<string>('')
  const [savedValue, setSavedValue] = useState<string>('')
  const [defaultValue, setDefaultValue] = useState<string>('')
  const [isDefault, setIsDefault] = useState<boolean>(true)

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [restoring, setRestoring] = useState(false)
  const [feedback, setFeedback] = useState<
    { kind: 'success' | 'error'; message: string } | null
  >(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch('/api/admin/system-prompt')
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const json = (await res.json()) as PromptResponse
      setDraft(json.current)
      setSavedValue(json.current)
      setDefaultValue(json.default)
      setIsDefault(json.isDefault)
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : 'No se pudo cargar el prompt.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const dirty = draft !== savedValue
  const trimmedEmpty = draft.trim().length === 0

  const handleSave = async () => {
    if (saving || !dirty || trimmedEmpty) return
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/system-prompt', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: draft }),
      })
      const json = (await res.json()) as
        | { ok: true; current: string }
        | { error: string }
      if ('error' in json) {
        setFeedback({ kind: 'error', message: json.error })
      } else {
        setSavedValue(json.current)
        setIsDefault(json.current === defaultValue)
        setFeedback({ kind: 'success', message: 'Prompt guardado.' })
      }
    } catch {
      setFeedback({
        kind: 'error',
        message: 'No se pudo conectar con el servidor.',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleRestore = async () => {
    if (restoring) return
    const confirmed = window.confirm(
      '¿Restaurar el prompt al default? Se perderá lo que tengas guardado actualmente.',
    )
    if (!confirmed) return

    setRestoring(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/system-prompt', { method: 'DELETE' })
      const json = (await res.json()) as
        | { ok: true; current: string }
        | { error: string }
      if ('error' in json) {
        setFeedback({ kind: 'error', message: json.error })
      } else {
        setDraft(json.current)
        setSavedValue(json.current)
        setIsDefault(true)
        setFeedback({ kind: 'success', message: 'Prompt restaurado al default.' })
      }
    } catch {
      setFeedback({
        kind: 'error',
        message: 'No se pudo conectar con el servidor.',
      })
    } finally {
      setRestoring(false)
    }
  }

  const handleRevertEdit = () => {
    setDraft(savedValue)
    setFeedback(null)
  }

  return (
    <section className="mb-10 rounded-2xl border border-beige-100 bg-white p-6">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-sans text-base font-semibold text-ink">
            System prompt del agente
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Este es el mensaje de sistema que recibe el agente de IA en cada
            conversación. Los cambios se aplican en el siguiente mensaje del
            chat.
          </p>
        </div>
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isDefault
              ? 'bg-neutral-100 text-neutral-500 border border-neutral-200'
              : 'bg-beige-50 text-beige-600 border border-beige-200'
          }`}
        >
          {isDefault ? 'Default' : 'Personalizado'}
        </span>
      </header>

      {loadError && (
        <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </p>
      )}

      <textarea
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value)
          if (feedback) setFeedback(null)
        }}
        rows={18}
        disabled={loading}
        placeholder={loading ? 'Cargando prompt…' : 'Escribí el prompt acá…'}
        className="w-full rounded-xl border border-beige-200 bg-white p-3 font-mono text-xs leading-relaxed text-ink placeholder-neutral-400 focus:border-beige-400 focus:outline-none focus:ring-2 focus:ring-beige-200 resize-y disabled:bg-neutral-50 disabled:text-neutral-400"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || loading || !dirty || trimmedEmpty}
          className="rounded-full border border-ink bg-ink px-5 py-2 text-sm font-medium text-cream transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? 'Guardando…' : 'Guardar prompt'}
        </button>

        <button
          onClick={handleRevertEdit}
          disabled={!dirty || saving}
          className="rounded-full border border-beige-300 bg-white px-5 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Descartar cambios
        </button>

        <button
          onClick={handleRestore}
          disabled={restoring || loading || isDefault}
          className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-700 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {restoring ? 'Restaurando…' : 'Restaurar default'}
        </button>

        <span className="ml-auto text-xs text-neutral-400">
          {draft.length.toLocaleString('es-AR')} caracteres
          {dirty && <span className="ml-2 text-amber-600">• sin guardar</span>}
        </span>
      </div>

      {feedback && (
        <p
          className={`mt-3 rounded-xl px-4 py-3 text-sm ${
            feedback.kind === 'success'
              ? 'bg-beige-50 text-beige-600 border border-beige-100'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {feedback.message}
        </p>
      )}
    </section>
  )
}
