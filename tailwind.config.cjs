/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0d1117',
          800: '#161b22',
          700: '#21262d',
          600: '#30363d',
          500: '#484f58',
          400: '#656c76',
          300: '#8b949e',
          200: '#c9d1d9',
          100: '#f0f6fc',
        }
      },
      fontFamily: {
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}