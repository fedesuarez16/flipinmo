const steps = [
  {
    n: '1',
    label: 'Día 1 · Bienvenida',
    text: '¡Hola Carlos! Vi que dejaste tus datos en la web. ¿Te muestro las opciones que mejor encajan con lo que buscás?',
    anim: 'animate-funnel-step-1',
  },
  {
    n: '2',
    label: 'Día 3 · Seguimiento',
    text: 'Te dejé las 3 mejores opciones según tu presupuesto y zona. ¿Qué te parecen?',
    anim: 'animate-funnel-step-2',
  },
  {
    n: '3',
    label: 'Día 7 · Recordatorio',
    text: '¿Pudiste verlas? Si te queda alguna duda, agendamos una llamada de 15 min cuando te quede cómodo.',
    anim: 'animate-funnel-step-3',
  },
  {
    n: '4',
    label: 'Día 14 · Conversión',
    text: 'Carlos confirmó visita para el jueves a las 17 h. Lead pasa a "Caliente" y se notifica al equipo.',
    anim: 'animate-funnel-step-4',
  },
]

const bullets = [
  'Cadencias automáticas en WhatsApp, email y SMS',
  'Detecta caídas de interés y reactiva el contacto',
  'Tu equipo solo recibe los leads listos para cerrar',
]

export default function FunnelInteligente() {
  return (
    <section
      id="funnel-inteligente"
      className="border-b border-beige-100 bg-cream py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Copy */}
          <div>
            <p className="font-serif text-base italic text-beige-500">
              — Funnel Inteligente
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
              Ningún lead se enfría.{' '}
              <span className="font-serif italic font-normal text-beige-500">
                Nunca
              </span>
              .
            </h2>
            <p className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg">
              Sistema de seguimiento cíclico que transforma leads fríos en
              leads calientes. Flip ejecuta la cadencia de contacto, monitorea
              cada interacción y ajusta la estrategia en tiempo real — hasta
              que el lead responde, agenda o cierra.
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

          {/* Animated card */}
          <div className="relative">
            <div className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full border border-beige-200 opacity-60" />
            <div className="pointer-events-none absolute -bottom-10 -right-6 h-32 w-32 rounded-full border border-beige-200 opacity-60" />

            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                    CR
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Carlos R.
                    </p>
                    <p className="text-xs text-neutral-500">
                      Lead nuevo · WhatsApp
                    </p>
                  </div>
                </div>
                <div className="relative h-6 w-24">
                  <span className="animate-funnel-badge-1 absolute inset-0 flex items-center justify-center rounded-full bg-neutral-100 text-[10px] font-medium uppercase tracking-wider text-neutral-600">
                    Frío
                  </span>
                  <span className="animate-funnel-badge-2 absolute inset-0 flex items-center justify-center rounded-full bg-amber-50 text-[10px] font-medium uppercase tracking-wider text-amber-700">
                    Tibio
                  </span>
                  <span className="animate-funnel-badge-3 absolute inset-0 flex items-center justify-center rounded-full bg-orange-50 text-[10px] font-medium uppercase tracking-wider text-orange-700">
                    Interesado
                  </span>
                  <span className="animate-funnel-badge-4 absolute inset-0 flex items-center justify-center rounded-full bg-rose-50 text-[10px] font-medium uppercase tracking-wider text-rose-700">
                    Caliente
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <ul className="relative space-y-5 px-6 py-6">
                {/* Connector line */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-[37px] top-10 bottom-10 w-px bg-neutral-200"
                />

                {steps.map((s) => (
                  <li
                    key={s.n}
                    className={`relative flex gap-4 opacity-0 ${s.anim}`}
                  >
                    <div className="relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-beige-300 bg-beige-50 text-[11px] font-semibold text-beige-600">
                      {s.n}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                        {s.label}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-neutral-800">
                        {s.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Temperature bar */}
              <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-4">
                <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                  <span>Temperatura del lead</span>
                  <span className="text-neutral-700">Auto</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                  <div className="animate-funnel-temp h-full rounded-full bg-gradient-to-r from-neutral-400 via-amber-400 to-rose-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
