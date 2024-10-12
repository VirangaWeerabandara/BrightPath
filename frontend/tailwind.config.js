/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        primary: {
          100: '#EDE9FE',
          300: '#C4B5FD',
          600: '#7C3AED',
        },
        secondary: {
          100: '#FEEFED',
          300: '#75E3EA',
          600: '#1DB5BE',
        },
        natural: {
          100: '#F9FAFB',
          300: '#D1D5DB',
          500: '#6B7280',
          600: '#1F2937',
          700: '#374151',
          900: '#111827',

        },

      }
    },
  },
  plugins: [],
}

