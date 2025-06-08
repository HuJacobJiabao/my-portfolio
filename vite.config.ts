import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'

// https://vite.dev/config/
export default defineConfig({
  base: '/my-portfolio/',
  plugins: [react(), yaml()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer'
    },
  },
  build: {
    rollupOptions: {
      external: ['fs', 'path']
    }
  }
})
