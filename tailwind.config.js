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
        powerbi: {
          yellow: '#F2C811',
          gold: '#E59F00',
          dark: '#111827',
          gray: '#201F1E',
          card: '#292827',
          blue: '#118DFF',
          teal: '#12239E',
          cyan: '#00B8D9',
          green: '#107C41',
          orange: '#D83B01',
          purple: '#6B29A3',
          surface: '#F8F9FA',
          border: '#EDEBE9'
        }
      },
      fontFamily: {
        powerbi: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
