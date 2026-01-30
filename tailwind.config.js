/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'coffee-dark': '#1C120B',
        'coffee-brown': '#3B2416',
        'gold-royal': '#D4AF37',
        'maroon-royal': '#7A1E2D',
        'off-white': '#F5F2ED',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-coffee': 'linear-gradient(180deg, #1C120B 0%, #3B2416 100%)',
      },
    },
  },
  plugins: [],
}
