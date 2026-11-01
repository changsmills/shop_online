/** @type {import('tailwindcss').Config} */
 export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
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
    },

    keyframes: {
      blob: {
        '0%': { transform: 'translateX(0vw) translateY(0vh) scale(1)' },
        '50%': { transform: 'translateX(-50vw) translateY(10vh) (scale(1.2)' },
        '100%': { transform: 'translateX(-100vw) translateY(-10vh) scale(1)' }
      },
    },
    animation: {
     'blob-left': 'blob 15s infinite alternate ease-in-out',
    'blob-right': 'blob 18s infinite alternate-reverse ease-in-out',
    },
    animationDelay: {
      '2000': '2s',
      '4000': '4s',
    },
  },
};
export const plugins = [];