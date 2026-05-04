// Batch lead prospecting — runs many queries from a text file and merges
// the results into a single deduped CSV.
// Usage:
//   npm run prospect-batch -- <queries.txt> [--output scripts/output/leads.csv] [--delay 500]
// Example:
//   npm run prospect-batch -- scripts/queries.example.txt
//
// queries.txt format:
//   - One query per line.
//   - Blank lines and lines starting with '#' are ignored.
//
// Output CSV merges all queries, dedups by place_id, and adds a
// `source_queries` column listing every query that matched a given place.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { searchAllPages, type Place } from './lib/places'
import { escapeCsv } from './lib/csv'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

type Aggregated = { place: Place; sources: Set<string> }

function readQueries(path: string): string[] {
  const text = readFileSync(path, 'utf8')
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'))
}

function toCsv(rows: Aggregated[]): string {
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
    'source_queries',
  ]
  const dataRows = rows.map(({ place: p, sources }) => [
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
    [...sources].join('; '),
  ])
  return [headers, ...dataRows]
    .map((r) => r.map(escapeCsv).join(','))
    .join('\n')
}

function parseArgs(argv: string[]): {
  input: string
  output: string
  delay: number
} {
  const args = argv.slice(2)
  let input = ''
  let output = 'scripts/output/leads-batch.csv'
  let delay = 500
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--output' || a === '-o') {
      const next = args[++i]
      if (!next) throw new Error('--output requires a value')
      output = next
    } else if (a === '--delay' || a === '-d') {
      const next = args[++i]
      if (!next) throw new Error('--delay requires a value')
      const n = Number(next)
      if (!Number.isFinite(n) || n < 0) {
        throw new Error('--delay must be a non-negative number')
      }
      delay = n
    } else if (a === '--help' || a === '-h') {
      printHelp()
      process.exit(0)
    } else if (!input) {
      input = a
    }
  }
  if (!input) {
    printHelp()
    process.exit(1)
  }
  return { input, output, delay }
}

function printHelp(): void {
  console.log(`
Usage: npm run prospect-batch -- <queries.txt> [--output <path.csv>] [--delay <ms>]

Reads a text file with one query per line, runs each through Places API
(New), and merges the results into a single CSV deduped by place_id.

Options:
  --output, -o   Output CSV path (default: scripts/output/leads-batch.csv)
  --delay, -d    Delay in ms between queries (default: 500)

queries.txt format:
  - One query per line.
  - Blank lines ignored.
  - Lines starting with '#' are comments.

Notes:
  - Each query returns up to 60 results (3 pages of 20).
  - Places appearing in multiple queries are merged into one row;
    source_queries lists every query that matched.
  - A single failed query logs the error and the batch keeps going.
`)
}

async function main(): Promise<void> {
  if (!API_KEY) {
    console.error(
      'Missing GOOGLE_PLACES_API_KEY. Add it to .env at the repo root.'
    )
    process.exit(1)
  }
  const { input, output, delay } = parseArgs(process.argv)
  const queries = readQueries(input)
  if (queries.length === 0) {
    console.error(`No queries found in ${input}`)
    process.exit(1)
  }
  console.log(`Running ${queries.length} queries from ${input}`)

  const merged = new Map<string, Aggregated>()
  let failed = 0
  for (const [i, q] of queries.entries()) {
    process.stdout.write(`[${i + 1}/${queries.length}] "${q}" ... `)
    try {
      const places = await searchAllPages(API_KEY, q)
      let added = 0
      let dup = 0
      for (const p of places) {
        const existing = merged.get(p.id)
        if (existing) {
          existing.sources.add(q)
          dup++
        } else {
          merged.set(p.id, { place: p, sources: new Set([q]) })
          added++
        }
      }
      console.log(`${places.length} found (+${added} new, ${dup} dup)`)
    } catch (err) {
      failed++
      console.log(`FAILED — ${(err as Error).message}`)
    }
    if (i < queries.length - 1 && delay > 0) await sleep(delay)
  }

  const rows = [...merged.values()]
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, toCsv(rows), 'utf8')
  const ok = queries.length - failed
  console.log(
    `Wrote ${output} — ${rows.length} unique leads from ${ok}/${queries.length} successful queries`
  )
  if (failed > 0) {
    console.log(`${failed} queries failed (see above)`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
