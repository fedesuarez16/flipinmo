# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Spanish-language marketing landing page for **Flip**, an AI sales/support copilot. Positioning is **vertical-agnostic** — Flip targets multiple industries: real estate, car dealerships, aesthetic/dental clinics, online academies, online clothing stores, hardware/construction, travel agencies. Avoid copy that ties the product to a single vertical (real-estate-only language was the previous positioning and has been removed). User-facing copy is in Spanish.

## Commands

- `npm run dev` — start the Next.js dev server on http://localhost:3000
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — run `next lint`

There is no test runner configured.

## Architecture

- **Next.js 14 App Router** (`app/` directory), React 18, TypeScript (strict), Tailwind CSS.
- `app/layout.tsx` is the root layout (loads the Inter font via `next/font/google` and exposes it as `--font-inter`); `app/page.tsx` composes the home route from `Header`, `Hero`, `Verticals`, `Features`, `CommandCenter`, `CaseStudy`, `CTA`, `Footer`.
- `CommandCenter.tsx` is the showpiece — a hand-built CRM dashboard mock (top bar + sidebar + leads list + AI suggestion panel + metrics) that markets Flip as "el primer copiloto de ventas y atención". If the user provides a real screenshot, swap the mock card for an `<Image>` rather than maintaining both.
- Only `Header.tsx` is a client component (`'use client'` for the mobile menu toggle); the rest are server components.
- Path alias: `@/*` resolves to the repo root, so imports look like `@/components/Header`.
- Brand palette is **black + white + beige**. Tailwind tokens: `ink` (`#0a0a0a`) for near-black, `cream` (`#f7f4ee`) for the lightest section background, and a `beige` scale (`50`–`600`) for accents, borders, and CTA buttons. Avoid saturated brand colors — `neutral-*` shades cover the gray spectrum.
- Two fonts are loaded via `next/font/google` and exposed as CSS variables:
  - `font-sans` → Inter (`--font-inter`) for body and headlines
  - `font-serif` → Instrument Serif (`--font-instrument`) used **italic** for accents only — eyebrow labels (e.g. "— Producto"), one decorative word per headline, testimonial quotes, footer column titles, stat captions. The "— " prefix on eyebrow labels is intentional.
- The hero (`Hero.tsx`) uses `/public/fondo.avif` as a full-bleed background image with a `from-black/55 via-black/40 to-black/65` gradient overlay; everything in the hero (including `<Header />`, which is rendered inside the hero) uses light-on-dark colors. The logo is inverted with `brightness-0 invert`.
- Static assets live in `public/` (e.g. `/logo.png`, served from the site root). The footer and dark CTA section invert the logo with `brightness-0 invert`.
- Waitlist CTA URL (`https://tally.so/r/oblMg1`, Tally form) and contact info (`coflipweb@gmail.com`, `+54 9 11 3337-0937`) are duplicated across `Header`, `Hero`, `CTA`, and `Footer` — update all of them together if these change. The primary CTA across the site is "Sumate a la waitlist"; the previous demo-booking flow (Google Calendar) was retired.
