/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        saffron: {
          DEFAULT: '#FF6F00',
          hover: '#E65100',
          light: '#FFF3E0',
          dark: '#BF360C'
        },
        navy: {
          DEFAULT: '#0A2540',
          hover: '#071829',
          light: '#F4F7FB',
          dark: '#040F1D'
        },
        indiaGreen: {
          DEFAULT: '#138808',
          hover: '#0F6B06',
          light: '#E8F5E9',
          dark: '#0B4D04'
        },
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: {
          main: '#0F172A',
          muted: '#64748B'
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
        'soft': '0 2px 10px rgba(15, 23, 42, 0.05)',
        'soft-md': '0 4px 20px rgba(15, 23, 42, 0.08)',
        'soft-lg': '0 10px 30px rgba(15, 23, 42, 0.12)',
        'glow-saffron': '0 0 25px rgba(255, 111, 0, 0.35)',
        'glow-primary': '0 0 25px rgba(23, 105, 210, 0.35)',
        'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.4)'
      },
      animation: {
        marquee: 'marquee var(--duration, 35s) linear infinite',
        'marquee-reverse': 'marquee-reverse var(--duration, 35s) linear infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'fade-up': 'fadeInUp 0.6s ease-out both',
        'scan-sweep': 'scanSweep 3.2s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
        'rain-fall': 'rainFall 1.2s linear infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0%)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0%)' },
        },
        radarSweep: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        rainFall: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '30%': { opacity: '0.8' },
          '100%': { transform: 'translateY(120px)', opacity: '0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scanSweep: {
          '0%': { top: '0%', opacity: '0.15' },
          '50%': { top: '88%', opacity: '0.75' },
          '100%': { top: '0%', opacity: '0.15' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
