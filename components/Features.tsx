const features = [
  {
    title: 'Funnel Inteligente',
    description:
      'Sistema de seguimiento cíclico que transforma leads fríos en leads calientes. Monitorea cada interacción y ajusta la estrategia en tiempo real.',
    bullets: [
      'Seguimiento automático extremo a extremo',
      'Segmentación por comportamiento',
      'Nunca se pierde un lead',
    ],
  },
  {
    title: 'Matcheo Inteligente',
    description:
      'Encuentra el producto o servicio ideal para cada cliente: la propiedad, el auto, el tratamiento, el curso o el SKU justo. Lo envía por el canal preferido.',
    bullets: [
      'Recomendaciones desde tu inventario o catálogo',
      'Envío por WhatsApp, email o SMS',
      'Búsqueda continua hasta encontrar el match',
    ],
  },
  {
    title: 'Automatización Completa',
    description:
      'Desde el primer contacto hasta la venta cerrada. Tu equipo se enfoca en cerrar; Flip se encarga del resto del proceso.',
    bullets: [
      'Conversaciones con el tono de tu marca',
      'Agenda de turnos, visitas y llamadas',
      'Reportes y analytics en tiempo real',
    ],
  },
]

export default function Features() {
  return (
    <section id="producto" className="border-b border-beige-100 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-base italic text-beige-500">
            — Producto
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Una plataforma.{' '}
            <span className="font-serif italic font-normal text-beige-500">
              Todo
            </span>{' '}
            el ciclo de venta.
          </h2>
          <p className="mt-4 text-base text-neutral-600 sm:text-lg">
            Tres herramientas que trabajan juntas para que tu negocio opere a
            otra escala.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-beige-200 bg-beige-200 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-8 sm:p-10">
              <h3 className="text-lg font-semibold text-ink">
                <span className="font-serif italic font-normal">{feature.title.split(' ')[0]}</span>{' '}
                {feature.title.split(' ').slice(1).join(' ')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {feature.description}
              </p>
              <ul className="mt-6 space-y-3">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-neutral-700">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-beige-500"
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
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
