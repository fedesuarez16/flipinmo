export default function Efficiency() {
  return (
    <section className="relative py-10 md:py-32 overflow-hidden bg-white">
        {/* Background with gradient and grid pattern - matching header style */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text Content */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-6">
                EFICIENCIA OPERATIVA
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Ahorra tiempo, capital humano y aumenta tu eficiencia
            </h2>
            
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Al automatizar todo el proceso desde la captación hasta la venta, Flip reduce significativamente 
                la carga de trabajo manual. Tu equipo puede enfocarse en lo que realmente importa: cerrar negocios.
              </p>
              <p>
                Cada tarea automatizada libera horas de trabajo, permitiendo que tu capital humano se concentre 
                en actividades de mayor valor y mejorando la productividad general de tu inmobiliaria.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div>
                <div className="text-3xl font-bold text-gray-900">80%</div>
                <div className="text-sm text-gray-600 mt-1">Menos tiempo en tareas repetitivas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">3x</div>
                <div className="text-sm text-gray-600 mt-1">Más leads gestionados</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600 mt-1">Automatización continua</div>
              </div>
            </div>
          </div>

          {/* Right Section - UI Mockup */}
          <div className="relative">
            <div className="relative backdrop-blur-xl bg-white rounded-2xl shadow-2xl p-6 border border-gray-200/50">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">LC</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">Lead Caliente</span>
                      <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-600 text-xs font-medium">Nuevo</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">Busca departamento 2 hab, zona norte</p>
                  </div>
                </div>
              </div>

              {/* Auto-processing indicator */}
              <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-orange-50 via-pink-50 to-blue-50 border border-gray-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-400 to-blue-400 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600">Procesando automáticamente...</span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Propiedad encontrada en inventario</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Mensaje enviado por WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Lead actualizado en sistema</span>
                  </div>
                </div>
              </div>

              {/* Time saved indicator */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tiempo ahorrado</p>
                    <p className="text-lg font-bold text-gray-900">45 minutos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Tareas completadas</p>
                    <p className="text-lg font-bold text-gray-900">3/3</p>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="mt-4 flex items-center gap-2 pt-4 border-t border-gray-200">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a2 2 0 00-2.828-2.828l-6.586 6.586a2 2 0 11-2.828-2.828L15.172 7z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gray-100 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gray-100 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

