import 'server-only'

import { getSupabase } from '@/lib/supabase'

const TABLE = 'app_settings'

export async function getSetting<T>(key: string): Promise<T | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error) {
    console.error(`[settings/store] getSetting(${key}) failed:`, error)
    throw new Error(error.message)
  }
  if (!data) return null
  return data.value as T
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const { error } = await getSupabase()
    .from(TABLE)
    .upsert(
      { key, value: value as unknown, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )

  if (error) {
    console.error(`[settings/store] setSetting(${key}) failed:`, error)
    throw new Error(error.message)
  }
}

export async function deleteSetting(key: string): Promise<void> {
  const { error } = await getSupabase().from(TABLE).delete().eq('key', key)

  if (error) {
    console.error(`[settings/store] deleteSetting(${key}) failed:`, error)
    throw new Error(error.message)
  }
}
