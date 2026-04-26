/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument)', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#0a0a0a',
        cream: '#f7f4ee',
        beige: {
          50: '#faf6ef',
          100: '#f1ead9',
          200: '#e4d6b8',
          300: '#d3bd92',
          400: '#bfa370',
          500: '#a4895a',
          600: '#806a45',
        },
      },
    },
  },
  plugins: [],
}
