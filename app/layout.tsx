import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flip - Transforma tu negocio inmobiliario',
  description: 'Automatiza el proceso desde el lead hasta la venta con herramientas inteligentes de seguimiento y matcheo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
