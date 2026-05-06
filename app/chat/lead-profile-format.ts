import type {
  LeadProfile,
  Intent,
  PropertyType,
  Urgency,
  Temperature,
} from '@/lib/chat/profile-types'

// ─── Spanish formatters for LeadProfile fields ────────────────────────────────
// Pure functions, no React, no side effects.

const numberFormat = new Intl.NumberFormat('es-AR')

/**
 * Format a budget object into a human-readable Spanish string.
 *
 * Examples:
 *   { min: 100000, max: 200000, currency: 'USD' } → "USD 100.000 – 200.000"
 *   { max: 200000, currency: 'USD' }              → "Hasta USD 200.000"
 *   { min: 100000, currency: 'ARS' }              → "Desde ARS 100.000"
 *   { min: 100000, max: 200000 }                  → "100.000 – 200.000"
 */
export function formatBudget(
  b: LeadProfile['budget'],
): string | undefined {
  if (!b) return undefined

  const { min, max, currency } = b
  if (min === undefined && max === undefined) return undefined

  const prefix = currency ? `${currency} ` : ''

  if (min !== undefined && max !== undefined) {
    return `${prefix}${numberFormat.format(min)} – ${numberFormat.format(max)}`
  }
  if (max !== undefined) {
    return `Hasta ${prefix}${numberFormat.format(max)}`
  }
  // min only
  return `Desde ${prefix}${numberFormat.format(min!)}`
}

/**
 * Join an array of location strings with ", ".
 * Returns undefined if the array is empty or undefined.
 */
export function formatLocations(
  arr: LeadProfile['locations'],
): string | undefined {
  if (!arr || arr.length === 0) return undefined
  return arr.join(', ')
}

/**
 * Format a minimum bedrooms number.
 * Example: 2 → "2+ dormitorios"
 */
export function formatBedrooms(
  n: LeadProfile['bedrooms_min'],
): string | undefined {
  if (n === undefined || n === null) return undefined
  return `${n}+ dormitorios`
}

const INTENT_LABELS: Record<Intent, string> = {
  buy: 'Comprar',
  rent: 'Alquilar',
  invest: 'Invertir',
}

/**
 * Translate an intent enum value to Spanish.
 */
export function formatIntent(
  intent: LeadProfile['intent'],
): string | undefined {
  if (!intent) return undefined
  return INTENT_LABELS[intent]
}

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Departamento',
  house: 'Casa',
  ph: 'PH',
  loft: 'Loft',
  office: 'Oficina',
}

/**
 * Format an array of property types into a comma-separated Spanish string.
 * Example: ['apartment', 'house'] → "Departamento, Casa"
 */
export function formatPropertyTypes(
  arr: LeadProfile['property_types'],
): string | undefined {
  if (!arr || arr.length === 0) return undefined
  return arr.map((t) => PROPERTY_TYPE_LABELS[t]).join(', ')
}

const URGENCY_LABELS: Record<Urgency, string> = {
  now: 'Ya',
  '3_months': 'Próximos 3 meses',
  exploring: 'Explorando',
}

/**
 * Translate an urgency enum value to Spanish.
 */
export function formatUrgency(
  urgency: LeadProfile['urgency'],
): string | undefined {
  if (!urgency) return undefined
  return URGENCY_LABELS[urgency]
}

const TEMPERATURE_LABELS: Record<Temperature, string> = {
  frio: 'frío',
  tibio: 'tibio',
  caliente: 'caliente',
}

/**
 * Translate a temperature enum value to a lowercase Spanish label.
 */
export function formatTemperature(
  temp: LeadProfile['temperature'],
): string | undefined {
  if (!temp) return undefined
  return TEMPERATURE_LABELS[temp]
}

/**
 * Compact one-line summary combining property types + budget.
 * Example: ['apartment'] + {max: 200000, currency: 'USD'} → "Departamento · Hasta USD 200.000"
 */
export function formatPropertyAndBudget(
  profile: LeadProfile,
): string | undefined {
  const parts: string[] = []
  const types = formatPropertyTypes(profile.property_types)
  const budget = formatBudget(profile.budget)
  if (types) parts.push(types.toLowerCase())
  if (budget) parts.push(budget)
  if (parts.length === 0) return undefined
  return parts.join(' · ')
}
