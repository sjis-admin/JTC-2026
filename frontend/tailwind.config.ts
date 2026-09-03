import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020B1E", // Deep Midnight Navy
        surface: {
          DEFAULT: "#061533", // Royal Navy
          elevated: "#0B1F47", // Elevated Navy Glass
          border: "#17315E", // Navy Steel Border
          highlight: "#1E3E75",
        },
        gold: {
          DEFAULT: "#F5B700", // Vibrant Imperial Gold
          rich: "#D4AF37", // Metallic Gold
          light: "#FFE58F", // Champagne Gold
          soft: "#FFF3CC", // Pale Gold
          dark: "#B38600",
          glow: "rgba(245, 183, 0, 0.4)",
        },
        sjis: {
          navy: "#00183F",
          deep: "#010816",
          royal: "#002868",
          blue: "#0052CC",
          gold: "#F2A900",
          red: "#C8102E",
        },
        jtc: {
          gold: "#F5B700",
          amber: "#F59E0B",
          cyan: "#38BDF8",
          teal: "#2DD4BF",
          purple: "#A855F7",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow-gold': 'radial-gradient(circle at 50% 25%, rgba(245, 183, 0, 0.18), transparent 70%)',
        'hero-glow-navy': 'radial-gradient(circle at 50% 50%, rgba(0, 40, 104, 0.6), transparent 80%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gold-glow': 'goldGlow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        goldGlow: {
          '0%': { boxShadow: '0 0 15px rgba(245, 183, 0, 0.25)' },
          '100%': { boxShadow: '0 0 35px rgba(245, 183, 0, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
