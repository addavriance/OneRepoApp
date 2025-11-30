import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                // svgr options
            },
        }),],
    root: '.',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/client'),
            '@@': path.resolve(__dirname, './assets')
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
})
