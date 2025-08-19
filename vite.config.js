import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // Build configuration for library
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'CardGameDesignSystem',
      fileName: (format) => `card-game-design-system.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  
  // CSS handling
  css: {
    postcss: './postcss.config.js'
  },
  
  // Development server
  server: {
    port: 3000,
    host: true
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  // Optimizations
  optimizeDeps: {
    include: ['vue']
  }
})