import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Probability-Of-Eventual-Success/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['motion', 'gsap', 'lenis'],
          math: ['katex', 'react-katex'],
          charts: ['recharts'],
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
        },
      },
    },
  },
})
