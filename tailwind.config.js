/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F17', // Main background
          800: '#111827', // Sidebar / Cards
          700: '#1F2937', // Hover states
          600: '#374151', // Borders
        },
        brand: {
          green: '#22C55E',
          red: '#EF4444',
          yellow: '#EAB308',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

