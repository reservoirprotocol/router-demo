module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#F1E5FF',
          300: '#E2CCFF',
          500: '#A966FF',
          700: '#7000FF',
          900: '#430099',
        },
      },
    },
  },
  plugins: [require('@ramosdiego/reservoir')()],
}
