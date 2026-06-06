import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { photos } from './src/data/photos.ts';

const SITE = 'https://taras.rocks';

const photoImages = photos.map((p) => ({
  url: new URL(p.src, SITE).toString(),
  caption: p.alt,
}));

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ru: 'ru' },
      },
      serialize(item) {
        if (item.url === `${SITE}/` || item.url === `${SITE}/ru/`) {
          return { ...item, img: photoImages };
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
