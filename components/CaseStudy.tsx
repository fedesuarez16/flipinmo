export default function CaseStudy() {
  return (
    <section id="empresa" className="border-b border-beige-100 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-beige-200 bg-beige-50 p-10 sm:p-16">
          <p className="font-serif text-base italic text-beige-500">
            — Caso real
          </p>
          <blockquote className="mt-6 font-serif text-3xl leading-snug text-ink sm:text-4xl">
            “Antes perdíamos consultas porque no llegábamos a contestar a tiempo.
            Hoy cada cliente recibe respuesta en segundos y nuestro equipo solo
            entra cuando está listo para comprar o agendar.”
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
              MR
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Martín R.</p>
              <p className="font-serif text-sm italic text-neutral-500">Director comercial · cliente Flip</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 border-t border-beige-200 pt-8 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-semibold text-ink">+62%</p>
              <p className="mt-1 font-serif text-sm italic text-neutral-600">Conversión a venta o turno</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-ink">~15 s</p>
              <p className="mt-1 font-serif text-sm italic text-neutral-600">Primera respuesta</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-ink">3×</p>
              <p className="mt-1 font-serif text-sm italic text-neutral-600">Leads atendidos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
