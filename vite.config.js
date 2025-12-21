import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//const API = "http://100.91.250.56:8080";
const API = "http://localhost:8080";
console.log("CONFIG LOADED");
export default defineConfig({
  plugins: [react()],
  server: {
      proxy: {
        "/auth": {
                target: API,
                changeOrigin: true,
                secure: false,
              },
         "/taskChosen": {
                         target: API,
                         changeOrigin: true,
                         secure: false
                       },
         "/taskSuggestion": {
                                  target: API,
                                  changeOrigin: true,
                                  secure: false
                                },
         "/statistics": {
                                           target: API,
                                           changeOrigin: true,
                                           secure: false
                                         },
         "/dashboard": {
                                                    target: API,
                                                    changeOrigin: true,
                                                    secure: false
                                                  },

          // --- НОВОЕ ПРАВИЛО ДЛЯ ПОИСКА ---
        "/api": {
            target: API,
            changeOrigin: true,
            secure: false
        },

        // --- НОВОЕ ПРАВИЛО ДЛЯ ЧАТА (WebSocket) ---
        "/ws": {
            target: API,
            ws: true, // Важно для работы сокетов
            changeOrigin: true,
            secure: false
        }
      }
    }
})
