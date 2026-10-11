import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'full-reload',
    handleHotUpdate({server}) {
      server.ws.send({type: "full-reload"})
      return []
    }
  }],
  server: {
    /*
    -------------------------------
    mkcert -install
    mkdir certs
    cd certs
    mkcert localhost 127.0.0.1 ::1
    # genera: localhost+2.pem  y  localhost+2-key.pem
    cd ..
    -------------------------------
    */
    https: {
      key: fs.readFileSync('certs/localhost+2-key.pem'),
      cert: fs.readFileSync('certs/localhost+2.pem')
    },
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true
      }
    }
  }
})
