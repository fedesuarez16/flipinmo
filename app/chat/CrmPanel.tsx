'use client'

import {
  HiOutlineEllipsisHorizontal,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2'
import type { IconType } from 'react-icons'
import type {
  Followup,
  FollowupChannel,
  LeadProfile,
} from '@/lib/chat/profile-types'
import LeadProfileCard from './LeadProfileCard'

interface Props {
  profile: LeadProfile
  pulseFields: Set<string>
  followups: Followup[]
  turnCount: number
}

// ─── Channel → icon + label ───────────────────────────────────────────────────

const CHANNEL_META: Record<FollowupChannel, { icon: IconType; label: string }> =
  {
    call: { icon: HiOutlinePhone, label: 'Llamada' },
    whatsapp: { icon: HiOutlineChatBubbleLeftRight, label: 'WhatsApp' },
    email: { icon: HiOutlineEnvelope, label: 'Email' },
    visit: { icon: HiOutlineMapPin, label: 'Visita' },
  }

// ─── Subcomponents ────────────────────────────────────────────────────────────

function FollowupRow({ followup }: { followup: Followup }) {
  const meta = CHANNEL_META[followup.channel]
  const Icon = meta.icon
  return (
    <li className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-beige-50 text-ink">
        <Icon className="h-4.5 w-4.5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-ink">{followup.when}</p>
          <span className="text-[11px] uppercase tracking-wide text-neutral-500">
            {meta.label}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
          {followup.note}
        </p>
      </div>
    </li>
  )
}

function EmptyFollowups() {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 bg-white/60 p-6 text-center">
      <p className="text-sm text-neutral-600">
        No hay seguimientos programados.
      </p>
      <p className="mt-1 text-xs text-neutral-400">
        Cuando acuerdes uno con el cliente va a aparecer acá.
      </p>
    </div>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export default function CrmPanel({
  profile,
  pulseFields,
  followups,
  turnCount,
}: Props) {
  return (
    <div className="flex h-full flex-col border-l border-neutral-200 bg-cream">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-3">
        <div>
          <p className="font-serif text-xs italic text-beige-600">— CRM</p>
          <h2 className="text-sm font-medium text-ink">Lead activo</h2>
        </div>
        <button
          type="button"
          aria-label="Más acciones"
          className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-ink"
        >
          <HiOutlineEllipsisHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* ── Card ── */}
      <div className="px-4 pb-2 pt-4">
        <LeadProfileCard
          profile={profile}
          pulseFields={pulseFields}
          turnCount={turnCount}
        />
      </div>

      {/* ── Action menu (tabs) ── */}
      <div className="border-b border-neutral-200 px-4">
        <nav className="flex gap-5">
          <span className="-mb-px border-b-2 border-ink py-2.5 text-sm font-medium text-ink">
            Seguimientos
            {followups.length > 0 && (
              <span className="ml-1.5 rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {followups.length}
              </span>
            )}
          </span>
          <span
            aria-disabled
            title="Próximamente"
            className="py-2.5 text-sm text-neutral-400"
          >
            Notas
          </span>
          <span
            aria-disabled
            title="Próximamente"
            className="py-2.5 text-sm text-neutral-400"
          >
            Historial
          </span>
        </nav>
      </div>

      {/* ── Followups list ── */}
      <div className="flex-1 overflow-y-auto p-4">
        {followups.length === 0 ? (
          <EmptyFollowups />
        ) : (
          <ul className="space-y-2">
            {followups.map((f) => (
              <FollowupRow key={f.id} followup={f} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
