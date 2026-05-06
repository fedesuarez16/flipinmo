import 'server-only'

import Anthropic from '@anthropic-ai/sdk'

export const MODEL =
  process.env.ANTHROPIC_MODEL?.trim() || 'claude-haiku-4-5'

// Lazy singleton — see lib/supabase.ts for the same rationale.
let cached: Anthropic | null = null

export function getAnthropic(): Anthropic {
  if (cached) return cached

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY no está definida. Agregala al entorno antes de iniciar el servidor.',
    )
  }

  cached = new Anthropic({ apiKey })
  return cached
}
