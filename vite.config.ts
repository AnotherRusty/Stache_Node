import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "components": resolve(root, "components"),
      "context": resolve(root, "context"),
      "assets": resolve(root, "assets"),
      "config": resolve(root, "config"),
      "utils": resolve(root, "utils"),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          lodash: ['lodash'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
