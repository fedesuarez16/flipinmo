import type { Metadata } from 'next'

// Prevent search engines from indexing the admin section.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Security warning banner — always visible */}
      <div className="w-full border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
        <strong>Zona admin sin autenticación.</strong> No expongas esta URL
        públicamente ni la compartas con personas no autorizadas.
      </div>
      <main>{children}</main>
    </div>
  )
}
