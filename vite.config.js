import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/*.mp4', '**/*.MP4', '**/*.mov', '**/*.MOV'],
    },
  },
})
