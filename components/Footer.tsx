import Image from 'next/image'

const columns = [
  {
    title: 'Producto',
    links: [
      { label: 'Funnel Inteligente', href: '#producto' },
      { label: 'Matcheo Inteligente', href: '#producto' },
      { label: 'Centro de comando', href: '#crm' },
    ],
  },
  {
    title: 'Verticales',
    links: [
      { label: 'Inmobiliarias', href: '#verticales' },
      { label: 'Concesionarias', href: '#verticales' },
      { label: 'Clínicas', href: '#verticales' },
      { label: 'Academias', href: '#verticales' },
      { label: 'E-commerce', href: '#verticales' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre Flip', href: '#empresa' },
      { label: 'Casos de éxito', href: '#empresa' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },
]

export default function Footer() {
  return (
    <footer id="contacto" className="bg-ink text-white/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Image
              src="/logo.png"
              alt="Flip"
              width={120}
              height={40}
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="mt-4 max-w-sm font-serif text-base italic text-beige-200">
              El copiloto de IA para ventas y atención.
            </p>
            <p className="mt-2 max-w-sm text-sm">
              Una sola plataforma para cualquier negocio que vive de sus leads.
            </p>
            <div className="mt-6 space-y-1 text-sm">
              <a
                href="mailto:coflipweb@gmail.com"
                className="block transition-colors hover:text-white"
              >
                coflipweb@gmail.com
              </a>
              <a
                href="tel:+5491133370937"
                className="block transition-colors hover:text-white"
              >
                +54 9 11 3337-0937
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-base italic text-beige-200">{col.title}</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Flip. Todos los derechos reservados.</p>
          <p className="font-serif italic text-beige-200">Hecho para negocios que viven de sus leads.</p>
        </div>
      </div>
    </footer>
  )
}
