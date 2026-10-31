// Chrome's Myanmar line breaker splits inside words (တစ်|ခု, မလုပ်မ|ချင်း). The site's
// Burmese copy already separates phrases with spaces, so after the build each run of
// Myanmar text between spaces or zero-width spaces is wrapped in a nowrap span, leaving
// those as the only break points. Spans rather than U+2060 joiners keep copied text clean.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const MYANMAR_RUN = /[^\s​<>]*[က-႟ꧠ-꧿ꩠ-ꩿ][^\s​<>]*/g;
const SKIP = new Set(["script", "style", "pre", "code", "textarea", "title", "svg"]);

export function wrapMyanmarRuns(html) {
  const bodyStart = html.indexOf("<body");
  if (bodyStart < 0) return html;
  const head = html.slice(0, bodyStart);
  const parts = html.slice(bodyStart).split(/(<[^>]+>)/);
  const stack = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith("<")) {
      const m = part.match(/^<\s*(\/)?\s*([a-zA-Z0-9-]+)/);
      if (!m) continue;
      const name = m[2].toLowerCase();
      if (!SKIP.has(name) || part.endsWith("/>")) continue;
      if (m[1]) {
        const at = stack.lastIndexOf(name);
        if (at >= 0) stack.length = at;
      } else {
        stack.push(name);
      }
    } else if (stack.length === 0 && part) {
      parts[i] = part.replace(MYANMAR_RUN, '<span class="mw">$&</span>');
    }
  }
  return head + parts.join("");
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => {
      const p = join(dir, e.name);
      if (e.isDirectory()) return htmlFiles(p);
      return e.name.endsWith(".html") ? [p] : [];
    }),
  );
  return nested.flat();
}

export default function burmeseLineBreaks() {
  return {
    name: "burmese-line-breaks",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const files = await htmlFiles(fileURLToPath(dir));
        await Promise.all(
          files.map(async (file) => {
            const html = await readFile(file, "utf-8");
            const next = wrapMyanmarRuns(html);
            if (next !== html) await writeFile(file, next);
          }),
        );
        logger.info(`wrapped Myanmar word runs in ${files.length} pages`);
      },
    },
  };
}
