import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://taras.rocks',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
