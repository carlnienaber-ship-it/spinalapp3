import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to remove the importmap from index.html before it's served
const removeImportmapPlugin = (): Plugin => {
  return {
    name: 'remove-importmap',
    transformIndexHtml(html) {
      // Use a regular expression to find and remove the script tag with type="importmap"
      // The 's' flag allows '.' to match newline characters
      return html.replace(/<script type="importmap">.*?<\/script>/s, '');
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    removeImportmapPlugin(),
    react()
  ],
})
