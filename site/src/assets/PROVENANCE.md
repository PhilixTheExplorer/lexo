# Asset provenance

Every raster here is real product material. Nothing is generated or retouched beyond
cropping, resizing, and re-encoding.

## `screens/`

Captured with `QWidget.grab()` from the actual LEXO 0.4.1 PySide6 `MainWindow` on Windows,
at a Qt scale factor of 1.5, driven by a script rather than by hand.

- The documents shown are synthetic: pages of `README.my.md` text set in Padauk,
  printed to PDF, then rasterized with mild rotation, grain, and blur so they behave like a
  scan. No third-party or private documents appear.
- `app-ocr-running.webp`, `app-ocr-result.webp`, and `hero-after.webp` show a real Google
  Docs OCR run on those synthetic scans through the maintainer's own Google sign-in. The
  Burmese text in the right-hand pane is the unedited OCR output.
- `app-text-layer.webp` and `app-export.webp` show text-layer extraction from the
  synthetic digital PDF.
- `hero-before.webp` and `hero-after.webp` are the same crop (preview and text panes) of
  `app-scan-ready.webp` and `app-ocr-result.webp`.
- `app-proofread.webp` and `app-export-done.webp` come from the synthetic digital PDF, offline:
  a doubled vowel sign from its text layer is selected in the text pane, corrected by typing,
  then exported to Markdown through the app's own export code (only the native save dialog
  was answered by the script). `samples/export-page-1.txt` is page 1 of that exported file.
- `legacy-font-extract.webp` is a frame from walkthrough video 3 (caption included).

## `posters/`

Single frames from the three README walkthrough videos, at 93 s, 28 s, and 34 s. The videos
themselves are hosted on YouTube (IDs in `src/data/site.ts`).

## `lexo.png` and favicons

`lexo.png` is a byte-for-byte copy of `src/lexo/assets/lexo.png`. The favicons and
`apple-touch-icon.png` in `public/` are that logo trimmed and resized, unchanged otherwise.

## `public/og/`

Social cards rendered by `scripts/og.mjs` from each page's title, the logo, and
`hero-after.webp`, with fonts from the bundled `@fontsource-variable` packages.
