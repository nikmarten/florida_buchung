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
      output: {
        manualChunks: {
          'mui-core': ['@mui/material', '@mui/system'],
          'mui-icons': ['@mui/icons-material'],
          'mui-pickers': ['@mui/x-date-pickers'],
          'mui-deps': ['@emotion/react', '@emotion/styled'],
          'date-utils': ['date-fns', '@date-io/date-fns'],
          'react-core': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@mui/system': '@mui/system/esm'
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
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
