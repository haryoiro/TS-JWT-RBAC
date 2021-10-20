import { defineConfig } from 'vite'
import * as path from "path"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': path.join(__dirname, './src/')
    }
  },
  server: {
    port: 8001,
    proxy: {
      "/auth/login": "http://localhost:8000"
    }
  }
})
