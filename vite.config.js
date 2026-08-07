import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` matches the GitHub Pages URL: <username>.github.io/sacred-literature-map/
export default defineConfig({
  plugins: [react()],
  base: '/sacred-literature-map/',
})
