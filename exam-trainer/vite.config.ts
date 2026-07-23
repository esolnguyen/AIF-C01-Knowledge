import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base '' → works whether opened from a subpath (GitHub Pages) or the root.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // /api/* → rag-service backend. Avoids CORS and keeps the Azure key out of the browser.
    proxy: {
      '/api': {
        target: 'http://localhost:8009',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
});
