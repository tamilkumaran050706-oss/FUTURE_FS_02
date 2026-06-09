/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      keyframes: {
        dropdownFadeIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96) translateY(-6px)' },
          '100%': { opacity: '1', transform: 'scale(1)   translateY(0)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        dropdownFadeIn: 'dropdownFadeIn 0.18s ease-out',
        fadeInUp:       'fadeInUp 0.35s ease-out both',
        fadeIn:         'fadeIn 0.4s ease-out both',
        slideInLeft:    'slideInLeft 0.3s ease-out both',
        slideInRight:   'slideInRight 0.3s ease-out both',
        shimmer:        'shimmer 2s linear infinite',
        pulseSlow:      'pulseSlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
