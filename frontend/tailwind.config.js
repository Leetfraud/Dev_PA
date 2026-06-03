/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: "#0b8868",
          600: "#0b8868",
          400: "#10c99a",
          50: "#f0fdf8",
        },
        // Design system tokens
        brand: {
          gradient: { from: "#0b8868", to: "#323c4d" },
          dark: "#323c4d",
          primary: "#0b8868",
        },
        accent: {
          gold: "#F59E0B",
          cyan: "#22D3EE",
          purple: "#A855F7",
          green: "#10B981",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(248deg, #0b8868 0%, #323c4d 85%)",
      },
    },
  },
  plugins: [],
};
