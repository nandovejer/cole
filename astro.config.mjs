import { defineConfig } from 'astro/config';

// Published on GitHub Pages: https://nandovejer.github.io/cole/
export default defineConfig({
  site: 'https://nandovejer.github.io',
  base: '/cole',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  devToolbar: { enabled: false },
});
