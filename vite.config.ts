import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // لو بتبني لـ GitHub Pages، غير 'XTOOLS' لاسم الـ repo بتاعك
  base: command === 'build' ? './' : '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
}));
