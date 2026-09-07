import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // 1. KINGA KAMILI DHIDI YA XSS + CLICKJACKING + FORMS
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' http://localhost:5173; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none'",

      // 2. Kinga dhidi ya Clickjacking (Kuweka app kwenye iframe)
      'X-Frame-Options': 'DENY',

      // 3. Zuia MIME sniffing (Kuzuia browser kutafsiri vibaya content)
      'X-Content-Type-Options': 'nosniff',

      // 4. Kinga dhidi ya leak ya sensitive info kwenye URL
      'Referrer-Policy': 'strict-origin-when-cross-origin',

      // 5. Kinga dhidi ya Cross-Site attacks
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },
})