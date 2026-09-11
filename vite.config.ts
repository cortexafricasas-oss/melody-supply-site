import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Servi sous https://<compte>.github.io/melody-supply-site/
export default defineConfig({
  base: '/melody-supply-site/',
  plugins: [react()],
  build: { target: 'es2022', assetsInlineLimit: 0 },
});
