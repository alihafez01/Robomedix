/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4A4A88',
        'secondary': '#0D0D2B',
        'purple-dark': '#1A1A50',
      },
      container: {
      center: true,
    },
    },
  },
  plugins: [],
}