import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'vendor_mui';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor_charts';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    server: {
      deps: {
        inline: [/@mui/, /react-transition-group/]
      }
    }
  },
})
