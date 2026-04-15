import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/vault-study-hub/" : "/",
  plugins: [react()],
  server: { port: 5173, open: true },
});
