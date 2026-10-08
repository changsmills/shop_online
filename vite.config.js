import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        // 🔥 ONGEZA Google domains hapa
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://*.googleapis.com https://*.gstatic.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https:",
        // 🔥 ONGEZA Google domains hapa
        "connect-src 'self' http://localhost:5173 http://127.0.0.1:8000 http://localhost:8000 https://accounts.google.com https://*.googleapis.com https://*.ondigitalocean.app https://*.onrender.com ws://localhost:5173",
        // 🔥 ONGEZA frame-src — Muhimu kwa popup ya Google
        "frame-src 'self' https://accounts.google.com",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
      ].join('; '),

      'X-Frame-Options': 'SAMEORIGIN',  // 🔥 Badilisha DENY → SAMEORIGIN
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
    }
  },
})