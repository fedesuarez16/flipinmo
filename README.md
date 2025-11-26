# Flip - Landing Page

Landing page para Flip, una startup inmobiliaria que automatiza el proceso desde el lead hasta la venta.

## Tecnologías

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
flip/
├── app/
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Página principal
│   └── globals.css     # Estilos globales
├── components/
│   ├── Header.tsx      # Header con navegación y hero
│   ├── Features.tsx    # Sección de características
│   └── Footer.tsx      # Footer con información de contacto
└── package.json
```

## Características

- **Header**: Navegación responsive con hero section
- **Features**: Destaca las herramientas principales:
  - Funnel Inteligente
  - Matcheo Inteligente
  - Automatización Completa
- **Footer**: Información de contacto y enlaces

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
