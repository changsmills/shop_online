/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], 
      },

      colors: {
        'brand-orange': '#FF6600',
        'brand-hover': '#e55a00',
        'brand-light': '#fff5f0',
        'bg-primary': '#ffffff',
        'text-primary': '#000000',
      }
    },
  },
  plugins: [],
}