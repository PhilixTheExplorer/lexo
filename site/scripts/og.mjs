// Renders a 1200x630 social card for every built page that references /og/….png.
// Runs against dist/ after `pnpm build`, writes into public/og/ (committed) and dist/og/.
// Cards are rendered by a local Chrome so Myanmar text is shaped correctly; set
// CHROME_PATH if Chrome isn't in the default location.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const force = process.argv.includes("--force");

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const executablePath = chromeCandidates.find((p) => existsSync(p));
if (!executablePath) throw new Error("Chrome not found. Set CHROME_PATH.");

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

const decode = (s) =>
  s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const jobs = new Map();
for (const file of walk(dist)) {
  const html = readFileSync(file, "utf-8");
  const image = html.match(/<meta property="og:image" content="[^"]*?(\/og\/[^"]+\.png)"/)?.[1];
  const title = html.match(/<meta property="og:title" content="([^"]*)"/)?.[1];
  const lang = html.match(/<html lang="([^"]+)"/)?.[1] ?? "en";
  if (image && title && !jobs.has(image)) jobs.set(image, { title: decode(title), lang });
}
for (const lang of ["en", "my"]) {
  jobs.set(`/og/${lang}/default.png`, {
    lang,
    title: lang === "my" ? "မြန်မာစာ ဦးစားပေး Desktop OCR" : "Burmese-first desktop OCR",
  });
}

const font = (rel) => pathToFileURL(join(root, "node_modules", rel)).href;
const shot = pathToFileURL(join(root, "src/assets/screens/hero-after.webp")).href;
const logo = pathToFileURL(join(root, "src/assets/lexo.png")).href;

const card = ({
  title,
  lang,
}) => `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
@font-face{font-family:A;src:url(${font("@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2")});font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:M;src:url(${font("@fontsource/padauk/files/padauk-myanmar-700-normal.woff2")});font-weight:700}
@font-face{font-family:Mono;src:url(${font("@fontsource-variable/martian-mono/files/martian-mono-latin-standard-normal.woff2")});font-weight:100 900;font-stretch:75% 112.5%}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#f6f7f9;color:#141519;font-family:A,M,sans-serif;display:grid;grid-template-columns:600px 600px;overflow:hidden}
.l{padding:64px 0 56px 72px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:14px;font-size:34px;font-weight:800;font-stretch:118%;letter-spacing:.01em}
.brand img{width:52px;height:52px}
h1{margin-top:auto;flex-shrink:0;font-size:${lang === "my" ? 46 : 58}px;line-height:${lang === "my" ? 1.6 : 1.02};font-weight:${lang === "my" ? 700 : 790};font-stretch:110%;letter-spacing:${lang === "my" ? 0 : "-.03em"};text-wrap:balance;padding-block:${lang === "my" ? ".2em .3em" : ".1em"};overflow:visible}
.f{margin-top:28px;font-family:Mono,M,sans-serif;font-stretch:87%;font-size:17px;letter-spacing:${lang === "my" ? 0 : ".04em"};text-transform:uppercase;color:#5c6069}
.r{position:relative;background:#e6e9ed;margin:40px 40px 40px 0;border-radius:6px;overflow:hidden}
.r img{position:absolute;left:36px;top:36px;width:640px;border-radius:4px;box-shadow:0 0 0 1px rgba(0,0,0,.3),0 18px 40px -12px rgba(21,20,15,.35)}
.lamp{position:absolute;left:0;right:0;top:58%;height:4px;background:#ef8a1f;box-shadow:0 0 0 1px rgba(239,138,31,.35),0 0 26px 6px rgba(239,138,31,.4)}
.m{position:absolute;width:18px;height:18px;border-color:#5c6069;border-style:solid;opacity:.7}
</style></head><body>
<div class="l"><div class="brand"><img src="${logo}" alt="">LEXO</div><h1>${title.replace(/</g, "&lt;").replace(/[^\s<>]*[က-႟][^\s<>]*/g, '<span style="white-space:nowrap">$&</span>')}</h1><p class="f">lexo.philix.dev · ${lang === "my" ? "အခမဲ့၊ Open Source" : "Free &amp; open source"}</p></div>
<div class="r"><img src="${shot}" alt=""><div class="lamp"></div>
<div class="m" style="left:10px;top:10px;border-width:2px 0 0 2px"></div><div class="m" style="right:10px;top:10px;border-width:2px 2px 0 0"></div>
<div class="m" style="left:10px;bottom:10px;border-width:0 0 2px 2px"></div><div class="m" style="right:10px;bottom:10px;border-width:0 2px 2px 0"></div></div>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--allow-file-access-from-files"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
const tmp = join(root, "node_modules/.og-card.html");
let made = 0;
for (const [image, job] of jobs) {
  const outPublic = join(root, "public", image);
  if (existsSync(outPublic) && !force) continue;
  writeFileSync(tmp, card(job));
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  // Fit the complete title instead of clipping Myanmar marks or longer headings.
  const titleFits = await page.evaluate(() => {
    const heading = document.querySelector("h1");
    const column = document.querySelector(".l");
    const brand = document.querySelector(".brand");
    const footer = document.querySelector(".f");
    const styles = getComputedStyle(column);
    const available =
      column.clientHeight -
      Number.parseFloat(styles.paddingTop) -
      Number.parseFloat(styles.paddingBottom) -
      brand.offsetHeight -
      footer.offsetHeight -
      52;
    const fits = () =>
      heading.offsetHeight <= available && heading.scrollWidth <= heading.clientWidth;
    let size = Number.parseFloat(getComputedStyle(heading).fontSize);
    while (!fits() && size > 18) heading.style.fontSize = `${--size}px`;
    return fits();
  });
  if (!titleFits) throw new Error(`Social card title does not fit: ${job.title}`);
  const raw = await page.screenshot({ type: "png" });
  const png = await sharp(raw).png({ palette: true, quality: 90, effort: 10 }).toBuffer();
  for (const out of [outPublic, join(dist, image)]) {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, png);
  }
  made++;
}
await browser.close();
console.log(`og: ${made} card(s) rendered, ${jobs.size - made} already present`);
