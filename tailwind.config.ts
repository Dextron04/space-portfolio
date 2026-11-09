import type { Config } from "tailwindcss"

const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        dim: "rgb(var(--dim) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
} satisfies Config

export default config
