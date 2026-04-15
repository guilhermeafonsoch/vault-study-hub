/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Fira Code", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          900: "#0b0d14",
          800: "#0f1117",
          700: "#13151f",
          600: "#1a1d27",
          500: "#22252f",
          400: "#2a2d3a",
          300: "#3b3f52",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in": "fadeIn 0.3s ease",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0, transform: "translateY(4px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
