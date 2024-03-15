import { defineConfig } from "vite";
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
    base: "/tetris-rush/",
    root: path.resolve(__dirname, 'src'),
    resolve: {
      alias: {
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      }
    }
})