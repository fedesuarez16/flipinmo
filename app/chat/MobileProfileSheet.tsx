'use client'

import { useState } from 'react'
import type { Followup, LeadProfile } from '@/lib/chat/profile-types'
import LeadProfileCard from './LeadProfileCard'

interface Props {
  profile: LeadProfile
  pulseFields: Set<string>
  followups?: Followup[]
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

/**
 * Mobile profile sheet — FAB + bottom sheet.
 *
 * Visibility is controlled by the parent via CSS classes on the wrapper element
 * (`md:hidden`). This component renders both the FAB and the sheet in one unit
 * with shared internal open/close state.
 *
 * FAB: fixed bottom-right, ink background, white icon.
 * No count badge per decision D-10.
 *
 * Sheet: full-width bottom sheet with backdrop. Opens with a slide-up transform.
 * Closed by tap on backdrop or the X button inside the sheet.
 */
export default function MobileProfileSheet({ profile, pulseFields, followups = [] }: Props) {
  const [open, setOpen] = useState(false)
  const hasData = Object.keys(profile).length > 0

  return (
    <>
      {/* FAB — fixed bottom-right */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ver perfil del lead"
        className="fixed bottom-6 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <UserIcon />
        {/* Dot indicator when profile has data — no count, per D-10 */}
        {hasData && (
          <span
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-beige-500"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Perfil del lead"
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-cream shadow-xl transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Sheet header */}
        <div className="flex items-center justify-between border-b border-beige-200 px-4 py-3">
          <p className="font-serif text-sm italic text-beige-600">— Perfil del lead</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar perfil"
            className="text-neutral-500 transition-colors hover:text-ink"
          >
            <XIcon />
          </button>
        </div>

        {/* Card content — always mounted so live updates work while open */}
        <div className="space-y-4 p-4">
          <LeadProfileCard profile={profile} pulseFields={pulseFields} />

          {followups.length > 0 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-neutral-500">
                Seguimientos ({followups.length})
              </p>
              <ul className="space-y-2">
                {followups.map((f) => (
                  <li
                    key={f.id}
                    className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-ink">{f.when}</p>
                      <span className="text-[11px] uppercase tracking-wide text-neutral-500">
                        {f.channel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-600">{f.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
