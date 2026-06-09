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
      },
      animation: {
        dropdownFadeIn: 'dropdownFadeIn 0.18s ease-out',
      },
    },
  },
  plugins: [],
}
