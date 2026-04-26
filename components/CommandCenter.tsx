const leads = [
  {
    initials: 'LM',
    name: 'Lucía M.',
    preview: 'Hola, me interesa el modelo 2022 que vi en su web…',
    channel: 'WhatsApp',
    time: 'ahora',
    status: 'Caliente',
    statusTone: 'bg-rose-50 text-rose-700',
  },
  {
    initials: 'JP',
    name: 'Juan P.',
    preview: '¿Tienen turno disponible para limpieza esta semana?',
    channel: 'Instagram',
    time: '2 min',
    status: 'Nuevo',
    statusTone: 'bg-emerald-50 text-emerald-700',
  },
  {
    initials: 'AS',
    name: 'Ana S.',
    preview: 'Quería saber si el curso tiene cuotas sin interés.',
    channel: 'Web',
    time: '6 min',
    status: 'Tibio',
    statusTone: 'bg-amber-50 text-amber-700',
  },
  {
    initials: 'RG',
    name: 'Rodrigo G.',
    preview: 'Confirmo la visita del jueves a las 17 hs.',
    channel: 'WhatsApp',
    time: '12 min',
    status: 'Agendado',
    statusTone: 'bg-blue-50 text-blue-700',
  },
]

const channels = [
  { label: 'Todos', count: 142, active: true },
  { label: 'WhatsApp', count: 86 },
  { label: 'Instagram', count: 28 },
  { label: 'Email', count: 19 },
  { label: 'Web', count: 9 },
]

export default function CommandCenter() {
  return (
    <section id="crm" className="border-b border-beige-200 bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-base italic text-beige-500">
            — Centro de comando
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
            El{' '}
            <span className="font-serif italic font-normal text-beige-500">
              primer
            </span>{' '}
            copiloto de
            <br />
            ventas y atención.
          </h2>
          <p className="mt-4 text-base text-neutral-600 sm:text-lg">
            Todas tus conversaciones, leads y métricas en un solo lugar. Flip
            sugiere la próxima acción y ejecuta por vos cuando se lo pedís.
          </p>
        </div>

        <div className="mt-16">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
                </div>
                <span className="ml-3 text-xs font-medium text-neutral-600">flip.app / inbox</span>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-500">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                  Buscar leads…
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
                  F
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Sidebar */}
              <aside className="border-b border-neutral-200 bg-neutral-50/50 p-5 lg:col-span-3 lg:border-b-0 lg:border-r">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Canales
                </p>
                <ul className="space-y-1">
                  {channels.map((c) => (
                    <li
                      key={c.label}
                      className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm ${
                        c.active
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className={c.active ? 'text-neutral-300' : 'text-neutral-500'}>
                        {c.count}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mb-3 mt-6 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Pipeline
                </p>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li className="flex items-center justify-between">
                    <span>Nuevos</span>
                    <span className="text-neutral-500">38</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>En seguimiento</span>
                    <span className="text-neutral-500">64</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Agendados</span>
                    <span className="text-neutral-500">22</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Cerrados</span>
                    <span className="text-neutral-500">18</span>
                  </li>
                </ul>
              </aside>

              {/* Leads list */}
              <div className="border-b border-neutral-200 lg:col-span-5 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between px-5 py-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                  <span>Bandeja unificada</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                    Live
                  </span>
                </div>
                <ul className="divide-y divide-neutral-100">
                  {leads.map((lead, i) => (
                    <li
                      key={lead.name}
                      className={`flex items-start gap-3 px-5 py-4 ${
                        i === 0 ? 'bg-neutral-50' : ''
                      }`}
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                        {lead.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-neutral-900">{lead.name}</p>
                          <span className="flex-shrink-0 text-xs text-neutral-500">{lead.time}</span>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-neutral-600">{lead.preview}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-neutral-500">{lead.channel}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${lead.statusTone}`}>
                            {lead.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detail / AI suggestion */}
              <div className="lg:col-span-4">
                <div className="border-b border-neutral-200 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                      LM
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Lucía M.</p>
                      <p className="text-xs text-neutral-500">WhatsApp · interesa modelo 2022</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 px-5 py-4">
                  <div className="max-w-[85%] rounded-lg rounded-bl-sm bg-neutral-100 px-3 py-2 text-sm text-neutral-800">
                    Hola, me interesa el modelo 2022 que vi en su web. ¿Tienen disponibilidad?
                  </div>

                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Sugerencia de Flip
                    </div>
                    <p className="text-sm text-neutral-800">
                      Hola Lucía 👋 Sí, tenemos 2 unidades del modelo 2022.
                      ¿Querés que te agende un test drive para esta semana?
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white">
                        Enviar
                      </button>
                      <button className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700">
                        Editar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-200 px-5 py-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Hoy
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xl font-semibold text-neutral-900">142</p>
                      <p className="text-xs text-neutral-500">Conversaciones</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-neutral-900">94%</p>
                      <p className="text-xs text-neutral-500">Respondidas {'<'}1 min</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-neutral-900">22</p>
                      <p className="text-xs text-neutral-500">Turnos agendados</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-neutral-900">+38%</p>
                      <p className="text-xs text-neutral-500">Conversión vs. mes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Bandeja unificada</h3>
              <p className="mt-2 text-sm text-neutral-600">
                WhatsApp, Instagram, email y web en una sola pantalla. El equipo
                deja de saltar entre apps.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Sugerencias de IA</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Cada conversación trae la próxima acción ya redactada. Aprobás
                con un click o dejás que Flip responda solo.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Pipeline al día</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Estado de cada lead, métricas en vivo y alertas cuando algo se
                enfría. Sin cargas manuales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
