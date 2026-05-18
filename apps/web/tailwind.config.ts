import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F9FAFB",
        surface: {
          DEFAULT: "#FFFFFF",
          raised: "#F3F4F6",
        },
        ink: {
          primary: "#0D1117",
          secondary: "#6B7280",
          disabled: "#9CA3AF",
        },
        brand: {
          action: "#0D1117",
          hover: "#1f2937",
          active: "#000000",
        },
        semantic: {
          escrow: "#1C64F2",
          escrowLight: "#EFF6FF",
          cleared: "#059669",
          clearedLight: "#ECFDF5",
          warning: "#D97706",
          warningLight: "#FEF3C7",
        },
        line: {
          DEFAULT: "#E5E7EB",
          focus: "#1C64F2",
        }
      },
      boxShadow: {
        ui: "0px 1px 3px rgba(15, 23, 42, 0.08)",
        modal: "0px 10px 25px rgba(15, 23, 42, 0.1)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-satoshi)', 'sans-serif'], // Added for Satoshi
      },
    },
  },
  plugins: [],
};

export default config;
