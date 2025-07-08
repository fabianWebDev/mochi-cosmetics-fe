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
})
