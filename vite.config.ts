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
  optimizeDeps: {
    include: ['gray-matter']
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
})
