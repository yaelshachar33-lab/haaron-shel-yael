/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFAF7',
          100: '#F8F4F0',
          200: '#EDE8E3',
          300: '#E0D9D2',
        },
        taupe: {
          300: '#D4C5B3',
          400: '#C4A882',
          500: '#A88D6B',
          600: '#8B7355',
        },
        blush: {
          100: '#F7E8E3',
          200: '#EDD4CC',
          300: '#E8C5B8',
          400: '#D4A898',
        },
        charcoal: '#2C2C2C',
        'warm-gray': '#5C5550',
      },
      fontFamily: {
        heebo:     ['Assistant', 'sans-serif'],
        frank:     ['Assistant', 'sans-serif'],
        assistant: ['Assistant', 'sans-serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-in-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'modal-in':  'modalIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modalIn: {
          '0%':   { opacity: '0', transform: 'scale(0.97) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
