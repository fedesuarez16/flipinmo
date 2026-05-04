const stats = [
  {
    value: '78%',
    text: 'de los compradores elige la primera empresa que le responde, independientemente del precio o la marca.',
    source: 'Website Builder / Vendasta',
  },
  {
    value: '80%',
    text: 'de las ventas requieren entre 5 y 8 contactos antes de cerrar.',
    source: 'Qwilr / Sales research',
  },
  {
    value: '+70%',
    text: 'más conversiones cuando los equipos hacen intentos adicionales de contacto.',
    source: 'Martal / Velocify',
  },
]

const decay = [
  {
    time: 'Menos de 1 min',
    label: '+391%',
    width: '100%',
    bar: 'bg-ink',
    highlight: true,
  },
  {
    time: 'Menos de 5 min',
    label: 'Base',
    width: '64%',
    bar: 'bg-neutral-400',
  },
  {
    time: '10 minutos',
    label: '−80%',
    width: '28%',
    bar: 'bg-amber-400',
  },
  {
    time: '30 minutos',
    label: '−95%',
    width: '12%',
    bar: 'bg-orange-500',
  },
  {
    time: '1 hora o más',
    label: '−99%',
    width: '4%',
    bar: 'bg-rose-500',
  },
]

export default function WhyItMatters() {
  return (
    <section
      id="por-que-importa"
      className="border-b border-beige-100 bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-base italic text-beige-500">
            — Por qué importa
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Quien responde{' '}
            <span className="font-serif italic font-normal text-beige-500">
              primero
            </span>
            , gana.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
            Las ventas no se las lleva el mejor precio ni la mejor marca: se
            las lleva el que llega antes y el que insiste. Los datos de la
            industria son brutalmente claros.
          </p>
        </div>

        {/* Two-column layout: stats + chart */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Stats column */}
          <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-beige-200 bg-beige-200">
            {stats.map((s) => (
              <div
                key={s.source}
                className="flex items-start gap-5 bg-white p-5 sm:p-6"
              >
                <p className="shrink-0 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {s.value}
                </p>
                <div className="flex flex-col">
                  <p className="text-sm leading-snug text-neutral-700 sm:text-base">
                    {s.text}
                  </p>
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                    Fuente · {s.source}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Decay chart column */}
          <div className="flex flex-col">
            <div>
              <p className="font-serif text-base italic text-beige-500">
                — Curva de caída de conversión
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl md:text-4xl">
                Cada minuto cuesta una{' '}
                <span className="font-serif italic font-normal text-beige-500">
                  venta
                </span>
                .
              </h3>
            </div>

            <div className="mt-10 space-y-5">
              {decay.map((d) => (
                <div key={d.time}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span
                      className={`text-sm sm:text-base ${
                        d.highlight
                          ? 'font-semibold text-ink'
                          : 'font-medium text-neutral-700'
                      }`}
                    >
                      {d.time}
                    </span>
                    <div className="flex items-baseline gap-3">
                      {d.highlight && (
                        <span className="hidden text-[11px] font-medium uppercase tracking-wider text-beige-600 sm:inline">
                          ← Donde Flip responde
                        </span>
                      )}
                      <span
                        className={`tabular-nums ${
                          d.highlight
                            ? 'text-base font-semibold text-ink sm:text-lg'
                            : 'text-base font-semibold text-neutral-600'
                        }`}
                      >
                        {d.label}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full ${d.bar}`}
                      style={{ width: d.width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-xl border border-beige-200 bg-cream px-6 py-5 text-sm leading-relaxed text-neutral-700 sm:text-base">
              Responder en el primer minuto puede multiplicar conversiones por
              casi 4× respecto a responder en 5 minutos. Cada minuto que pasa
              reduce la probabilidad de cierre un 1,5%.{' '}
              <span className="text-neutral-500">— Velocify / Kixie</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
