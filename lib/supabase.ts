import 'server-only'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error(
    '[lib/supabase] NEXT_PUBLIC_SUPABASE_URL is not set. Add it to your .env file.',
  )
}

if (!serviceRoleKey) {
  throw new Error(
    '[lib/supabase] SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your .env file. ' +
      'WARNING: This key bypasses RLS — never expose it to the client.',
  )
}

// Server-side singleton. No session persistence needed — service role key
// is used for all DB operations from route handlers.
export const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
