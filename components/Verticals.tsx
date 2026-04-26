const verticals = [
  {
    title: 'Inmobiliarias y desarrolladoras',
    description: 'Califica leads, agenda visitas y matchea propiedades del inventario o de portales.',
  },
  {
    title: 'Concesionarias y autos usados',
    description: 'Responde consultas de stock, coordina test drives y mantiene la cartera caliente.',
  },
  {
    title: 'Clínicas estéticas y odontológicas',
    description: 'Agenda turnos, recuerda controles y recupera pacientes que dejaron de venir.',
  },
  {
    title: 'Academias y cursos online',
    description: 'Convierte interesados en inscriptos y sostiene el onboarding hasta la primera clase.',
  },
  {
    title: 'Tiendas online de indumentaria',
    description: 'Recomienda talles, recupera carritos abandonados y resuelve postventa al instante.',
  },
  {
    title: 'Ferreterías y materiales de construcción',
    description: 'Cotiza por WhatsApp, gestiona pedidos por mayor y coordina entregas sin demora.',
  },
  {
    title: 'Agencias de viajes',
    description: 'Arma propuestas, sigue cotizaciones abiertas y reactiva clientes entre temporadas.',
  },
]

export default function Verticals() {
  return (
    <section id="verticales" className="border-b border-beige-100 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-base italic text-beige-500">
            — Verticales
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Pensado para{' '}
            <span className="font-serif italic font-normal text-beige-500">
              negocios
            </span>{' '}
            que viven de sus leads.
          </h2>
          <p className="mt-4 text-base text-neutral-600 sm:text-lg">
            Flip se adapta al lenguaje, las consultas frecuentes y el ciclo de
            cada industria.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-beige-200 bg-beige-200 lg:grid-cols-3">
          {verticals.map((v) => (
            <div key={v.title} className="bg-white p-4 transition-colors hover:bg-beige-50 sm:p-8">
              <h3 className="text-sm font-semibold text-ink sm:text-base">{v.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                {v.description}
              </p>
            </div>
          ))}
          <div className="flex items-center justify-center bg-beige-50 p-4 sm:p-8">
            <p className="text-xs text-neutral-700 sm:text-sm">
              <span className="font-serif italic">¿Otro rubro?</span>{' '}
              <a href="#contacto" className="font-medium text-ink underline underline-offset-4 decoration-beige-400">
                Hablemos
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
