import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178,
    proxy: {
      
      
      '/music': {
        target: 'http://localhost:5274',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:5274',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/')) {
              return 'react-vendor';
            }
            if (id.includes('react-router-dom') || id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('@react-oauth')) {
              return 'google-oauth';
            }
          }
        },
      },
    },
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@react-oauth/google'],
  },
})
