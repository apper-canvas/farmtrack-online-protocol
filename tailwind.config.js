/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9e8",
          100: "#dcf0c6",
          200: "#c1e891",
          300: "#9fda52",
          400: "#7bc520",
          500: "#2d5016",
          600: "#254411",
          700: "#1e360e",
          800: "#17290b",
          900: "#0f1c07"
        },
        secondary: {
          50: "#f8f9f1",
          100: "#eef1d9",
          200: "#dde4b1",
          300: "#c7d582",
          400: "#b4c559",
          500: "#6b8e23",
          600: "#5a7a1c",
          700: "#496416",
          800: "#3a4f11",
          900: "#2d3c0d"
        },
        accent: {
          50: "#fff8f0",
          100: "#ffeed9",
          200: "#ffd9b3",
          300: "#ffbf80",
          400: "#ffa64d",
          500: "#ff8c00",
          600: "#e67d00",
          700: "#cc6f00",
          800: "#b36100",
          900: "#995300"
        },
        surface: "#f5f5dc",
        background: "#fafaf5",
        success: "#4a7c23",
        warning: "#d4a017",
        error: "#8b2e00",
        info: "#4682b4"
      }
    },
  },
  plugins: [],
}