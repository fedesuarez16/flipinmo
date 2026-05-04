import Hero from '@/components/Hero'
import WhyItMatters from '@/components/WhyItMatters'
import Features from '@/components/Features'
import FunnelInteligente from '@/components/FunnelInteligente'
import MatcheoInteligente from '@/components/MatcheoInteligente'
import AutomatizacionCompleta from '@/components/AutomatizacionCompleta'
import CommandCenter from '@/components/CommandCenter'
import CaseStudy from '@/components/CaseStudy'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <AutomatizacionCompleta />
        <WhyItMatters />
        <FunnelInteligente />
        <MatcheoInteligente />
        <CommandCenter />

        <Features />

        <CaseStudy />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
