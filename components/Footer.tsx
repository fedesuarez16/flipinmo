import Image from 'next/image'

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Image 
                src="/logo.png" 
                alt="Flip" 
                width={180} 
                height={60}
                className="h-28 w-auto brightness-0 invert"
              />
            </div>
            <p className="mb-4 max-w-md">
              La plataforma que automatiza todo el proceso inmobiliario, desde el lead hasta la venta cerrada. 
              Transforma tu negocio con herramientas inteligentes.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Características
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Precios
                </a>
              </li>
              
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:coflipweb@gmail.com" className="hover:text-white transition-colors">
                  coflipweb@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +54 9 11 3337-0937
                </a>
              </li>
              <li className="pt-4">
                <a
                href="https://calendar.app.google/4rC6HTH9hAZHG8XP7"
                target="_blank"
                rel="noopener noreferrer"
                 className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Solicitar Demo
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Flip. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
