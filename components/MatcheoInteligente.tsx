const inventory = [
  {
    title: 'Loft Palermo Soho',
    spec: '1 amb · 42 m² · USD 145k',
    anim: 'animate-match-scan-1',
  },
  {
    title: '2 amb Villa Crespo',
    spec: '2 amb · 55 m² · USD 165k',
    anim: 'animate-match-scan-2',
  },
  {
    title: '2 amb Palermo Hollywood',
    spec: '2 amb · 58 m² · pet friendly · USD 178k',
    anim: 'animate-match-scan-3',
    match: true,
  },
  {
    title: '3 amb Belgrano R',
    spec: '3 amb · 80 m² · USD 220k',
    anim: 'animate-match-scan-4',
  },
]

const bullets = [
  'Recomienda desde tu inventario o catálogo en vivo',
  'Envía por WhatsApp, email o SMS — el canal del cliente',
  'Sigue buscando con cada actualización del stock hasta cerrar el match',
]

export default function MatcheoInteligente() {
  return (
    <section
      id="matcheo-inteligente"
      className="border-b border-beige-100 bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Animated card — left on desktop, below on mobile */}
          <div className="relative order-2 lg:order-1">
            <div className="pointer-events-none absolute -bottom-8 -left-6 h-24 w-24 rounded-full border border-beige-200 opacity-60" />
            <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full border border-beige-200 opacity-60" />

            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5">
              {/* Query header */}
              <div className="border-b border-neutral-200 bg-neutral-50 px-5 py-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                  Búsqueda activa
                </p>
                <p className="mt-1 text-sm text-neutral-800">
                  <span className="font-medium text-neutral-900">Sofía R.</span>{' '}
                  · 2 amb · Palermo · pet friendly · ~USD 180k
                </p>
                <div className="mt-3 flex h-4 items-center gap-2">
                  <span className="relative inline-flex h-2 w-2 flex-shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <div className="relative h-4 flex-1">
                    <span className="animate-match-status-1 absolute left-0 top-0 text-[11px] font-medium text-neutral-700">
                      Buscando en catálogo…
                    </span>
                    <span className="animate-match-status-2 absolute left-0 top-0 text-[11px] font-medium text-emerald-700">
                      Match encontrado · 1 de 4
                    </span>
                  </div>
                </div>
              </div>

              {/* Inventory list */}
              <ul className="divide-y divide-neutral-100">
                {inventory.map((item) => (
                  <li
                    key={item.title}
                    className={`relative flex items-center justify-between gap-3 px-5 py-3 ${item.anim}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
                        <svg
                          className="h-4 w-4 text-neutral-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 4h16v16H4z M4 16l5-5 4 4 3-3 4 4"
                          />
                          <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {item.title}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          {item.spec}
                        </p>
                      </div>
                    </div>
                    {item.match && (
                      <span className="animate-match-badge inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Match
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {/* Channel send */}
              <div className="border-t border-neutral-200 bg-neutral-50 px-5 py-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                  Enviar por canal preferido
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="animate-match-channel-1 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                    WhatsApp
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-500">
                    Email
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-500">
                    SMS
                  </span>
                </div>
                <div className="animate-match-send mt-3 flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-700">
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-emerald-500"
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
                  <span className="truncate">
                    Enviado a Sofía · 2 amb Palermo Hollywood
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copy — right on desktop, top on mobile */}
          <div className="order-1 lg:order-2">
            <p className="font-serif text-base italic text-beige-500">
              — Matcheo Inteligente
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
              El{' '}
              <span className="font-serif italic font-normal text-beige-500">
                match
              </span>{' '}
              exacto, en el canal del cliente.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg">
              Flip lee tu inventario o catálogo en vivo y encuentra lo que mejor
              encaja con cada cliente: la propiedad, el auto, el tratamiento, el
              curso o el SKU justo. Y lo envía por el canal donde el cliente
              está realmente activo.
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
        </div>
      </div>
    </section>
  )
}
