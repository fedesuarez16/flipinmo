import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — env vars are read on FIRST CALL, not at module import.
// Throwing at import time breaks `next build` page-data collection on Vercel
// when env vars are not yet wired in the deployment.
let cached: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (cached) return cached

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error(
      '[lib/supabase] NEXT_PUBLIC_SUPABASE_URL is not set. Add it to your environment.',
    )
  }
  if (!serviceRoleKey) {
    throw new Error(
      '[lib/supabase] SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your environment. ' +
        'WARNING: This key bypasses RLS — never expose it to the client.',
    )
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
