import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E5984",
        secondary: "#FF5733",
        accent: "#FFC300",
        background: {
          DEFAULT: "rgb(255 255 255 / var(--tw-bg-opacity))",
        },
        foreground: {
          DEFAULT: "rgb(0 0 0 / var(--tw-text-opacity))",
        },
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
} satisfies Config;
