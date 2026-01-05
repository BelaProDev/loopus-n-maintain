import react from "@vitejs/plugin-react-swc";
import path from "path";

/** @type {import('vite').UserConfig} */
export default {
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    // Prevent duplicate React copies (fixes hooks errors like "Cannot read properties of null (reading 'useState')")
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};
