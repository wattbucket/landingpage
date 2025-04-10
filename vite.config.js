// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {

  plugins: [react()],
  server: {
    allowedHosts: [
      'calculadoradeahorroenergetico.duckdns.org',
      'doctec.duckdns.org'
    ]
  },
  optimizeDeps: {
    // exclude: ['chunk-AQOSEKAY.js','chunk-WXDYHFDR.js']
    // exclude: ['chunk-AQOSEKAY.js']
  },
  // base: 'wattbucket.github.io', // Link page
  base: mode === 'production' ? '/wattbucket.github.io' : '/', // 👈 base solo en producción
  }

})