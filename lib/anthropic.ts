import 'server-only'

import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) {
  throw new Error(
    'ANTHROPIC_API_KEY no está definida. Agregala a .env antes de iniciar el servidor.',
  )
}

export const MODEL =
  (process.env.ANTHROPIC_MODEL?.trim() || 'claude-haiku-4-5')

export const anthropic = new Anthropic({ apiKey })
