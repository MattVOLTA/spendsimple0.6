/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#4F46E5', // Deep purple from logo
          blue: '#38BDF8',   // Turquoise blue from logo
          orange: '#FB923C', // Orange from logo
          coral: '#F87171',  // Coral/pink from logo
          light: '#E0E7FF'   // Light purple for backgrounds
        }
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
};