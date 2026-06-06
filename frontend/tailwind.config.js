/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void:    '#0a0a08',
        deep:    '#0f0f0c',
        surface: '#161612',
        raised:  '#1e1e19',
        overlay: '#252520',
        amber: {
          dim:    '#b8860b',
          mid:    '#d4a017',
          bright: '#f5c518',
        },
        teal: {
          dim:    '#0d7377',
          mid:    '#14a085',
          bright: '#1de9b6',
        },
        rose: {
          dim:    '#8b2635',
          mid:    '#c0392b',
          bright: '#ff6b6b',
        },
        text: {
          primary: '#f0ede6',
          body:    '#b8b4a8',
          muted:   '#6b6860',
          accent:  '#f5c518',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Outfit', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        orbit:       'orbit 6s linear infinite',
        'grid-pulse': 'gridPulse 8s ease-in-out infinite',
        blink:       'blink 1s step-end infinite',
        shimmer:     'shimmer 2s linear infinite',
        'fill-bar':  'fillBar 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        orbit: {
          from: { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        gridPulse: {
          '0%,100%': { opacity: '0.4' },
          '50%':     { opacity: '0.7' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fillBar: {
          from: { width: '0%' },
          to:   { width: 'var(--target-width)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
