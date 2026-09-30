// @ts-check
import { defineConfig } from 'astro/config';

// Phase 1: the existing 9-page site, rebuilt in Astro with the same look.
// See docs/planning/ASTRO-MIGRATION-CHECKPOINT.md for the reasoning.
export default defineConfig({
  // The live site today. Used by Astro for absolute URLs (e.g. canonicals later).
  site: 'https://yyogaa-website.vercel.app',

  // Plain static HTML files, no server needed (same as today).
  output: 'static',

  // Clean URLs without a trailing slash: /about (not /about/ or /about.html).
  // 'file' builds src/pages/about.astro -> dist/about.html, and Vercel's
  // cleanUrls (vercel.json) serves that file at /about.
  build: {
    format: 'file',
  },
  trailingSlash: 'never',

  // Keep the HTML whitespace exactly as written. Astro 7's default ('jsx')
  // removes line breaks between text and tags, which would glue words
  // together (e.g. "Breathe" + "easy.") and change how the pages look.
  compressHTML: false,

  // Hide Astro's floating developer toolbar so `npm run dev` looks like the real site.
  devToolbar: {
    enabled: false,
  },
});
