import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { aiProxyPlugin } from './vite-plugin-ai-proxy'

export default defineConfig({
  base: './',
  plugins: [react(), aiProxyPlugin()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
