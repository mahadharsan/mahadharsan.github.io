import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        success: resolve(__dirname, 'success.html'),
        blog: resolve(__dirname, 'blog.html'),
        publications: resolve(__dirname, 'publications.html'),
        podcast: resolve(__dirname, 'podcast.html'),
        'business-models': resolve(__dirname, 'business-models.html'),
        'business-models/manufacturing': resolve(__dirname, 'business-models/manufacturing.html'),
      },
    },
  },
});
