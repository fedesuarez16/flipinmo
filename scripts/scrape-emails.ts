// Email enrichment for a leads CSV produced by `npm run prospect`.
// Usage:
//   npm run scrape-emails -- <input.csv> [--output <path.csv>]
// Example:
//   npm run scrape-emails -- scripts/output/leads.csv
//
// For each row with a website, fetches the homepage plus a few common
// contact paths and extracts emails via regex. Writes a new CSV with an
// extra `emails` column (semicolon-separated when multiple).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
const CONTACT_PATHS = ['/contacto', '/contact', '/contactanos', '/contacto-nosotros']
const TIMEOUT_MS = 10_000
const DELAY_MS = 800

// Filter out noise that matches the email regex but isn't a real address
// (sentry/wix telemetry, image filenames decoded as text, placeholder copy).
const FAKE_PATTERNS: RegExp[] = [
  /\.png$/i,
  /\.jpg$/i,
  /\.jpeg$/i,
  /\.gif$/i,
  /\.webp$/i,
  /\.svg$/i,
  /sentry\.io$/i,
  /wixpress\.com$/i,
  /example\.com$/i,
  /domain\.com$/i,
  /^.+@.+\.(png|jpg|jpeg|gif|webp|svg)$/i,
]

async function fetchWithTimeout(url: string): Promise<string | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; FlipProspector/1.0; +https://flip.example)',
        Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
      },
      redirect: 'follow',
    })
    if (!res.ok) return null
    const ct = res.headers.get('content-type') ?? ''
    if (!ct.includes('text/html') && !ct.includes('text/plain')) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function extractEmails(html: string): string[] {
  const found = new Set<string>()
  for (const m of html.matchAll(EMAIL_RE)) {
    const email = m[0].toLowerCase()
    if (FAKE_PATTERNS.some((re) => re.test(email))) continue
    found.add(email)
  }
  return [...found]
}

async function findEmailsForSite(websiteUri: string): Promise<string[]> {
  let base: URL
  try {
    base = new URL(websiteUri)
  } catch {
    return []
  }
  const tries = [base.toString(), ...CONTACT_PATHS.map((p) => new URL(p, base).toString())]
  const collected = new Set<string>()
  for (let i = 0; i < tries.length; i++) {
    const html = await fetchWithTimeout(tries[i])
    if (html) {
      for (const e of extractEmails(html)) collected.add(e)
    }
    // Stop early if a contact page already yielded something.
    if (collected.size > 0 && i > 0) break
    if (i < tries.length - 1) await sleep(DELAY_MS)
  }
  return [...collected]
}

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0
  while (i < text.length) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += c
      i++
      continue
    }
    if (c === '"') {
      inQuotes = true
      i++
      continue
    }
    if (c === ',') {
      row.push(field)
      field = ''
      i++
      continue
    }
    if (c === '\n' || c === '\r') {
      row.push(field)
      field = ''
      lines.push(row)
      row = []
      if (c === '\r' && text[i + 1] === '\n') i++
      i++
      continue
    }
    field += c
    i++
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    lines.push(row)
  }
  const filtered = lines.filter((r) => r.some((f) => f.length > 0))
  if (filtered.length === 0) return { headers: [], rows: [] }
  return { headers: filtered[0], rows: filtered.slice(1) }
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

function parseArgs(argv: string[]): { input: string; output: string } {
  const args = argv.slice(2)
  let input = ''
  let output = ''
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--output' || a === '-o') {
      const next = args[++i]
      if (!next) throw new Error('--output requires a value')
      output = next
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
  if (!output) output = input.replace(/(\.csv)?$/, '-with-emails.csv')
  return { input, output }
}

function printHelp(): void {
  console.log(`
Usage: npm run scrape-emails -- <input.csv> [--output <path.csv>]

Reads a CSV produced by 'npm run prospect', visits each website,
extracts email addresses, and writes a new CSV with an 'emails' column.

Notes:
  - Skips rows without a website.
  - Tries homepage, then /contacto, /contact, /contactanos, /contacto-nosotros.
  - Sequential with ${DELAY_MS}ms delay between requests; ${TIMEOUT_MS}ms timeout.
`)
}

async function main(): Promise<void> {
  const { input, output } = parseArgs(process.argv)
  const text = readFileSync(input, 'utf8')
  const { headers, rows } = parseCsv(text)
  if (headers.length === 0) {
    console.error('Empty CSV')
    process.exit(1)
  }
  const websiteIdx = headers.indexOf('website')
  if (websiteIdx === -1) {
    console.error('Input CSV is missing the "website" column')
    process.exit(1)
  }
  const newHeaders = [...headers, 'emails']
  const out: string[][] = []
  let withEmails = 0
  for (const [i, row] of rows.entries()) {
    const site = row[websiteIdx] ?? ''
    let emails = ''
    if (site) {
      process.stdout.write(`[${i + 1}/${rows.length}] ${site} ... `)
      const found = await findEmailsForSite(site)
      emails = found.join('; ')
      if (found.length > 0) withEmails++
      console.log(found.length > 0 ? `found ${found.length}` : 'none')
    } else {
      console.log(`[${i + 1}/${rows.length}] (no website)`)
    }
    out.push([...row, emails])
  }
  mkdirSync(dirname(output), { recursive: true })
  const csv = [newHeaders, ...out]
    .map((r) => r.map(escapeCsv).join(','))
    .join('\n')
  writeFileSync(output, csv, 'utf8')
  console.log(
    `Wrote ${output} — ${withEmails}/${rows.length} rows with emails (${
      rows.length === 0 ? 0 : Math.round((withEmails / rows.length) * 100)
    }%)`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
