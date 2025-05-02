import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sports-insights-dashboard/', // MUST match your GitHub repo name
})
