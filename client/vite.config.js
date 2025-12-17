import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          'd3-vendor': ['d3', 'react-force-graph', 'react-force-graph-2d'],
          'animation': ['framer-motion', 'gsap', 'locomotive-scroll', 'swup'],
          'ui-vendor': ['react-icons', 'react-hot-toast', 'axios', 'socket.io-client'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['regenerator-runtime']
  },
  define: {
    'global': 'globalThis',
  }
});

