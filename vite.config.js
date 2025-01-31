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
    target: 'es2015',
    minify: 'terser',
    cssCodeSplit: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
      requireReturnsDefault: 'auto'
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'react-redux'],
          'mui': [
            '@mui/material',
            '@mui/system',
            '@mui/icons-material',
            '@mui/x-date-pickers',
            '@emotion/react',
            '@emotion/styled'
          ]
        }
      }
    }
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@mui/system': '@mui/system/esm'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      '@mui/material',
      '@mui/icons-material',
      '@mui/system',
      '@mui/x-date-pickers',
      '@emotion/react',
      '@emotion/styled',
      'date-fns'
    ],
    esbuildOptions: {
      target: 'es2015',
      supported: {
        'top-level-await': true
      },
      jsx: 'automatic'
    }
  }
})
