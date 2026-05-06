'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Role = 'assistant' | 'user'

type Message = {
  id: string
  role: Role
  content: string
  /** True while the first delta has not arrived yet — used to show typing dots */
  streaming?: boolean
}

const SESSION_STORAGE_KEY = 'flip-chat-session-id'

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hola, soy Josías de Inmobiliarias Flip. ¿En qué te puedo ayudar? Contame qué estás buscando.',
}

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

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string>('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (existing) {
      setSessionId(existing)
    } else {
      const fresh = generateSessionId()
      window.localStorage.setItem(SESSION_STORAGE_KEY, fresh)
      setSessionId(fresh)
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

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || pending || !sessionId) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    // The assistant bubble is added immediately (empty + streaming=true)
    // so the typing dots appear right away while we wait for the first delta.
    const assistantId = `a-${Date.now()}`
    const emptyAssistant: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
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

  // Phase 2: call DELETE /api/chat to wipe server-side history, then rotate local id.
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

    const fresh = generateSessionId()
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh)
    setSessionId(fresh)
    setMessages([INITIAL_MESSAGE])
    setError(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="sticky top-0 z-20 border-b border-beige-200/60 bg-ink">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
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

      <section className="border-b border-beige-200/60 bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
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

      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        aria-live="polite"
      >
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <ul className="space-y-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {error && (
              <li className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              </li>
            )}
          </ul>

          {messages.length === 1 && !pending && (
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-wider text-neutral-500">
                Probá con
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void sendMessage(s)}
                    className="rounded-full border border-beige-300 bg-white px-3 py-1.5 text-xs text-neutral-700 transition-colors hover:border-ink hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-beige-200/60 bg-cream/95 backdrop-blur">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl px-4 py-4 sm:px-6"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-beige-300 bg-white p-2 shadow-sm focus-within:border-ink">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu mensaje…"
              rows={1}
              disabled={pending}
              className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-ink placeholder-neutral-400 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enviar
            </button>
          </div>
          <p className="mt-2 px-2 text-[11px] text-neutral-500">
            Enter para enviar · Shift + Enter para salto de línea
          </p>
        </form>
      </footer>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  if (!isUser && message.streaming && !message.content) {
    // Empty assistant bubble — show typing dots while waiting for first delta.
    return (
      <li className="flex justify-start">
        <div className="flex max-w-[80%] items-center gap-2 rounded-2xl rounded-tl-sm border border-beige-200 bg-white px-4 py-3 text-sm text-neutral-500">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </div>
      </li>
    )
  }

  return (
    <li className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={
          isUser
            ? 'max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-ink px-4 py-3 text-sm text-white'
            : 'max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-tl-sm border border-beige-200 bg-white px-4 py-3 text-sm text-neutral-800'
        }
      >
        {message.content}
      </div>
    </li>
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
