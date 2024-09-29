/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          1: '#A5A3AE4D',
          2: '#F3F4F8',
          3: '#23272E',
          4: '#8B909A',
          5: '#DBDADE',
        },
        blue: {
          1: '#7367F0',
          2: '#0F60FF',
        },
        green: {
          1: '#1EB564',
          2: '#28C76F',
        },
      },
      fontSize: {
        '13px': [
          '0.8125rem',
          {
            lineHeight: '1.125rem',
          },
        ],
        '32px': ['2rem'],
      },
      width: {
        66: '17rem',
        1: '0.0625rem',
      },
    },
  },
};
