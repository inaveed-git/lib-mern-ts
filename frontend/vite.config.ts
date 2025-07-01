
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  build: {
    outDir: 'dist',
    // Add this to ensure public files are copied
    assetsDir: '.',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  // Ensure public directory is recognized
  publicDir: 'public'
});