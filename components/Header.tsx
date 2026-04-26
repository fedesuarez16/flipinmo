'use client'

import { useState } from 'react'
import Image from 'next/image'

const navLinks = [
  { href: '#producto', label: 'Producto' },
  { href: '#empresa', label: 'Empresa' },
  { href: '#contacto', label: 'Contacto' },
]

const DEMO_URL = 'https://calendar.app.google/4rC6HTH9hAZHG8XP7'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Flip"
            width={120}
            height={40}
            className="h-24 w-auto brightness-0 invert"
            priority
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-beige-100 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            Habla con nosotros
          </a>
        </div>

        <button
          aria-label="Abrir menú"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink/90 backdrop-blur md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block rounded-full bg-beige-100 px-4 py-2 text-center text-sm font-medium text-ink"
            >
              Habla con nosotros
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
