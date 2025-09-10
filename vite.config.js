import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      services: path.resolve(__dirname, './src/services'),
    },
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100, // milisegundos entre cada chequeo
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          forms: ['react-hook-form', '@hookform/resolvers', 'yup'],
        },
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
})
