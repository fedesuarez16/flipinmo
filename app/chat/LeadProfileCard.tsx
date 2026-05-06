'use client'

import {
  HiOutlineChevronDoubleLeft,
  HiOutlineAdjustmentsHorizontal,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineClock,
} from 'react-icons/hi2'
import type { IconType } from 'react-icons'
import type { LeadProfile, Temperature } from '@/lib/chat/profile-types'
import {
  formatIntent,
  formatLocations,
  formatPropertyAndBudget,
  formatTemperature,
  formatUrgency,
} from './lead-profile-format'

interface Props {
  profile: LeadProfile
  pulseFields: Set<string>
  /** Number of user turns in the conversation — shown as a small badge top-right. */
  turnCount?: number
}

// ─── Temperature pill ─────────────────────────────────────────────────────────

const TEMP_STYLES: Record<Temperature, string> = {
  frio: 'bg-sky-50 text-sky-800 border-sky-200',
  tibio: 'bg-amber-50 text-amber-800 border-amber-200',
  caliente: 'bg-orange-50 text-orange-800 border-orange-200',
}

function TemperaturePill({ value }: { value: Temperature }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${TEMP_STYLES[value]}`}
    >
      {formatTemperature(value)}
    </span>
  )
}

// ─── Icon row ─────────────────────────────────────────────────────────────────

interface RowProps {
  icon: IconType
  fieldKey: string
  pulseFields: Set<string>
  children: React.ReactNode
}

function Row({ icon: Icon, fieldKey, pulseFields, children }: RowProps) {
  const isPulsing = pulseFields.has(fieldKey)
  return (
    <li
      className={`flex items-center gap-3 rounded-md px-1 py-0.5 text-sm transition-colors duration-150 ${
        isPulsing ? 'bg-beige-50' : 'bg-transparent'
      }`}
    >
      <Icon className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
      <span className="text-neutral-700">{children}</span>
    </li>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export default function LeadProfileCard({
  profile,
  pulseFields,
  turnCount,
}: Props) {
  const hasName = Boolean(profile.name)
  const isPulsingName = pulseFields.has('name')
  const isPulsingTemp = pulseFields.has('temperature')

  const propertyAndBudget = formatPropertyAndBudget(profile)
  const intent = formatIntent(profile.intent)
  const locations = formatLocations(profile.locations)
  const urgency = formatUrgency(profile.urgency)
  const phone = profile.contact?.phone
  const email = profile.contact?.email

  const hasAnyData =
    hasName ||
    profile.temperature ||
    intent ||
    propertyAndBudget ||
    locations ||
    urgency ||
    phone ||
    email

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      {/* Header: name + turn badge */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`text-lg font-bold leading-tight transition-colors duration-150 ${
            isPulsingName ? 'rounded-md bg-beige-50 px-1' : ''
          } ${hasName ? 'text-ink' : 'text-neutral-400 italic'}`}
        >
          {profile.name ?? 'Cliente nuevo'}
        </h3>

        {turnCount !== undefined && turnCount > 0 && (
          <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
            {turnCount}
          </span>
        )}
      </div>

      {/* Temperature pill */}
      {profile.temperature && (
        <div
          className={`mt-2 transition-colors duration-150 ${
            isPulsingTemp ? 'rounded-md bg-beige-50 p-0.5' : ''
          }`}
        >
          <TemperaturePill value={profile.temperature} />
        </div>
      )}

      {/* Divider — only if we have any data below */}
      {hasAnyData && (
        <div className="my-4 border-t border-neutral-200/80" />
      )}

      {/* Field rows */}
      {hasAnyData ? (
        <ul className="space-y-2.5">
          {intent && (
            <Row
              icon={HiOutlineChevronDoubleLeft}
              fieldKey="intent"
              pulseFields={pulseFields}
            >
              {intent}
            </Row>
          )}

          {propertyAndBudget && (
            <Row
              icon={HiOutlineAdjustmentsHorizontal}
              fieldKey={
                pulseFields.has('property_types') ? 'property_types' : 'budget'
              }
              pulseFields={pulseFields}
            >
              {propertyAndBudget}
            </Row>
          )}

          {locations && (
            <Row
              icon={HiOutlineMapPin}
              fieldKey="locations"
              pulseFields={pulseFields}
            >
              {locations}
            </Row>
          )}

          {urgency && (
            <Row
              icon={HiOutlineClock}
              fieldKey="urgency"
              pulseFields={pulseFields}
            >
              {urgency}
            </Row>
          )}

          {phone && (
            <Row icon={HiOutlinePhone} fieldKey="contact" pulseFields={pulseFields}>
              {phone}
            </Row>
          )}

          {email && !phone && (
            <Row
              icon={HiOutlineEnvelope}
              fieldKey="contact"
              pulseFields={pulseFields}
            >
              {email}
            </Row>
          )}
        </ul>
      ) : (
        <p className="mt-3 text-sm italic text-neutral-400">
          Esperando datos del cliente…
        </p>
      )}

      {/* Notes — separate block at the bottom */}
      {profile.notes && (
        <>
          <div className="my-4 border-t border-neutral-200/80" />
          <div
            className={`rounded-md px-1 py-0.5 text-xs leading-relaxed text-neutral-600 transition-colors duration-150 ${
              pulseFields.has('notes') ? 'bg-beige-50' : ''
            }`}
          >
            {profile.notes}
          </div>
        </>
      )}
    </div>
  )
}
