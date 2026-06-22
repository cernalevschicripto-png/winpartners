import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'dashboard': ['./src/pages/Dashboard.jsx'],
          'admin': ['./src/pages/Admin.jsx', './src/pages/AdminMobile.jsx'],
          'landing': ['./src/pages/Landing.jsx'],
          'pages': [
            './src/pages/About.jsx',
            './src/pages/FAQ.jsx',
            './src/pages/Benefits.jsx',
            './src/pages/Instructions.jsx',
            './src/pages/Contact.jsx',
            './src/pages/Terms.jsx',
          ],
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
})
