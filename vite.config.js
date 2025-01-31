import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Add better error overlay
    jsxRuntime: 'automatic',
    fastRefresh: true,
    include: '**/*.{jsx,tsx,js,ts}',
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
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  build: {
    target: 'es2015',
    minify: false, // Disable minification for better debugging
    sourcemap: 'inline',
    cssCodeSplit: false,
    commonjsOptions: {
      include: [
        /node_modules/,
        /date-fns/,
        /date-fns\/.*/
      ],
      transformMixedEsModules: true,
      requireReturnsDefault: 'auto',
      defaultIsModuleExports: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'redux': ['react-redux', '@reduxjs/toolkit'],
          'mui': [
            '@mui/material',
            '@mui/system',
            '@mui/icons-material',
            '@mui/x-date-pickers',
            '@emotion/react',
            '@emotion/styled'
          ],
          'date-fns': ['date-fns']
        },
        inlineDynamicImports: false
      }
    }
  },
  resolve: {
    mainFields: ['browser', 'module', 'main', 'jsnext:main'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@mui/system': '@mui/system/esm',
      'date-fns': 'date-fns/esm'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      '@reduxjs/toolkit',
      '@mui/material',
      '@mui/icons-material',
      '@mui/system',
      '@mui/x-date-pickers',
      '@emotion/react',
      '@emotion/styled',
      'date-fns',
      'date-fns/locale'
    ],
    esbuildOptions: {
      target: 'es2015',
      supported: {
        'top-level-await': true
      },
      jsx: 'automatic',
      platform: 'browser',
      keepNames: true,
      sourcemap: true,
      sourcesContent: true
    }
  }
})
