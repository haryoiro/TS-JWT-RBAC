import { defineConfig } from 'vite'
import * as path from "path"
import react from '@vitejs/plugin-react'
import sassDts from 'vite-plugin-sass-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sassDts({
      allGenerate: true,
      global: {
        generate: true,
        outFile: path.resolve(__dirname, "./src/style.d.ts"),
      },
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/styles" as common;`,
        importer() {
          return {
            file: `${path.resolve(
              __dirname,
              "./src/assets/styles"
            )}`,
          };
        },
      },
    },
  },
  resolve: {
    alias: {
      '@/': path.join(__dirname, './src/'),
    }
  },
  server: {
    port: 8001,
    proxy: {
      "/auth/login": "http://localhost:8000",
      "/auth/signup": "http://localhost:8000",
      "/auth/logout": "http://localhost:8000",
      "/user": "http://localhost:8000"
    }
  }
})
