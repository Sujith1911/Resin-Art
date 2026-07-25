import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          forest: "#1E3A2B",
          emerald: "#0F5257",
          olive: "#2D3A20",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          ivory: "#FFFFF0",
          cream: "#FFFDD0",
          pearl: "#F8F9FA",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          rosegold: "#B76E79",
          gold: "#D4AF37",
          silver: "#C0C0C0",
          platinum: "#E5E4E2",
          champagne: "#F7E7CE",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          ruby: "#9B111E",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        obsidian: "#0B1512",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(30, 58, 43, 0.12)",
        "glass-hover": "0 16px 48px 0 rgba(30, 58, 43, 0.18), 0 0 20px rgba(212, 175, 55, 0.1)",
        luxury: "0 20px 50px rgba(15, 82, 87, 0.15)",
        "luxury-deep": "0 25px 60px rgba(15, 82, 87, 0.2), 0 0 30px rgba(212, 175, 55, 0.08)",
        "gold-glow": "0 0 25px rgba(212, 175, 55, 0.3), 0 0 50px rgba(212, 175, 55, 0.1)",
        "silver-glow": "0 0 25px rgba(192, 192, 192, 0.3), 0 0 50px rgba(192, 192, 192, 0.1)",
        "platinum-glow": "0 0 25px rgba(229, 228, 226, 0.4), 0 0 50px rgba(229, 228, 226, 0.15)",
        "rosegold-glow": "0 0 25px rgba(183, 110, 121, 0.3), 0 0 50px rgba(183, 110, 121, 0.1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "float-particle": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(3deg)" },
          "66%": { transform: "translateY(-8px) rotate(-2deg)" },
        },
        "sparkle-drift": {
          "0%": { transform: "translateY(100vh) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "0.8" },
          "100%": { transform: "translateY(-10vh) scale(1)", opacity: "0" },
        },
        "gold-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(212, 175, 55, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" },
        },
        "slide-up-fade": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
        float: "float-particle 6s ease-in-out infinite",
        "sparkle-drift": "sparkle-drift 8s linear infinite",
        "gold-pulse": "gold-pulse 3s ease-in-out infinite",
        "slide-up": "slide-up-fade 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
