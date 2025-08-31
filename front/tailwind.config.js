// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {

  
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb", // blue-600
          dark: "#1e40af",   // blue-800
          light: "#60a5fa",  // blue-400
        },
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
}
