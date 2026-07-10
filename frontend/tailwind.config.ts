import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "page-in": {
          "0%": { opacity: "0", transform: "translateX(28px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bob: {
          "0%,100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        strum: {
          "0%,100%": { transform: "rotate(-20deg)" },
          "50%": { transform: "rotate(14deg)" },
        },
        "note-float": {
          "0%": { opacity: "0", transform: "translate(0,0) scale(0.6)" },
          "30%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translate(14px,-46px) scale(1)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        "page-in": "page-in 0.4s cubic-bezier(0.16,1,0.3,1)",
        bob: "bob 0.6s ease-in-out infinite",
        strum: "strum 0.26s ease-in-out infinite",
        "note-float": "note-float 1.1s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
