import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Relative base and hash routing: the built site works from any folder on any static host.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173 },
  preview: { port: 4173 },
});
