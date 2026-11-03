import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Environment variables prefixed with VITE_ are automatically exposed to
// the browser bundle. Set VITE_API_URL in .env.local to point to your
// backend. See frontend/.env.example for a template.
export default defineConfig({
  plugins: [react()],
})
