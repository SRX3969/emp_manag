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
        // Enterprise light and dark tokens
        brand: {
          50: '#F0F5FF',
          100: '#E5EDFF',
          200: '#CDDCFF',
          300: '#A4BEFF',
          400: '#7197FF',
          500: '#3B6DFF',
          600: '#1E4CFA',
          700: '#1135E0',
          800: '#102BB5',
          900: '#13288E',
          950: '#0B1754',
        },
        slate: {
          850: '#17181B',
          900: '#101113',
          950: '#0A0A0C',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#17181B',
          'dark-elevated': '#1D1F23',
          'dark-border': '#292B30',
        },
        bg: {
          light: '#F8F9FA',
          dark: '#101113',
        },
        status: {
          success: '#10B981',
          'success-bg': '#ECFDF5',
          'success-dark-bg': '#064E3B',
          warning: '#F59E0B',
          'warning-bg': '#FFFBEB',
          'warning-dark-bg': '#78350F',
          danger: '#EF4444',
          'danger-bg': '#FEF2F2',
          'danger-dark-bg': '#7F1D1D',
          info: '#3B82F6',
          'info-bg': '#EFF6FF',
          'info-dark-bg': '#1E3A8A',
        }
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'page-title': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'section-title': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-base': ['0.9375rem', { lineHeight: '1.45rem' }],
        'table-cell': ['0.875rem', { lineHeight: '1.25rem' }],
        'metadata': ['0.8125rem', { lineHeight: '1.125rem' }],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
