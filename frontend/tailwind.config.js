/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#E8F7F4',
          100: '#B8E8DF',
          500: '#2D9B83',
          600: '#238A72',
          700: '#1A6B58',
        },
        amber: {
          50:  '#FDF3E0',
          500: '#F5A623',
          900: '#7A5010',
        },
        warm: {
          50:  '#FAFAF8',
          100: '#F2F1EE',
          200: '#E8E6E1',
          400: '#C4C1BA',
          600: '#6B6860',
          900: '#2C2A26',
        },
        semantic: {
          success: '#4CAF7D',
          warning: '#F5A623',
          error:   '#E8534A',
          data:    '#7B8FF5',
        }
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      borderRadius: {
        'sm':  '4px',
        'md':  '8px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'raised': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
      },
      fontSize: {
        'symbol-sm': '10px',
        'symbol-md': '12px',
        'symbol-lg': '14px',
      }
    },
  },
  plugins: [],
}