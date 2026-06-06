import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Frontend'den /api ile başlayan istekleri backend'e yönlendir
    // Bu sayede CORS sorunu yaşamazsın
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
