import 'server-only'

import type Anthropic from '@anthropic-ai/sdk'
import { listItems, getItemById } from '@/lib/inventory/store'
import { mergeLeadProfile, type LeadProfile, type LeadProfilePatch } from '@/lib/chat/profile'
import { addFollowup } from '@/lib/chat/followups'
import type { Followup } from '@/lib/chat/profile-types'

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
  {
    name: 'schedule_followup',
    description:
      'Agendá un seguimiento concreto con el cliente cuando él lo confirma (no cuando vos lo proponés). ' +
      'Usalo cuando acuerdan volver a hablar o avanzar — una llamada, un WhatsApp, un mail o una visita. ' +
      'Después de llamarlo, agradecele brevemente y dale por confirmado el seguimiento. ' +
      'No lo uses para sugerencias o intenciones vagas. El cliente NO ve esta acción.',
    input_schema: {
      type: 'object',
      properties: {
        when: {
          type: 'string',
          description:
            'Cuándo, en lenguaje natural en español: "mañana 10am", "el viernes 18hs", "el 13/05 a las 15", "en 2 días". Lo más concreto posible.',
        },
        channel: {
          type: 'string',
          enum: ['call', 'whatsapp', 'email', 'visit'],
          description:
            'Canal del seguimiento: call (llamada), whatsapp, email, visit (visita presencial).',
        },
        note: {
          type: 'string',
          description:
            'Una oración breve sobre qué se va a hablar o hacer en el seguimiento.',
        },
      },
      required: ['when', 'channel', 'note'],
    },
  },
  {
    name: 'update_lead_profile',
    description:
      'Registrá información confirmada del cliente: nombre, contacto, intención, ' +
      'tipo de propiedad, zonas, presupuesto, dormitorios mínimos, must-haves, ' +
      'urgencia o notas. Mandá SOLO los campos que aprendiste o cambiaron en este turno; ' +
      'no repitas lo que ya quedó registrado. Para limpiar un campo, mandalo como null. ' +
      'Los arrays reemplazan el valor anterior, no se suman.',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: ['string', 'null'] },
        contact: {
          type: ['object', 'null'],
          properties: {
            email: { type: ['string', 'null'] },
            phone: { type: ['string', 'null'] },
          },
        },
        intent: { type: ['string', 'null'], enum: ['buy', 'rent', 'invest', null] },
        property_types: {
          type: ['array', 'null'],
          items: { type: 'string', enum: ['apartment', 'house', 'ph', 'loft', 'office'] },
        },
        locations: { type: ['array', 'null'], items: { type: 'string' } },
        budget: {
          type: ['object', 'null'],
          properties: {
            min: { type: ['number', 'null'] },
            max: { type: ['number', 'null'] },
            currency: { type: ['string', 'null'], enum: ['USD', 'ARS', null] },
          },
        },
        bedrooms_min: { type: ['number', 'null'] },
        must_haves: { type: ['array', 'null'], items: { type: 'string' } },
        urgency: { type: ['string', 'null'], enum: ['now', '3_months', 'exploring', null] },
        temperature: {
          type: ['string', 'null'],
          enum: ['frio', 'tibio', 'caliente', null],
          description:
            'Temperatura del lead: "frio" (curiosea), "tibio" (interés real, falta info), "caliente" (listo para avanzar). Asignala según urgencia, claridad de criterios y predisposición.',
        },
        notes: { type: ['string', 'null'] },
      },
      required: [],
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

// ─── Tool outcome type ────────────────────────────────────────────────────────

export type ToolOutcome = {
  result: unknown
  profileUpdate?: LeadProfile
  followupsUpdate?: Followup[]
}

// ─── Tool dispatcher ──────────────────────────────────────────────────────────

/**
 * Executes a named tool with the given input and returns a ToolOutcome.
 *
 * - For search_inventory / get_item_details: returns `{ result }` only.
 * - For update_lead_profile: merges patch into stored profile and returns
 *   `{ result, profileUpdate }` when the profile changed, or `{ result }` on
 *   no-op (empty patch or unchanged merged state).
 *
 * Decision D-12: tools.ts stays SSE-free — `profileUpdate` is returned to the
 * caller (agent-loop) which decides when to write the SSE event.
 */
export async function runTool(
  name: string,
  input: Record<string, unknown>,
  ctx: { sessionId: string },
): Promise<ToolOutcome> {
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
    return {
      result: items.map((item) => ({
        id: item.id,
        type: item.type,
        title: item.title,
        location: item.location,
        price: item.price,
        currency: item.currency,
        bedrooms: item.bedrooms,
        area_m2: item.area_m2,
        status: item.status,
      })),
    }
  }

  if (name === 'get_item_details') {
    const args = input as GetItemDetailsInput
    const item = await getItemById(args.id)
    if (!item) {
      return { result: { error: 'Ítem no encontrado.' } }
    }
    return { result: item }
  }

  if (name === 'schedule_followup') {
    const args = input as { when?: string; channel?: string; note?: string }
    if (!args.when || !args.channel || !args.note) {
      return { result: { error: 'Faltan campos requeridos (when, channel, note).' } }
    }
    try {
      const followups = await addFollowup(ctx.sessionId, {
        when: args.when,
        channel: args.channel,
        note: args.note,
      })
      return { result: 'Seguimiento agendado', followupsUpdate: followups }
    } catch (err) {
      return {
        result: { error: err instanceof Error ? err.message : String(err) },
      }
    }
  }

  if (name === 'update_lead_profile') {
    // Empty patch ⇒ no-op, no DB read, no SSE event.
    if (Object.keys(input).length === 0) {
      return { result: 'Sin cambios' }
    }

    const { profile, changed } = await mergeLeadProfile(
      ctx.sessionId,
      input as LeadProfilePatch,
    )

    if (!changed) {
      return { result: 'Sin cambios' }
    }

    return { result: 'Perfil actualizado', profileUpdate: profile }
  }

  return { result: { error: `Tool desconocido: "${name}"` } }
}
