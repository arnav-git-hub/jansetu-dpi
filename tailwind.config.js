/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        india: {
          saffron: '#FF9933',
          navy: '#000080',
          green: '#138808',
          ashoka: '#000080',
        },
        gov: {
          blue: '#1E3A8A',
          dark: '#0F172A',
          slate: '#1E293B',
          card: '#1E293B',
          accent: '#38BDF8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
