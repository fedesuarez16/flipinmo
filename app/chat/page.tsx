import type { Metadata } from 'next'
import ChatClient from './ChatClient'

export const metadata: Metadata = {
  title: 'Demo — Flip',
  description:
    'Probá Flip en vivo. Conversá con el copiloto de IA y mirá cómo responde, califica y avanza una conversación de ventas.',
}

export default function ChatPage() {
  return <ChatClient />
}
