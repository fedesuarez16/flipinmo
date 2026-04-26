import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument',
})

export const metadata: Metadata = {
  title: 'Flip — El copiloto de IA para ventas y atención',
  description:
    'Agentes de IA que automatizan la captación, el seguimiento y el cierre. Para inmobiliarias, concesionarias, clínicas, academias, e-commerce, ferreterías y agencias de viajes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${instrument.variable}`}>
      <body className="font-sans antialiased bg-white text-neutral-900">
        {children}
      </body>
    </html>
  )
}
