const stages = [
  {
    label: 'Contacto',
    anim: 'animate-pipe-dot-1',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M21 12c0 4.418-4.03 8-9 8a9.9 9.9 0 01-4.26-.95L3 20l1.4-3.72A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
  },
  {
    label: 'Califica',
    anim: 'animate-pipe-dot-2',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3 6h18M6 12h12M10 18h4"
      />
    ),
  },
  {
    label: 'Agenda',
    anim: 'animate-pipe-dot-3',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M8 7V3m8 4V3M4 11h16M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
  {
    label: 'Cierra',
    anim: 'animate-pipe-dot-4',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.2}
        d="M5 13l4 4L19 7"
      />
    ),
  },
]

const activity = [
  {
    text: 'Carlos respondió en WhatsApp · IA contestó en 12 s',
    anim: 'animate-pipe-act-1',
  },
  {
    text: 'Lead calificado · 2 amb Palermo, presupuesto OK',
    anim: 'animate-pipe-act-2',
  },
  {
    text: 'Visita agendada · jueves 17 h · recordatorio programado',
    anim: 'animate-pipe-act-3',
  },
  {
    text: 'Lead derivado al equipo comercial · ficha lista',
    anim: 'animate-pipe-act-4',
  },
]

const kpis = [
  {
    label: 'Conversaciones hoy',
    old: '138',
    new: '142',
    oldAnim: 'animate-pipe-kpi-1-old',
    newAnim: 'animate-pipe-kpi-1-new',
  },
  {
    label: 'Turnos agendados',
    old: '21',
    new: '22',
    oldAnim: 'animate-pipe-kpi-2-old',
    newAnim: 'animate-pipe-kpi-2-new',
  },
  {
    label: 'Conversión vs. mes',
    old: '+34%',
    new: '+38%',
    oldAnim: 'animate-pipe-kpi-3-old',
    newAnim: 'animate-pipe-kpi-3-new',
  },
]

const bullets = [
  'Conversaciones con el tono de tu marca, 24/7',
  'Agenda turnos, visitas y llamadas sin intervención manual',
  'Reportes y analytics en vivo, sin armar planillas',
]

export default function AutomatizacionCompleta() {
  return (
    <section
      id="automatizacion-completa"
      className="border-b border-beige-100 bg-cream py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Copy — left on desktop */}
          <div>
            <p className="font-serif text-base italic text-beige-500">
              — Automatización Completa
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
              Tu equipo cierra. Flip hace{' '}
              <span className="font-serif italic font-normal text-beige-500">
                todo
              </span>{' '}
              el resto.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg">
              Del primer mensaje al cierre: Flip contesta, califica, agenda,
              recuerda y reporta. Tu equipo solo entra cuando hay un lead
              listo para ser cerrado — el resto del proceso pasa solo.
            </p>
            <ul className="mt-8 space-y-3">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-base text-neutral-700"
                >
                  <svg
                    className="mt-1 h-4 w-4 flex-shrink-0 text-beige-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Animated card — right on desktop */}
          <div className="relative">
            <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full border border-beige-200 opacity-60" />
            <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full border border-beige-200 opacity-60" />

            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-5 py-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                    Pipeline en vivo
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-neutral-900">
                    Lead · Lucía Méndez
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-700">
                  <span className="relative inline-flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  En vivo
                </span>
              </div>

              {/* Pipeline stages */}
              <div className="px-6 pb-2 pt-7">
                <div className="relative">
                  {/* Background + progress line */}
                  <div className="absolute left-5 right-5 top-5 h-0.5">
                    <div className="h-full w-full bg-neutral-200" />
                    <div
                      className="animate-pipe-line absolute left-0 top-0 h-full bg-ink"
                      style={{ width: 0 }}
                    />
                  </div>

                  {/* Dots row */}
                  <ul className="relative flex justify-between">
                    {stages.map((s) => (
                      <li
                        key={s.label}
                        className="flex flex-col items-center"
                      >
                        <div
                          className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${s.anim}`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {s.icon}
                          </svg>
                        </div>
                        <p className="mt-2 text-[11px] font-medium text-neutral-700">
                          {s.label}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Activity feed */}
              <div className="border-t border-neutral-200 px-5 py-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                  Última acción de Flip
                </p>
                <div className="relative mt-2 h-5">
                  {activity.map((a) => (
                    <p
                      key={a.text}
                      className={`absolute inset-x-0 top-0 truncate text-sm text-neutral-800 ${a.anim}`}
                    >
                      <span className="mr-1.5 text-emerald-500">✓</span>
                      {a.text}
                    </p>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-4">
                <div className="grid grid-cols-3 gap-4">
                  {kpis.map((k) => (
                    <div key={k.label}>
                      <div className="relative h-7">
                        <p
                          className={`absolute inset-x-0 top-0 text-xl font-semibold text-neutral-900 ${k.oldAnim}`}
                        >
                          {k.old}
                        </p>
                        <p
                          className={`absolute inset-x-0 top-0 text-xl font-semibold text-neutral-900 ${k.newAnim}`}
                        >
                          {k.new}
                        </p>
                      </div>
                      <p className="mt-1 text-[10px] leading-tight text-neutral-500">
                        {k.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
