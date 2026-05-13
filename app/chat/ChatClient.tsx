'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Followup, LeadProfile } from '@/lib/chat/profile-types'
import CrmPanel from './CrmPanel'
import MobileProfileSheet from './MobileProfileSheet'

type Role = 'assistant' | 'user'

type Message = {
  id: string
  role: Role
  content: string
  /** True while the first delta has not arrived yet — used to show typing dots */
  streaming?: boolean
  /** Unix ms — used for the WhatsApp-style timestamp shown inside the bubble. */
  createdAt?: number
}

const SESSION_STORAGE_KEY = 'flip-chat-session-id'

const SUGGESTIONS = [
  'Busco un 2 ambientes en Palermo',
  '¿Qué tenés disponible hasta 150 mil dólares?',
  'Necesito una casa con jardín en zona norte',
  'Estoy mirando para invertir, ¿qué me recomendás?',
]

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Parse a single SSE message block (the text between two blank lines). */
function parseSseBlock(block: string): { event: string; data: string } | null {
  const lines = block.split('\n')
  let event = 'message'
  let data = ''
  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice('event:'.length).trim()
    } else if (line.startsWith('data:')) {
      data = line.slice('data:'.length).trim()
    }
  }
  if (!data) return null
  return { event, data }
}

/** Shallow-equal two values for the pulse-field change detection. */
function shallowEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  // For arrays and objects compare via JSON stringify — good enough for v1.
  return JSON.stringify(a) === JSON.stringify(b)
}

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>(() => [])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>('')

  // ── Profile state (tasks 2.6) ───────────────────────────────────────────────
  const [leadProfile, setLeadProfile] = useState<LeadProfile>({})
  const [pulseFields, setPulseFields] = useState<Set<string>>(new Set())
  const prevProfileRef = useRef<LeadProfile>({})
  const hasHydratedRef = useRef(false)
  const pulseTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // ── Followups state (CRM panel) ────────────────────────────────────────────
  const [followups, setFollowups] = useState<Followup[]>([])

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Resolve session ID and hydrate profile on mount.
  useEffect(() => {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)
    const id = existing ?? generateSessionId()

    if (!existing) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, id)
    }
    setSessionId(id)

    // Hydrate profile + followups — suppress pulse on initial load via hasHydratedRef.
    fetch(`/api/chat/profile?sessionId=${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((json: { profile?: LeadProfile; followups?: Followup[] }) => {
        // If SSE has already arrived before this fetch resolved, skip the
        // profile to avoid overwriting a fresher value.
        if (Object.keys(prevProfileRef.current).length === 0) {
          setLeadProfile(json.profile ?? {})
          prevProfileRef.current = json.profile ?? {}
        }
        if (json.followups && json.followups.length > 0) {
          setFollowups(json.followups)
        }
        hasHydratedRef.current = true
      })
      .catch(() => {
        // Hydration is best-effort; silently ignore errors.
        hasHydratedRef.current = true
      })
  }, [])

  // Clear pulse timeouts on unmount.
  useEffect(() => {
    return () => {
      pulseTimeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, pending])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [input])

  /**
   * Apply a new profile from a SSE `event: profile` event.
   * Computes which top-level keys changed vs. prevProfileRef and schedules
   * an 800 ms pulse highlight for each changed key.
   * Skips pulse if hydration has not completed yet (suppresses initial flash).
   */
  function applyProfileUpdate(next: LeadProfile) {
    const prev = prevProfileRef.current
    prevProfileRef.current = next
    setLeadProfile(next)

    if (!hasHydratedRef.current) {
      // Hydration not done yet — skip pulse computation.
      return
    }

    const changed = new Set<string>()
    const allKeys = Array.from(
      new Set([...Object.keys(prev), ...Object.keys(next)]),
    )
    for (const k of allKeys) {
      if (!shallowEqual((prev as Record<string, unknown>)[k], (next as Record<string, unknown>)[k])) {
        changed.add(k)
      }
    }

    if (changed.size === 0) return

    setPulseFields((cur) => new Set([...Array.from(cur), ...Array.from(changed)]))

    const timeout = setTimeout(() => {
      setPulseFields((cur) => {
        const n = new Set(Array.from(cur))
        changed.forEach((k) => n.delete(k))
        return n
      })
    }, 800)

    pulseTimeoutsRef.current.push(timeout)
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || pending || !sessionId) return

    const now = Date.now()
    const userMsg: Message = {
      id: `u-${now}`,
      role: 'user',
      content: trimmed,
      createdAt: now,
    }

    // The assistant bubble is added immediately (empty + streaming=true)
    // so the typing dots appear right away while we wait for the first delta.
    const assistantId = `a-${now}`
    const emptyAssistant: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
      createdAt: now,
    }

    setMessages((prev) => [...prev, userMsg, emptyAssistant])
    setInput('')
    setPending(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: trimmed }),
      })

      if (!res.ok || !res.body) {
        // Non-streaming error (e.g. 400 validation)
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(data?.error ?? `El servidor respondió con ${res.status}.`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let firstDelta = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // SSE blocks are separated by double newlines.
        const blocks = buffer.split('\n\n')
        // The last element may be an incomplete block — keep it in the buffer.
        buffer = blocks.pop() ?? ''

        for (const block of blocks) {
          const trimmedBlock = block.trim()
          if (!trimmedBlock) continue

          const parsed = parseSseBlock(trimmedBlock)
          if (!parsed) continue

          const { event, data } = parsed

          if (event === 'text') {
            let delta = ''
            try {
              delta = (JSON.parse(data) as { delta: string }).delta
            } catch {
              continue
            }

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content: msg.content + delta,
                      // Drop the streaming flag on the first delta so typing
                      // dots hide as soon as text starts appearing.
                      streaming: firstDelta ? false : msg.streaming,
                    }
                  : msg,
              ),
            )
            firstDelta = false
          } else if (event === 'profile') {
            // Full profile replacement from SSE — apply + compute pulse.
            try {
              const nextProfile = JSON.parse(data) as LeadProfile
              applyProfileUpdate(nextProfile)
            } catch {
              // Malformed JSON — skip silently.
            }
          } else if (event === 'followups') {
            // Full followups array replacement from SSE.
            try {
              const next = JSON.parse(data) as Followup[]
              if (Array.isArray(next)) setFollowups(next)
            } catch {
              // Malformed JSON — skip silently.
            }
          } else if (event === 'tool') {
            // Tool events are intentionally invisible to the user — keep the
            // streaming dots while a tool runs so it feels like the assistant
            // is "thinking", but don't surface any tool/search wording in the
            // bubble. Reset to streaming if no text has arrived yet so the
            // typing indicator stays visible across the tool call.
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId && msg.content === ''
                  ? { ...msg, streaming: true }
                  : msg,
              ),
            )
          } else if (event === 'error') {
            let errMsg = 'Ocurrió un error al procesar tu mensaje.'
            try {
              errMsg =
                (JSON.parse(data) as { message: string }).message || errMsg
            } catch {
              // use default
            }
            // Remove the empty/streaming assistant bubble and show error state.
            setMessages((prev) => prev.filter((m) => m.id !== assistantId))
            setError(errMsg)
            setPending(false)
            return
          } else if (event === 'done') {
            // Finalize — make sure streaming flag is cleared.
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId ? { ...msg, streaming: false } : msg,
              ),
            )
          }
        }
      }
    } catch (err) {
      // Remove the empty assistant bubble on network-level errors.
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      setError(err instanceof Error ? err.message : 'Error inesperado.')
    } finally {
      setPending(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void sendMessage(input)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage(input)
    }
  }

  // Task 2.7: reset conversation clears profile state locally (best-effort).
  async function resetConversation() {
    // Best-effort server-side reset. If DELETE fails we still rotate the local
    // sessionId so the user gets a clean slate (next session will be fresh on server too).
    if (sessionId) {
      try {
        await fetch('/api/chat', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
      } catch (err) {
        console.warn('[resetConversation] DELETE /api/chat failed (best-effort):', err)
      }
    }

    // Clear profile state regardless of server outcome — matches the
    // best-effort pattern used for messages.
    setLeadProfile({})
    setPulseFields(new Set())
    prevProfileRef.current = {}
    setFollowups([])

    const fresh = generateSessionId()
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh)
    setSessionId(fresh)
    setMessages([])
    setError(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ── Header — full-width, sticky ── */}
      <header className="sticky top-0 z-20 border-b border-beige-200/60 bg-ink">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Flip"
              width={96}
              height={32}
              className="h-16 w-auto brightness-0 invert"
              priority
            />
            <span className="hidden text-xs uppercase tracking-[0.2em] text-white/60 sm:inline">
              Demo
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void resetConversation()}
              className="text-xs text-white/70 transition-colors hover:text-white"
            >
              Reiniciar
            </button>
            <Link
              href="/"
              className="text-xs text-white/70 transition-colors hover:text-white"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero section — full-width, above main ── */}
      <section className="border-b border-beige-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <p className="font-serif text-sm italic text-beige-600">— Demo en vivo</p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Conversá con <span className="font-serif italic">Flip</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
            Probá el copiloto en tiempo real. Hacele preguntas, pedile que simule un
            cliente o que califique un lead. La conversación se mantiene mientras no
            reinicies.
          </p>
        </div>
      </section>

      {/* ── Main two-column layout ── */}
      {/*
        <main> is a flex container — no overflow, no scroll.
        Chat column (left) owns its own scrollable region via scrollRef.
        Sidecar (right) is sticky on lg+ screens.
      */}
      <main className="flex flex-1 flex-col overflow-hidden md:grid md:grid-cols-2">
        {/* ── Chat column ── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/*
            Scrollable messages container — scrollRef lives HERE, not on <main>,
            so only the message list scrolls and the sidecar stays sticky.
          */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
            style={{
              backgroundColor: '#efeae2',
              backgroundImage: "url('/chat-pattern.svg')",
              backgroundRepeat: 'repeat',
            }}
            aria-live="polite"
          >
            <div className="mx-auto max-w-3xl px-3 py-4 sm:px-4">
              <ul className="space-y-1.5">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {error && (
                  <li className="flex justify-start">
                    <div className="max-w-[78%] rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm">
                      {error}
                    </div>
                  </li>
                )}
              </ul>

              {messages.length === 0 && !pending && (
                <div className="mt-6 flex flex-wrap justify-center gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void sendMessage(s)}
                      className="rounded-full bg-white px-3 py-1.5 text-xs text-[#00a884] shadow-sm transition-colors hover:bg-[#f0f2f5]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Input footer — inside chat column so it aligns with messages ── */}
          <footer className="border-t border-black/5 bg-[#f0f2f5]">
            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-3xl px-3 py-2 sm:px-4"
            >
              <div className="flex items-end gap-2">
                <div className="flex-1 rounded-3xl bg-white px-4 py-1.5 shadow-sm">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribí un mensaje"
                    rows={1}
                    disabled={pending}
                    className="block w-full resize-none bg-transparent py-1.5 text-[15px] leading-relaxed text-neutral-800 placeholder-neutral-400 focus:outline-none disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  aria-label="Enviar mensaje"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  <SendIcon />
                </button>
              </div>
              <p className="mt-1 px-2 text-[10px] text-neutral-500">
                Enter para enviar · Shift + Enter para salto de línea
              </p>
            </form>
          </footer>
        </div>

        {/* ── Sidecar — visible from md+, sticky ── */}
        <aside className="hidden md:block md:overflow-y-auto">
          <CrmPanel
            profile={leadProfile}
            pulseFields={pulseFields}
            followups={followups}
            turnCount={messages.filter((m) => m.role === 'user').length}
          />
        </aside>
      </main>

      {/* ── Mobile FAB + bottom sheet — rendered outside <main> so fixed positioning
           is not clipped by any overflow parent. Visible on mobile only (md:hidden
           applied here so parent layout doesn't need to know). ── */}
      <div className="md:hidden">
        <div className="md:hidden">
          <MobileProfileSheet
            profile={leadProfile}
            pulseFields={pulseFields}
            followups={followups}
          />
        </div>
      </div>
    </div>
  )
}

function formatBubbleTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const time = message.createdAt ? formatBubbleTime(message.createdAt) : null
  const isEmptyStreaming = !isUser && message.streaming && !message.content

  // Bubble shell: WhatsApp-style asymmetric corner + drop shadow.
  // Outgoing (user): green tint, squared top-right.
  // Incoming (assistant): white, squared top-left.
  const bubbleClass = isUser
    ? 'relative max-w-[78%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-2.5 pb-1 pt-1.5 shadow-sm'
    : 'relative max-w-[78%] rounded-lg rounded-tl-none bg-white px-2.5 pb-1 pt-1.5 shadow-sm'

  return (
    <li className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div className={bubbleClass}>
        {/* Tail (small triangle that fills the squared-off corner) */}
        {isUser ? (
          <span
            aria-hidden
            className="absolute -right-[7px] top-0 h-0 w-0 border-y-[7px] border-l-[8px] border-y-transparent border-l-[#d9fdd3]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute -left-[7px] top-0 h-0 w-0 border-y-[7px] border-r-[8px] border-y-transparent border-r-white"
          />
        )}

        {/* Message body */}
        {isEmptyStreaming ? (
          <div className="flex items-center gap-1 px-1 py-1.5">
            <Dot delay="0ms" />
            <Dot delay="150ms" />
            <Dot delay="300ms" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words pr-14 text-[14.2px] leading-snug text-neutral-800">
            {message.content}
          </p>
        )}

        {/* Timestamp + (for outgoing) double-check */}
        {time && !isEmptyStreaming && (
          <span className="absolute bottom-0.5 right-1.5 flex items-center gap-1 text-[10px] leading-none text-neutral-500">
            {time}
            {isUser && <DoubleCheckIcon />}
          </span>
        )}
      </div>
    </li>
  )
}

function DoubleCheckIcon() {
  return (
    <svg
      viewBox="0 0 16 11"
      className="h-3 w-4 fill-[#53bdeb]"
      aria-hidden
    >
      <path d="M11.071.653a.457.457 0 00-.304-.104.531.531 0 00-.405.176l-6.504 7.84L1.288 5.95a.455.455 0 00-.331-.143.452.452 0 00-.319.143L.114 6.554a.501.501 0 00.014.713l3.738 3.594.05.043.06.038c.21.108.476.04.602-.156l7.06-9.207a.5.5 0 00-.108-.704l-.469-.222z" />
      <path d="M15.933.653a.457.457 0 00-.304-.104.531.531 0 00-.405.176l-6.504 7.84-3.057-2.948a.455.455 0 00-.331-.143.452.452 0 00-.319.143l-.524.605a.501.501 0 00.014.713l3.738 3.594.05.043.06.038c.21.108.476.04.602-.156l7.06-9.207a.5.5 0 00-.108-.704l-.469-.222z" />
    </svg>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400"
      style={{ animationDelay: delay }}
    />
  )
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3.4 20.4 21 12 3.4 3.6v6.7l12 1.7-12 1.7z" />
    </svg>
  )
}
