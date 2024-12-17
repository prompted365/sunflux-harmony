import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#C84B31", // Burnt Orange
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFAA5A", // Pale Orange
          foreground: "#1F2937",
        },
        destructive: {
          DEFAULT: "#9B1B30", // Charred Red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#2D3A3A", // Charcoal
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FFAA5A", // Pale Orange
          foreground: "#1F2937",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1F2937",
        },
      },
      keyframes: {
        "roll-down": {
          "0%": { transform: "translateY(-100%) rotate(0deg)" },
          "100%": { transform: "translateY(0) rotate(-2deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "solar-pulse": {
          "0%, 100%": { 
            transform: "scale(1)",
            opacity: "0.9"
          },
          "50%": { 
            transform: "scale(1.05)",
            opacity: "1"
          },
        },
        "sun-ray": {
          "0%": { 
            transform: "rotate(0deg)",
            opacity: "0.5"
          },
          "100%": { 
            transform: "rotate(360deg)",
            opacity: "1"
          },
        }
      },
      animation: {
        "roll-down": "roll-down 1s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "solar-pulse": "solar-pulse 3s ease-in-out infinite",
        "sun-ray": "sun-ray 20s linear infinite",
      },
      backgroundImage: {
        'solar-gradient': 'linear-gradient(135deg, #C84B31 0%, #9B1B30 100%)',
        'energy-pattern': 'radial-gradient(circle at center, #FFAA5A 0%, transparent 60%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;