import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/freeserp-api': {
        target: 'https://freeserp.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/freeserp-api/, '/api.php'),
      },
    },
  },
});
