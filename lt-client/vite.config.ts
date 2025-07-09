import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: false, // Disable auto-opening browser in Docker environment
    host: '0.0.0.0', // Listen on all network interfaces
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      port: 3000,
      host: 'localhost',
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
