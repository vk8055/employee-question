import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Served same-origin under the IDE proxy at /__preview/ so rrweb captures the live preview
  // in the one IDE stream (no cross-origin barrier). Direct localhost:5173 still works too.
  base: '/__preview/',
  server: {
    host: "0.0.0.0",
    // Local POC: allow any host (prod uses allowedHosts: ['.<env-domain>'] for the session subdomain).
    allowedHosts: true,
    // HMR websocket is proxied through the IDE origin (8086) so it works when the app is framed
    // same-origin in the preview panel. The proxy forwards the /__preview/ ws upgrade to vite.
    hmr: { clientPort: 8080, path: '/__preview/' },
    proxy: {
      '/api': {
        // The profile injects the in-task backend origin. This makes the question portable between
        // local sidecar proof and ECS task networking without baking a session address into source.
        target: process.env.HH_BACKEND_ORIGIN || 'http://127.0.0.1:9000',
        changeOrigin: true,
      },
    },
  }
})
