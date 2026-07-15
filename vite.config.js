import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built site works from any sub-path
// (GitHub Pages project sites, Netlify, Firebase Hosting, a local file open).
export default defineConfig({
  base: './',
  plugins: [react()],
});
