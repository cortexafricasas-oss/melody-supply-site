import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Servi a la racine de https://melodysupplyco.com/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: { target: 'es2022', assetsInlineLimit: 0 },
});
