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
          DEFAULT: "#9b87f5",
          light: "#b3a4f7",
          dark: "#8370f3",
        },
        accent: {
          peach: "#FDE1D3",
          blue: "#D3E4FD",
        },
        taskPriority: {
          high: "#F97316",
          medium: "#8B5CF6",
          low: "#0EA5E9",
        },
      },
      keyframes: {
        "task-complete": {
          "0%": { transform: "translateX(0)" },
          "10%": { transform: "translateX(-4px)" },
          "30%": { transform: "translateX(8px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "task-complete": "task-complete 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;