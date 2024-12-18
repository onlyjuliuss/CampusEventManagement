import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://campuseventmanagement-backend.onrender.com',
        changeOrigin: true
      }
    }
  }
}); 