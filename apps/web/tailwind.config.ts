import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101114",
        muted: "#667085",
        line: "#E6E8EC",
        surface: "#F7F8FA",
        accent: "#0B5C4A",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(16, 17, 20, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
