/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        // Clean, minimal palette — off-white canvas, slate text, single accent
        canvas: "#F7F7F5",
        surface: "#FFFFFF",
        border: "#E5E5E3",
        subtle: "#A3A3A0",
        ink: "#1A1A18",
        accent: "#2563EB",
        "accent-light": "#EFF6FF",
        // Status colours
        pending: {
          bg: "#FEF9EE",
          text: "#B45309",
          dot: "#F59E0B",
        },
        in_progress: {
          bg: "#EFF6FF",
          text: "#1D4ED8",
          dot: "#3B82F6",
        },
        completed: {
          bg: "#F0FDF4",
          text: "#15803D",
          dot: "#22C55E",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px 0 rgba(0,0,0,0.08)",
        modal: "0 20px 60px -10px rgba(0,0,0,0.15)",
      },
    },
  },
  plugins: [],
};
