import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": JSON.stringify({}),
  },
  server: { port: 1334, open: true },
  build: { outDir: "public", emptyOutDir: true },
});
