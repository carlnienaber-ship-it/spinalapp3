import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * A custom Vite plugin to remove the importmap script from index.html.
 * This is a workaround to address the issue where an importmap is present
 * in the source HTML, which is not needed for a Vite-based build.
 */
function removeImportmapPlugin(): Plugin {
  return {
    name: 'remove-importmap',
    // This hook transforms the index.html file before it's served or built.
    transformIndexHtml(html) {
      // Use a regular expression to find and remove the entire importmap script block.
      // [\s\S]*? matches any character including newlines in a non-greedy way.
      const importmapRegex = /<script type="importmap">[\s\S]*?<\/script>/;
      return html.replace(importmapRegex, '');
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    removeImportmapPlugin(), // Add the custom plugin to the build pipeline
  ],
})
