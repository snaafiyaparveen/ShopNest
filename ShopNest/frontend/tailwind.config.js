/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#111827',      // Primary
        violet: {
          DEFAULT: '#7C3AED', // Accent
          hover: '#6D28D9',   // Accent hover
        },
        surface: '#F8FAFC',   // Background
        card: '#FFFFFF',      // Cards
        ink: '#0F172A',       // Main text
        slate: {
          DEFAULT: '#64748B', // Secondary text
          border: '#E2E8F0',  // Border
        },
        success: '#10B981',   // Success
        discount: '#EF4444',  // Discount / Error
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08)',
        popover: '0 10px 30px -10px rgba(15, 23, 42, 0.25)',
        sticky: '0 -4px 16px rgba(15, 23, 42, 0.08)',
      },
      animation: {
        'slide-in': 'slideIn 0.25s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
