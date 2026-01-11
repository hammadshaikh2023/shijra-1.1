
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        emerald: {
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
}
