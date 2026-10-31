// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import burmeseLineBreaks from "./integrations/burmese-line-breaks.mjs";

const site = process.env.SITE_URL ?? "https://lexo.philix.dev";

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
  // Inlining the stylesheet saves a render-blocking round trip on every first visit.
  build: { format: "directory", inlineStylesheets: "always" },
  compressHTML: true,
  devToolbar: { enabled: false },
  // Code samples are mostly shell commands; plain ink on the platen reads better than a theme.
  markdown: { syntaxHighlight: false },
  i18n: {
    locales: ["en", "my"],
    defaultLocale: "en",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    mdx(),
    burmeseLineBreaks(),
    sitemap({
      i18n: { defaultLocale: "en", locales: { en: "en", my: "my" } },
      filter: (page) => !page.endsWith(`${site}/`) && !/\/404\/?$/.test(page),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
