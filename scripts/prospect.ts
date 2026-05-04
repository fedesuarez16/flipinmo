// Lead prospecting via Google Places API (New).
// Usage:
//   npm run prospect -- "<query>" [--output scripts/output/leads.csv]
// Example:
//   npm run prospect -- "inmobiliarias en Palermo, Buenos Aires"
//   npm run prospect -- "concesionarias autos Belgrano CABA" -o scripts/output/concesionarias.csv
//
// Requires GOOGLE_PLACES_API_KEY in .env (loaded via --env-file).
// Google caps text search at 60 results per query (3 pages × 20). For larger
// universes use prospect-batch.ts with multiple queries.

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { searchAllPages, type Place } from './lib/places'
import { escapeCsv } from './lib/csv'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

function toCsv(places: Place[]): string {
  const headers = [
    'place_id',
    'name',
    'address',
    'phone_national',
    'phone_international',
    'website',
    'rating',
    'review_count',
    'maps_url',
    'status',
  ]
  const rows = places.map((p) => [
    p.id,
    p.displayName?.text ?? '',
    p.formattedAddress ?? '',
    p.nationalPhoneNumber ?? '',
    p.internationalPhoneNumber ?? '',
    p.websiteUri ?? '',
    p.rating ?? '',
    p.userRatingCount ?? '',
    p.googleMapsUri ?? '',
    p.businessStatus ?? '',
  ])
  return [headers, ...rows]
    .map((r) => r.map(escapeCsv).join(','))
    .join('\n')
}

function parseArgs(argv: string[]): { query: string; output: string } {
  const args = argv.slice(2)
  let output = 'scripts/output/leads.csv'
  const positional: string[] = []
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--output' || a === '-o') {
      const next = args[++i]
      if (!next) throw new Error('--output requires a value')
      output = next
    } else if (a === '--help' || a === '-h') {
      printHelp()
      process.exit(0)
    } else {
      positional.push(a)
    }
  }
  if (positional.length === 0) {
    printHelp()
    process.exit(1)
  }
  return { query: positional.join(' '), output }
}

function printHelp(): void {
  console.log(`
Usage: npm run prospect -- "<query>" [--output <path.csv>]

Examples:
  npm run prospect -- "inmobiliarias en Palermo, Buenos Aires"
  npm run prospect -- "clinicas esteticas Recoleta" -o scripts/output/clinicas.csv

Notes:
  - Google Places caps results at 60 per query (3 pages of 20).
  - For larger universes, use prospect-batch.ts.
  - Requires GOOGLE_PLACES_API_KEY in .env
`)
}

async function main(): Promise<void> {
  if (!API_KEY) {
    console.error(
      'Missing GOOGLE_PLACES_API_KEY. Add it to .env at the repo root.'
    )
    process.exit(1)
  }
  const { query, output } = parseArgs(process.argv)
  console.log(`Searching: "${query}"`)
  const places = await searchAllPages(API_KEY, query)
  console.log(`Found ${places.length} unique places`)
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, toCsv(places), 'utf8')
  console.log(`Wrote ${output}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
