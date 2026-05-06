import 'server-only'

import type Anthropic from '@anthropic-ai/sdk'
import { listItems, getItemById } from '@/lib/inventory/store'

// ─── Tool definitions ─────────────────────────────────────────────────────────

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: 'search_inventory',
    description:
      'Busca ítems en el inventario según los criterios del usuario. ' +
      'Usá este tool cuando el usuario pregunte por productos, disponibilidad o características específicas. ' +
      'Devuelve un resumen liviano de cada ítem (sin descripción completa ni features) para no saturar el contexto.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description:
            'Texto libre para buscar en título, descripción y ubicación (ilike).',
        },
        type: {
          type: 'string',
          description: 'Tipo de ítem, p. ej. "apartment", "house", "local", "vehicle".',
        },
        location: {
          type: 'string',
          description: 'Filtro por ubicación (ilike parcial).',
        },
        min_price: {
          type: 'number',
          description: 'Precio mínimo (inclusive).',
        },
        max_price: {
          type: 'number',
          description: 'Precio máximo (inclusive).',
        },
        bedrooms: {
          type: 'number',
          description: 'Cantidad exacta de dormitorios.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_item_details',
    description:
      'Devuelve los detalles completos de un ítem por su UUID. ' +
      'Usá este tool cuando el usuario quiera saber más sobre un ítem específico ya encontrado con search_inventory.',
    input_schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'UUID del ítem (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).',
        },
      },
      required: ['id'],
    },
  },
]

// ─── Tool input types ─────────────────────────────────────────────────────────

type SearchInventoryInput = {
  query?: string
  type?: string
  location?: string
  min_price?: number
  max_price?: number
  bedrooms?: number
}

type GetItemDetailsInput = {
  id: string
}

// ─── Tool dispatcher ──────────────────────────────────────────────────────────

/**
 * Executes a named tool with the given input and returns a JSON-stringifiable result.
 * For search_inventory: strips description, features, meta to keep token count low.
 * For get_item_details: returns the full record.
 */
export async function runTool(
  name: string,
  input: Record<string, unknown>,
): Promise<unknown> {
  if (name === 'search_inventory') {
    const args = input as SearchInventoryInput
    const items = await listItems({
      query: args.query,
      type: args.type,
      location: args.location,
      minPrice: args.min_price,
      maxPrice: args.max_price,
      bedrooms: args.bedrooms,
      limit: 8,
    })

    // Return only summary fields — drop description, features, meta to save tokens.
    return items.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      location: item.location,
      price: item.price,
      currency: item.currency,
      bedrooms: item.bedrooms,
      area_m2: item.area_m2,
      status: item.status,
    }))
  }

  if (name === 'get_item_details') {
    const args = input as GetItemDetailsInput
    const item = await getItemById(args.id)
    if (!item) {
      return { error: 'Ítem no encontrado.' }
    }
    return item
  }

  return { error: `Tool desconocido: "${name}"` }
}
