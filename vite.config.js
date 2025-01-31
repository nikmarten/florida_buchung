import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  envDir: './', // Explizit das Verzeichnis für Env-Dateien angeben
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: ['@mui/system'],
      output: {
        manualChunks: {
          'mui': ['@mui/material', '@mui/icons-material', '@mui/system', '@mui/x-date-pickers'],
          'vendor': ['react', 'react-dom', 'date-fns']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'date-fns',
      '@date-io/date-fns',
      '@mui/material',
      '@mui/icons-material',
      '@mui/system',
      '@mui/x-date-pickers',
      '@emotion/react',
      '@emotion/styled'
    ]
  }
})
