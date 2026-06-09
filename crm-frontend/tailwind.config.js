/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
      },
      animation: {
        dropdownFadeIn: 'dropdownFadeIn 0.18s ease-out',
        fadeInUp:       'fadeInUp 0.35s ease-out both',
        fadeIn:         'fadeIn 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
