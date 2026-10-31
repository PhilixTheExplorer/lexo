# LEXO website

The product site for LEXO, served at `https://lexo.philix.dev`. A fully static Astro site,
hosted as static assets on Cloudflare Workers. English lives under `/en/`, Burmese under `/my/`.

## Stack

- Astro 7 (`output: "static"`), TypeScript strict, MDX content collections
- Tailwind CSS 4 plus a small hand-written design system in `src/styles/global.css`
- Astro's built-in i18n routing, with every page under a locale prefix
- Biome for linting and formatting
- Wrangler 4 for local preview and deploys
- pnpm only, Node 22.12 or newer (`.node-version` pins 24)

## Commands

Run everything from `site/`:

| Command | What it does |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Local dev server at `http://localhost:4321` |
| `pnpm build` | Production build into `dist/` |
| `pnpm preview` | Serve `dist/` with Wrangler at `http://localhost:8787`, exactly as Cloudflare will |
| `pnpm check` | `astro check` and Biome |
| `pnpm format` | Format with Biome |
| `pnpm og` | Render missing social cards (see below) |

The first build encodes every screenshot to AVIF and WebP, which takes a couple of minutes.
Later builds reuse `node_modules/.astro`.

## Where things live

```text
src/
  assets/screens/   real app screenshots (see assets/PROVENANCE.md)
  assets/posters/   video poster frames
  components/       design-system components (InstallTicket, ScanCompare, Workflow, ...)
  content/docs/     documentation, one MDX file per page per language
  content/blog/     articles; translations share a translationKey
  i18n/             UI strings and locale helpers
  lib/              schema.org builders, changelog parser, collection helpers
  pages/[lang]/     every localized route
public/
  media/            the three walkthrough videos (H.264)
  og/               social cards, one per page and language
  _headers          security and cache headers for Cloudflare
  _redirects        "/" → "/en/"
```

Facts come from the repository, not from copies: the version is read from
`src/lexo/__init__.py` and the changelog page is generated from `CHANGELOG.md` at build time.

## Content

- **Docs**: add `src/content/docs/<lang>/<slug>.mdx` with `title`, `description`, `lang`,
  `group` (`start`, `guides`, `reference`, `help`), `order`, and `updated`. The same slug in
  both languages links the two pages for `hreflang`.
- **Articles**: add `src/content/blog/<lang>/<slug>.mdx`. Give translations the same
  `translationKey`. An article may exist in one language only.
- Don't publish untranslated placeholder pages. If a page isn't translated, leave it out of
  that language.
- Wrap frontmatter values containing `: ` in quotes.

After adding or retitling a page, render its social card:

```bash
pnpm build
pnpm og            # only renders cards that don't exist yet
pnpm og --force    # re-render all of them
```

`pnpm og` drives a local Chrome so Burmese is shaped correctly. Set `CHROME_PATH` if Chrome
isn't in the default location. Commit the files it writes to `public/og/`.

## Hosting

The site is fully static and served from Cloudflare Workers static assets. Deploy
configuration is in `wrangler.jsonc`; maintainers handle deployment.

## Verifying a build locally

```bash
pnpm build
pnpm preview
```

Then check `/` redirects to `/en/`, `/my/docs/installation` redirects to the trailing-slash
URL, an unknown path returns 404, and `/sitemap-index.xml` and `/robots.txt` use the
production URL.
