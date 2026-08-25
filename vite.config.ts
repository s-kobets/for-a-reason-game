import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/for-a-reason-game/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
