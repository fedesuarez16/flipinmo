import Image from 'next/image'
import Header from './Header'

const WAITLIST_URL = 'https://tally.so/r/oblMg1'

const stats = [
  { value: '90%', label: 'Tasa de respuesta automática' },
  { value: '24/7', label: 'Atención de leads continua' },
  { value: '2 sem.', label: 'Tiempo de implementación' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-beige-200 bg-ink">
      <Image
        src="/fondo.avif"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,205,184,0.18),transparent_60%)]" />

      <div className="relative z-10">
        <Header />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-16 text-center sm:px-6 sm:pb-32 sm:pt-24 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-serif italic">El primer copiloto comercial</span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Agentes de IA para{' '}
          <span className="font-serif italic font-normal text-beige-200">
            negocios
          </span>
          <br className="hidden sm:block" />
          {' '}que viven de sus leads
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-white/75 sm:text-lg">
          Automatiza la captación, el seguimiento y el cierre. Vendas
          departamentos, casas , autos, cursos o productos —
          Flip convierte cada lead en una oportunidad real.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-beige-100 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white"
          >
            Sumate a la waitlist
          </a>
          <a
            href="#producto"
            className="inline-flex items-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            Ver el producto
          </a>
        </div>

        <dl className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-8 border-t border-white/15 pt-12 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-serif text-sm italic text-beige-200">
                {stat.label}
              </dt>
              <dd className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
