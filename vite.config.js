import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: ['@emotion/babel-plugin']
    }
  })],
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
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-base': ['@mui/material', '@mui/system', '@emotion/react', '@emotion/styled'],
          'mui-icons': ['@mui/icons-material'],
          'mui-pickers': ['@mui/x-date-pickers', 'date-fns', '@date-io/date-fns']
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
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@mui/system',
      '@mui/x-date-pickers',
      '@emotion/react',
      '@emotion/styled',
      'date-fns',
      '@date-io/date-fns'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
