const DEMO_URL = 'https://calendar.app.google/4rC6HTH9hAZHG8XP7'

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,205,184,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-serif text-base italic text-beige-300">
          — Empezá hoy
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          ¿Listo para ver{' '}
          <span className="font-serif italic font-normal text-beige-200">
            Flip
          </span>
          <br />
          en acción?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/65 sm:text-lg">
          Agenda una demo de 20 minutos. Te mostramos cómo se vería Flip
          conectado a tu inventario y a tus canales actuales.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-beige-100 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            Habla con nosotros
          </a>
        </div>
      </div>
    </section>
  )
}
