/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{js,jsx,ts,tsx}'],
  plugins: [],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        sm: '576px',
        'sm-max': { max: '576px' },
        md: '768px',
        'md-max': { max: '768px' },
        lg: '992px',
        'lg-max': { max: '992px' },
        xl: '1200px',
        'xl-max': { max: '1200px' },
        '2xl': '1400px',
        '2xl-max': { max: '1320px' },
      },
      colors: {
        gray: {
          100: '#F9FAFB',
          200: '#F3F4F5',
          300: '#DCDEE0',
          400: '#C5C8CC',
          800: '#B0BBC1',
          1200: '#80858E',
          1600: '#63676F',
          2000: '#4A4D53',
          2400: '#3A3C41',
        },

        red: {
          100: '#FFE1D0',
          400: '#FFB489',
          800: '#FF8643',
          1200: '#E45200',
          1600: '#AD3E00',
          2000: '#7E2D00',
          2400: '#4E1C00',
        },

        orange: {
          100: '#FEF4EE',
          400: '#FBD4BB',
          800: '#F8A976',
          1200: '#F37321',
          1600: '#C9550B',
          2000: '#8D3C08',
          2400: '#3C1A03',
        },

        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#fbcf33',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },

        green: {
          100: '#DAF3C5',
          400: '#99DA67',
          800: '#7DD03C',
          1200: '#5DBA14',
          1600: '#459D00',
          1800: '#3A8500',
          2000: '#306E00',
          2400: '#1C3F00',
        },

        blue: {
          100: '#D0F1FF',
          400: '#89DCFF',
          800: '#43C7FF',
          1200: '#1499DA',
          1600: '#0079AD',
          2000: '#00587E',
          2400: '#00374E',
        },
      },

      textOpacity: ({ theme }) => theme('opacity'),
    },

    plugins: [],
  },
}
