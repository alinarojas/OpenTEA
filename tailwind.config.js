/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Atkinson Hyperlegible", "sans-serif"],
    },
    extend: {
      colors: {
        brandBlue: "#4A72C2",
        brandGreen: "#5CA97D",
        brandBrown: "#C89A6A",
        brandGrayLight: "#F5F5F5",
        brandGray: "#D4D4D4",
        brandGrayDark: "#2E2E2E",
      },
    },
  },
  plugins: [],
};
