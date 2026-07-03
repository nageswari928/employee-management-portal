import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

const htmlFallbackPlugin = () => ({
  name: 'html-fallback',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url) {
        const urlPath = req.url.split('?')[0];
        if (urlPath.endsWith('.html') && urlPath !== '/index.html') {
          req.url = '/index.html' + (req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
        }
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [
    react(), 
    htmlFallbackPlugin(),
    process.env.VITE_COVERAGE === 'true' && istanbul({
      include: 'src/*',
      exclude: ['node_modules'],
      extension: ['.js', '.jsx', '.ts', '.tsx'],
      requireEnv: false,
      forceBuildInstrument: true,
    })
  ].filter(Boolean),
  server: {
    port: 8000,
  },
  build: {
    sourcemap: process.env.VITE_COVERAGE === 'true',
  }
});
