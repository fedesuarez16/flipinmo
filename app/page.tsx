import Hero from '@/components/Hero'
import Verticals from '@/components/Verticals'
import Features from '@/components/Features'
import CommandCenter from '@/components/CommandCenter'
import CaseStudy from '@/components/CaseStudy'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Verticals />
        <CommandCenter />
        <Features />

        <CaseStudy />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
