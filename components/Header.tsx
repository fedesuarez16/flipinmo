'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { SiGooglecalendar, SiGmail, SiMeta } from 'react-icons/si'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative w-full">
      {/* Navigation Bar - Fixed */}
      <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-orange-50 via-pink-50 to-white backdrop-blur-sm border-b border-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Flip" 
                width={180} 
                height={60}
                className="h-32 w-auto"
                priority
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              <a href="#features" className="text-gray-700 hover:text-primary-600 transition-colors">
                Características
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                Contacto
              </a>
              <a
                href="https://calendar.app.google/4rC6HTH9hAZHG8XP7"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Solicitar Demo
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-primary-600 transition-colors">
                Características
              </a>
              <a href="#contact" className="block text-gray-700 hover:text-primary-600 transition-colors">
                Contacto
              </a>
              <a 
              href="https://calendar.app.google/4rC6HTH9hAZHG8XP7"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Solicitar Demo
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-screen overflow-hidden">
        {/* Background with gradient and grid pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-pink-50 to-white"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Left Section - Text Content (2/3) */}
            <div className="md:col-span-2 space-y-8">
              <h2 className="text-5xl md:text-6xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Responde, capta y vende
                <span className="font-light"> Todo en automático</span>
              </h2>
              <p className="text-xl md:text-2xl font-light text-gray-700 max-w-2xl leading-relaxed">
                Automatiza todo el proceso inmobiliario desde que entra un lead hasta que se concierta 
                una visita, venta o contrato. Herramientas inteligentes que trabajan para ti 24/7.
              </p>
              
              {/* CTA Section */}
              <div className="pt-8">
                <p className="text-gray-600 mb-4 text-lg">
                  Únete a <span className="font-bold text-gray-900">las miles</span> deinmobiliarias que ya están automatizando sus ventas
                </p>
                <a 
                href="https://calendar.app.google/4rC6HTH9hAZHG8XP7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg relative z-10">
                  Comenzar Ahora →
                </a>
              </div>
            </div>

            {/* Right Section - Product Demo (1/3) */}
            <div className="md:col-span-1 relative">
              <div className="relative">
                {/* Background gradient for right section */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-white rounded-2xl"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] rounded-2xl"></div>
                
                {/* Main Dashboard Window */}
                <div className="relative backdrop-blur-xl bg-white/70 rounded-2xl shadow-2xl p-6 border border-white/20">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-gray-100/50 rounded-lg px-4 py-2 text-sm text-gray-500">
                      Buscar leads o propiedades...
                    </div>
                  </div>

                  {/* Sidebar Icons */}
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Leads List */}
                  <div className="space-y-3">
                    <div className="bg-white/60 rounded-lg p-3 border border-gray-200/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">María González</span>
                        <span className="text-xs text-gray-500">3m</span>
                      </div>
                      <p className="text-xs text-gray-600">Lead caliente - Busca departamento 2 hab</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 border border-gray-200/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">Carlos Ruiz</span>
                        <span className="text-xs text-gray-500">5m</span>
                      </div>
                      <p className="text-xs text-gray-600">Propiedad encontrada - Enviada por WhatsApp</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 border border-gray-200/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">Ana Martínez</span>
                        <span className="text-xs text-gray-500">9m</span>
                      </div>
                      <p className="text-xs text-gray-600">Visita programada - Mañana 10:00 AM</p>
                    </div>
                  </div>

                  {/* Bottom Panel */}
                  <div className="mt-4 bg-primary-50/50 rounded-lg p-3 border border-primary-100/50">
                    <p className="text-xs text-gray-700 font-medium">
                      Tienes <span className="font-bold text-primary-600">4 nuevos</span> y <span className="font-bold text-primary-600">9 activos</span> leads
                    </p>
                  </div>
                </div>

                {/* Notification Windows - Stacked */}
                <div className="absolute -top-4 -right-4 backdrop-blur-xl bg-white/60 rounded-xl shadow-xl p-4 border border-white/20 w-64 transform rotate-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-600">M</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">María González</p>
                      <p className="text-xs text-gray-500">24m atrás</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700">Propiedad encontrada. Coincidencia perfecta con búsqueda.</p>
                </div>

                <div className="absolute top-16 -right-2 backdrop-blur-xl bg-white/50 rounded-xl shadow-xl p-3 border border-white/20 w-56 transform -rotate-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">✓</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900">Carlos Ruiz</p>
                  </div>
                  <p className="text-xs text-gray-600">Revisar visita programada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
          {/* Integrations Carousel */}
          <div className="relative py-20 pb-8 overflow-hidden">
        {/* Background with gradient and grid pattern - matching header style */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-regular text-gray-600  tracking-wider">Integra tu herramientas favoritas</h3>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-12">
              {/* First set */}
              {[
                { name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
                { name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
                { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
                { name: 'Google Calendar', icon: SiGooglecalendar, color: '#4285F4' },
                { name: 'Meta', icon: SiMeta, color: '#0081FB' },
                { name: 'Gmail', icon: SiGmail, color: '#EA4335' }
              ].map((integration, idx) => {
                const IconComponent = integration.icon
                return (
                  <div key={idx} className="flex items-center justify-center min-w-[100px]">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-14 h-14 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center border border-gray-200/50 shadow-sm">
                        <IconComponent className="w-7 h-7" style={{ color: integration.color }} />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{integration.name}</span>
                    </div>
                  </div>
                )
              })}
              {/* Duplicate for seamless loop */}
              {[
                { name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
                { name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
                { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
                { name: 'Google Calendar', icon: SiGooglecalendar, color: '#4285F4' },
                { name: 'Meta', icon: SiMeta, color: '#0081FB' },
                { name: 'Gmail', icon: SiGmail, color: '#EA4335' }
              ].map((integration, idx) => {
                const IconComponent = integration.icon
                return (
                  <div key={`dup-${idx}`} className="flex items-center justify-center min-w-[100px]">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-14 h-14 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center border border-gray-200/50 shadow-sm">
                        <IconComponent className="w-7 h-7" style={{ color: integration.color }} />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{integration.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>


    
    </header>
  )
}
