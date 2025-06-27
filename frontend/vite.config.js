import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  base: '/', // 👈 Esto es clave para Vite en producción
  // Expose ChatBotPass environment variable to the client
  envPrefix: ['VITE_', 'ChatBot'],
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // Proxy API requests durante el desarrollo para evitar problemas de CORS
    proxy: {
      '/api': {
        target: 'https://warapi.onrender.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
});
