/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:       '#E8702A',
          'orange-dk':  '#D9621E',
          'orange-lt':  '#FDEAD9',
          green:        '#3F6B3D',
          'green-lt':   '#5A8C56',
          'green-accent':'#7AB55A',
          cream:        '#FAF3E3',
          'cream-dk':   '#F2EBDA',
          bone:         '#FCF8F0',
          ink:          '#2D2A26',
          'ink-mute':   '#6B655C',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':     '0 1px 2px rgba(45,42,38,0.04), 0 4px 12px rgba(45,42,38,0.05)',
        'card-hov': '0 2px 4px rgba(232,112,42,0.08), 0 8px 24px rgba(232,112,42,0.10)',
        'pop':      '0 0 0 4px rgba(232,112,42,0.18)',
      },
      borderRadius: {
        'card': '14px',
        'pill': '999px'
      }
    },
  },
  plugins: [],
}
