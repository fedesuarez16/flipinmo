// CSV parser for inventory items using papaparse.
// No 'server-only' needed here — this is pure data transformation with no SDK deps.
// Called only from server-side API routes, but safe to import anywhere.

import Papa from 'papaparse'
import type { InventoryItem } from '@/lib/inventory/store'

// ─── Required columns ─────────────────────────────────────────────────────────
// Sample CSV row (pipe-delimited features):
//   apartment,"Depto 2 amb Palermo","Palermo, CABA",180000,USD,2,1,52,"Luminoso con balcón",pool|garage,available

const REQUIRED_COLUMNS = ['type', 'title', 'location'] as const
const NUMERIC_COLUMNS = ['price', 'bedrooms', 'bathrooms', 'area_m2'] as const
const EXPECTED_HEADER = [
  'type',
  'title',
  'location',
  'price',
  'currency',
  'bedrooms',
  'bathrooms',
  'area_m2',
  'description',
  'features',
  'status',
]

type RowError = {
  row: number
  error: string
}

type ParseResult = {
  rows: Partial<InventoryItem>[]
  errors: RowError[]
}

// ─── parseInventoryCsv ────────────────────────────────────────────────────────

export function parseInventoryCsv(csv: string): ParseResult {
  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false, // We do our own coercion for better error messages.
  })

  const errors: RowError[] = []
  const rows: Partial<InventoryItem>[] = []

  // Validate header presence.
  const actualFields = result.meta.fields ?? []
  const missingRequired = REQUIRED_COLUMNS.filter(
    (col) => !actualFields.includes(col),
  )
  if (missingRequired.length > 0) {
    return {
      rows: [],
      errors: [
        {
          row: 0,
          error: `Encabezado CSV inválido. Columnas requeridas faltantes: ${missingRequired.join(', ')}. Se esperaba: ${EXPECTED_HEADER.join(',')}`,
        },
      ],
    }
  }

  // Process each row (papaparse row index is 0-based; we report 1-based to users).
  for (let i = 0; i < result.data.length; i++) {
    const raw = result.data[i]
    const rowNum = i + 1
    const rowErrors: string[] = []

    // Trim every cell value.
    const trimmed: Record<string, string> = {}
    for (const key of Object.keys(raw)) {
      trimmed[key] = (raw[key] ?? '').trim()
    }

    // Validate required fields.
    for (const col of REQUIRED_COLUMNS) {
      if (!trimmed[col]) {
        rowErrors.push(`"${col}" es requerido y está vacío`)
      }
    }

    if (rowErrors.length > 0) {
      errors.push({ row: rowNum, error: rowErrors.join('; ') })
      continue
    }

    // Coerce numeric fields.
    const numericValues: Partial<Record<(typeof NUMERIC_COLUMNS)[number], number | undefined>> = {}
    let numericError = false

    for (const col of NUMERIC_COLUMNS) {
      const raw = trimmed[col]
      if (!raw) {
        numericValues[col] = undefined
      } else {
        const parsed = Number(raw)
        if (isNaN(parsed)) {
          errors.push({ row: rowNum, error: `"${col}" no es un número válido: "${raw}"` })
          numericError = true
          break
        }
        numericValues[col] = parsed
      }
    }

    if (numericError) continue

    // Split features by pipe.
    const featuresRaw = trimmed['features'] ?? ''
    const features = featuresRaw
      .split('|')
      .map((f) => f.trim())
      .filter(Boolean)

    // Build the partial item — empty strings become undefined so DB defaults apply.
    const item: Partial<InventoryItem> = {
      type: trimmed['type'],
      title: trimmed['title'],
      location: trimmed['location'],
      price: numericValues.price ?? null,
      currency: trimmed['currency'] || undefined,
      bedrooms: numericValues.bedrooms ?? null,
      bathrooms: numericValues.bathrooms ?? null,
      area_m2: numericValues.area_m2 ?? null,
      description: trimmed['description'] || undefined,
      features: features.length > 0 ? features : undefined,
      status: trimmed['status'] || undefined,
    }

    rows.push(item)
  }

  return { rows, errors }
}
