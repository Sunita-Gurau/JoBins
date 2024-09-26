/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          1: "#A5A3AE4D",
        }
      },
      fontSize: {
        "13px": [
          "0.8125rem",
          {
            lineHeight: "1.125rem",
          },
        ],
   
    },
  },
  }
}