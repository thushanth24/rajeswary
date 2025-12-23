import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "Poppins",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        serif: [
          "Cormorant Garamond",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(3deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(-2deg)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px hsl(38 80% 55% / 0.3), 0 0 10px hsl(38 80% 55% / 0.2)",
          },
          "50%": {
            boxShadow: "0 0 20px hsl(38 80% 55% / 0.6), 0 0 40px hsl(38 80% 55% / 0.4)",
          },
        },
        "diya-flicker": {
          "0%, 100%": { 
            opacity: "1", 
            transform: "scale(1)",
            filter: "brightness(1)"
          },
          "25%": { 
            opacity: "0.9", 
            transform: "scale(1.02)",
            filter: "brightness(1.1)"
          },
          "50%": { 
            opacity: "1", 
            transform: "scale(0.98)",
            filter: "brightness(0.95)"
          },
          "75%": { 
            opacity: "0.95", 
            transform: "scale(1.01)",
            filter: "brightness(1.05)"
          },
        },
        "rangoli-spin": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.05)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        "flower-fall": {
          "0%": { 
            transform: "translateY(-10%) translateX(0) rotate(0deg)",
            opacity: "0"
          },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { 
            transform: "translateY(100vh) translateX(100px) rotate(720deg)",
            opacity: "0"
          },
        },
        "flower-fall-reverse": {
          "0%": { 
            transform: "translateY(-10%) translateX(0) rotate(0deg)",
            opacity: "0"
          },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { 
            transform: "translateY(100vh) translateX(-100px) rotate(-720deg)",
            opacity: "0"
          },
        },
        "mandala-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "border-dance": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            opacity: "0.6",
            transform: "scale(1)"
          },
          "50%": { 
            opacity: "1",
            transform: "scale(1.1)"
          },
        },
        "swing": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "sparkle": {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "wave": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "fade-in-down": "fade-in-down 0.6s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "scale-out": "scale-out 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",
        "slide-in-up": "slide-in-up 0.5s ease-out",
        enter: "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
        exit: "fade-out 0.3s ease-out, scale-out 0.2s ease-out",
        shimmer: "shimmer 3s infinite linear",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "diya-flicker": "diya-flicker 0.8s ease-in-out infinite",
        "rangoli-spin": "rangoli-spin 20s linear infinite",
        "flower-fall": "flower-fall 8s linear infinite",
        "flower-fall-reverse": "flower-fall-reverse 10s linear infinite",
        "mandala-rotate": "mandala-rotate 30s linear infinite",
        "border-dance": "border-dance 3s ease infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "swing": "swing 2s ease-in-out infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "wave": "wave 2s ease-in-out infinite",
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
        traditional: "0 4px 20px hsl(350 70% 35% / 0.15), 0 0 0 1px hsl(38 80% 55% / 0.1)",
        "gold-glow": "0 0 20px hsl(38 80% 55% / 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
