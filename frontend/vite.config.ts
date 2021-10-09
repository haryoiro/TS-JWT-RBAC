import { defineConfig } from 'vite'
import * as path from "path"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 8001 },
  resolve: {
    alias: {
      '@/': path.join(__dirname, './src/')
    }
  }
})
