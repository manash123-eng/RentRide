/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        graphite: "#121826",
        slate: {
          850: "#172033",
        },
        electric: {
          DEFAULT: "#3D5AFE",
          50: "#EEF1FF",
          100: "#DCE2FF",
          400: "#5B76FF",
          500: "#3D5AFE",
          600: "#2541E0",
          700: "#1B30B0",
        },
        amber: {
          accent: "#FFB020",
        },
      },
      fontFamily: {
        display: ["'Clash Display'", "Sora", "ui-sans-serif", "system-ui"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgba(15, 23, 42, 0.15)",
        glow: "0 0 0 1px rgba(61,90,254,0.15), 0 8px 30px -6px rgba(61,90,254,0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
