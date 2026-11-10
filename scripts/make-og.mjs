/**
 * Regenerates the Open Graph social cards in `public/images/og-{es,en}.jpg`.
 *
 * They are 1200x630 JPEGs (~100 KB — small enough that WhatsApp renders the
 * preview) built by drawing the site's own type over `public/images/club-courts.jpg`
 * in headless Chrome. The headline copy comes straight from `messages/*.json`
 * (`hero.titleLine1` + `hero.titleAccent`), so re-run this after changing the
 * hero wording, the eyebrow, or the photo:
 *
 *   npm i -D playwright        # not a project dependency; install when needed
 *   node scripts/make-og.mjs
 *
 * Uses the locally installed Chrome (`channel: "chrome"`) so no browser
 * download is required. The cards are committed, so this only runs by hand.
 */
import { chromium } from "playwright";
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const photo =
  "data:image/jpeg;base64," +
  readFileSync(path.join(repo, "public/images/club-courts.jpg")).toString("base64");

const messages = Object.fromEntries(
  ["es", "en"].map((l) => [
    l,
    JSON.parse(readFileSync(path.join(repo, `src/messages/${l}.json`), "utf8")),
  ]),
);

const card = (locale) => {
  const m = messages[locale];
  const tagline = `${m.hero.titleLine1} ${m.hero.titleAccent}`;
  return `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500&family=IBM+Plex+Mono:wght@400&display=block" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;background:#14170f;
       font-family:"Schibsted Grotesk",system-ui,sans-serif;color:#f4f2ea}
  .card{position:relative;width:1200px;height:630px}
  .photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  /* Two scrims: one lifts the whole frame off the busy court, one darkens the
     bottom-left where the type sits. The top right stays readable as a photo. */
  .veil{position:absolute;inset:0;
        background:
          linear-gradient(to top,rgba(20,23,15,.97) 0%,rgba(20,23,15,.90) 26%,rgba(20,23,15,.58) 52%,rgba(20,23,15,.34) 100%),
          linear-gradient(to right,rgba(20,23,15,.80) 0%,rgba(20,23,15,.30) 58%,rgba(20,23,15,.12) 100%)}
  .body{position:absolute;left:72px;right:72px;bottom:62px}
  .eyebrow{font-family:"IBM Plex Mono",monospace;font-size:19px;letter-spacing:.20em;
           text-transform:uppercase;color:#d06a2f;display:flex;align-items:center;gap:14px}
  .dot{width:9px;height:9px;border-radius:50%;background:#d06a2f;flex:0 0 auto}
  h1{font-size:76px;line-height:1.02;letter-spacing:-.028em;font-weight:400;margin-top:22px}
  .rule{width:96px;height:2px;background:#d06a2f;margin:30px 0 20px}
  p{font-size:26px;line-height:1.42;color:rgba(244,242,234,.76);max-width:30ch}
</style></head>
<body><div class="card">
  <img class="photo" src="${photo}">
  <div class="veil"></div>
  <div class="body">
    <div class="eyebrow"><span class="dot"></span>${m.hero.eyebrow}</div>
    <h1>Darrod Tennis Academy</h1>
    <div class="rule"></div>
    <p>${tagline}</p>
  </div>
</div></body></html>`;
};

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

for (const locale of ["es", "en"]) {
  const out = path.join(repo, `public/images/og-${locale}.jpg`);
  await page.setContent(card(locale), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: out, type: "jpeg", quality: 82 });
  console.log(`og-${locale}.jpg ·`, (statSync(out).size / 1024).toFixed(0), "KB");
}

await browser.close();
