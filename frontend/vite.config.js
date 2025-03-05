import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
    server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // 您的后端 API 地址
        changeOrigin: true,
        secure: false,
      }
    }
  }
});