// Google Places API (New) text search client.
// Used by scripts/prospect.ts and scripts/prospect-batch.ts.

import { setTimeout as sleep } from 'node:timers/promises'

const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText'

// Field mask controls cost. These fields fall under the Pro SKU.
// Adding reviews or priceLevel would push to the Enterprise SKU.
export const PLACES_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.googleMapsUri',
  'places.businessStatus',
  'nextPageToken',
].join(',')

export type Place = {
  id: string
  displayName?: { text: string; languageCode?: string }
  formattedAddress?: string
  nationalPhoneNumber?: string
  internationalPhoneNumber?: string
  websiteUri?: string
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  businessStatus?: string
}

type SearchResponse = {
  places?: Place[]
  nextPageToken?: string
}

async function searchText(
  apiKey: string,
  query: string,
  pageToken?: string
): Promise<SearchResponse> {
  const body: Record<string, unknown> = {
    textQuery: query,
    languageCode: 'es',
    regionCode: 'AR',
  }
  if (pageToken) body.pageToken = pageToken

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': PLACES_FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Places API ${res.status}: ${text}`)
  }
  return (await res.json()) as SearchResponse
}

// Returns up to 60 places (3 pages × 20), deduped by id.
export async function searchAllPages(
  apiKey: string,
  query: string
): Promise<Place[]> {
  const all: Place[] = []
  let pageToken: string | undefined
  for (let page = 1; page <= 3; page++) {
    const res = await searchText(apiKey, query, pageToken)
    if (res.places) all.push(...res.places)
    if (!res.nextPageToken) break
    pageToken = res.nextPageToken
    // Google requires a short delay before a fresh pageToken becomes valid.
    await sleep(2000)
  }
  const seen = new Set<string>()
  return all.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
}
