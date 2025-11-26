import Header from '@/components/Header'
import Features from '@/components/Features'
import Efficiency from '@/components/Efficiency'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Efficiency />
      <Features />
     
      <Footer />
    </main>
  )
}
