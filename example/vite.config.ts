import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'example',
  plugins: [react()],
  server: { port: 5173 },
  build: {
    outDir: 'dist-example'
  },
  resolve: {
    alias: {
      // use source in dev; after build you can switch to '../dist/index.js'
      'safe-markdown-react': new URL('../src/index.tsx', import.meta.url).pathname
    }
  }
})
