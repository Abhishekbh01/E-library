import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Alias for PDF.js worker
      'pdfjs-dist/build/pdf.worker.min.mjs': fileURLToPath(new URL('./node_modules/pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url))
    },
  },
  define: {
    'process.env': {}
  },
  server: {
    proxy: {
      '/pdfjs': {
        target: 'https://unpkg.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pdfjs/, ''),
        secure: false,
      },
    },
    cors: true,
    fs: {
      // Allow serving files from one level up from the package root
      allow: ['..']
    }
  },
  optimizeDeps: {
    // Ensure PDF.js is properly optimized
    include: ['react-pdf', 'pdfjs-dist'],
    // Force Vite to pre-bundle pdfjs-dist
    force: true,
    // Ensure worker files are properly handled
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    // Ensure the worker is properly bundled
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist']
        },
        // Ensure worker files are properly named
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})
