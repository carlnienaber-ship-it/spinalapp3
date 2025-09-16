import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to remove the importmap script tag from index.html
// This is required because the development environment injects it automatically.
const removeImportmapPlugin = (): Plugin => {
  return {
    name: 'remove-importmap',
    transformIndexHtml(html) {
      // Use a regex to find and remove the script type="importmap" block
      return html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    removeImportmapPlugin(),
  ],
})
