/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e6e3',
          200: '#c6ccc6',
          300: '#a3ada3',
          400: '#7a8a7a',
          500: '#5d6f5d',
          600: '#4a5a4a',
          700: '#3d4a3d',
          800: '#333c33',
          900: '#2d322d',
        },
        cream: {
          50: '#fefcf9',
          100: '#fdf7f0',
          200: '#f9ebe1',
          300: '#f3dcc9',
          400: '#ebc8a6',
          500: '#e0b280',
          600: '#d19c5c',
          700: '#b8834a',
          800: '#946a3e',
          900: '#785636',
        },
        terracotta: {
          50: '#fdf5f3',
          100: '#fbe8e2',
          200: '#f6d5cb',
          300: '#efbba8',
          400: '#e59677',
          500: '#da7751',
          600: '#c8603a',
          700: '#a64f30',
          800: '#89442c',
          900: '#713d2a',
        },
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
    },
  },
  plugins: [],
};