const WAITLIST_URL = 'https://tally.so/r/oblMg1'

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,205,184,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-serif text-base italic text-beige-300">
          — Acceso anticipado
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          ¿Querés ser de los{' '}
          <span className="font-serif italic font-normal text-beige-200">
            primeros
          </span>
          <br />
          en usar Flip?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base text-white/65 sm:text-lg">
          Sumate a la waitlist y te avisamos apenas abramos cupos para tu
          vertical. Sin spam, sin compromiso.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-beige-100 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            Sumate a la waitlist
          </a>
        </div>
      </div>
    </section>
  )
}
