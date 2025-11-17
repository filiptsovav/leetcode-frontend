import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
      proxy: {
        "/auth": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false,
              },
         "/taskChosen": {
                         target: "http://localhost:8080",
                         changeOrigin: true,
                         secure: false
                       },
         "/taskSuggestion": {
                                  target: "http://localhost:8080",
                                  changeOrigin: true,
                                  secure: false
                                },
         "/statistics": {
                                           target: "http://localhost:8080",
                                           changeOrigin: true,
                                           secure: false
                                         },
      }
    }
})
