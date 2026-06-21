import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

//build.format 'file' emits work.html instead of work/index.html — flat routes that
//mirror the services site and keep published URLs predictable (GitHub Pages has no redirects)
export default defineConfig({
  site: 'https://codejuan.com',
  build: {
    format: 'file',
  },
  integrations: [sitemap()],
});
