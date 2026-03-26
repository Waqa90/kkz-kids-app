/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        display: ['Nunito', 'sans-serif'],
      },
      colors: {
        kitty: {
          orange: '#f97316',
          'orange-light': '#fed7aa',
          'orange-dark': '#ea580c',
          purple: '#a78bfa',
          'purple-light': '#ede9fe',
          'purple-dark': '#7c3aed',
          pink: '#f9a8d4',
          'pink-light': '#fce7f3',
          green: '#4ade80',
          'green-light': '#dcfce7',
          yellow: '#fbbf24',
          'yellow-light': '#fef3c7',
          blue: '#60a5fa',
          'blue-light': '#dbeafe',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'kitty': '0 4px 20px rgba(167, 139, 250, 0.25)',
        'kitty-lg': '0 8px 32px rgba(167, 139, 250, 0.35)',
        'word': '0 2px 8px rgba(249, 115, 22, 0.3)',
      },
      animation: {
        'bounce-in': 'bounce-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'wiggle': 'wiggle 0.6s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
      },
      fontSize: {
        'word': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'word-lg': ['2rem', { lineHeight: '2.5rem', fontWeight: '800' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};