import type { Metadata } from 'next'
import { InventoryClient } from './InventoryClient'

export const metadata: Metadata = {
  title: 'Inventario — Admin',
}

export default function AdminInventoryPage() {
  return <InventoryClient />
}
