import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Root path for Firebase Hosting
  plugins: [
    react()
  ],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
