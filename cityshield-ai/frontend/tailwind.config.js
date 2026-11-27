/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1769D2',
          hover: '#1357B0',
          light: '#EBF3FD',
          dark: '#0E448A'
        },
        secondary: {
          DEFAULT: '#F28C28',
          hover: '#D9771E',
          light: '#FEF4EA'
        },
        background: '#F7F9FC',
        card: '#FFFFFF',
        text: {
          main: '#172033',
          muted: '#68758A'
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#1769D2',
          stale: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(23, 32, 51, 0.05)',
        'soft-md': '0 4px 20px rgba(23, 32, 51, 0.08)',
        'soft-lg': '0 10px 30px rgba(23, 32, 51, 0.12)',
      }
    },
  },
  plugins: [],
}
