export default function Features() {
  const features = [
    {
      title: 'Funnel Inteligente',
      description: 'Sistema de seguimiento cíclico que transforma leads fríos en leads calientes automáticamente. Nuestro funnel inteligente monitorea cada interacción y ajusta la estrategia en tiempo real para maximizar las conversiones.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13l4-4m0 0l4 4m-4-4v12m8-12l4 4m0 0l-4-4m4 4V3" />
        </svg>
      ),
      gradient: 'from-gray-800 to-gray-900',
      bgGradient: 'from-gray-50 to-gray-100',
      highlights: [
        'Seguimiento automático desde lead frío hasta caliente',
        'Proceso cíclico que nunca pierde un lead',
        'Análisis de comportamiento en tiempo real',
        'Segmentación inteligente de leads'
      ]
    },
    {
      title: 'Matcheo Inteligente',
      description: 'Encuentra la propiedad perfecta para cada lead automáticamente. Si no hay coincidencias en tu inventario, busca en portales externos hasta encontrar la opción ideal y la envía por el medio preferido del cliente.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      gradient: 'from-gray-700 to-gray-800',
      bgGradient: 'from-gray-50 to-gray-100',
      highlights: [
        'Búsqueda automática de coincidencias perfectas',
        'Integración con portales inmobiliarios',
        'Envío por el canal preferido del cliente',
        'Búsqueda continua hasta encontrar la propiedad ideal'
      ]
    },
    {
      title: 'Automatización Completa',
      description: 'Desde el primer contacto hasta la venta cerrada, Flip gestiona todo el proceso. Ahorra tiempo, reduce errores y aumenta tus conversiones con automatización inteligente.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      gradient: 'from-gray-900 to-black',
      bgGradient: 'from-gray-100 to-white',
      highlights: [
        'Gestión completa del ciclo de ventas',
        'Comunicación automática con leads',
        'Programación inteligente de visitas',
        'Reportes y analytics en tiempo real'
      ]
    },
    {
      title: 'Comunicación Multi-Canal',
      description: 'Gestiona todas tus conversaciones desde un solo lugar. Responde automáticamente por WhatsApp, email, SMS y más. El sistema aprende tus preferencias y responde como tú lo harías.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      ),
      gradient: 'from-gray-600 to-gray-700',
      bgGradient: 'from-gray-50 to-white',
      highlights: [
        'Integración con WhatsApp, Email y SMS',
        'Respuestas automáticas inteligentes',
        'Historial completo de conversaciones',
        'Notificaciones en tiempo real'
      ]
    }
  ]

  return (
    <section id="features" className="relative py-12 md:py-32 overflow-hidden">
      {/* Background with gradient and grid pattern - matching header style */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r 0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Herramientas que marcan la diferencia
          </h2>
          <p className="text-xl md:text-2xl font-light text-gray-700 max-w-2xl mx-auto">
            Tecnología avanzada diseñada específicamente para el sector inmobiliario
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative backdrop-blur-xl bg-white/80 rounded-3xl shadow-lg p-10 border border-white/30 hover:shadow-2xl hover:scale-[1.01] transition-all duration-500 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon with gradient background */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 text-base leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.description}
                </p>
                
                <ul className="space-y-3">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start group/item">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mr-3 mt-0.5 group-hover/item:scale-110 transition-transform`}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-base leading-relaxed group-hover:text-gray-800 transition-colors">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Decorative corner element */}
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative backdrop-blur-xl bg-gradient-to-r from-orange-50 via-pink-50 to-white rounded-2xl shadow-2xl p-12 border border-white/20">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Listo para transformar tu negocio inmobiliario?
            </h3>
            <p className="text-xl font-light text-gray-700 mb-8 max-w-2xl mx-auto">
              Únete a las inmobiliarias que ya están automatizando sus ventas con Flip
            </p>
            <a 
            href="https://calendar.app.google/4rC6HTH9hAZHG8XP7"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">
              Solicitar Demo Gratuita →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
