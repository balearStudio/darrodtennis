/**
 * Writes the redirect pages a static host can't express as server rules, into
 * `out/` after `next build`:
 *
 *   - `/`            → `/es/` (English browsers go to `/en/`, crawlers don't)
 *   - every URL of the old WordPress site → its page on the new site, so the
 *     links and rankings it has built up carry over after the domain moves.
 *
 * GitHub Pages can't send a 301, so each page is an instant meta refresh plus a
 * canonical to the target — Google treats that pair as a permanent redirect.
 * Targets are relative so the pages also work under the `/darrodtennis` base
 * path; the canonical is absolute.
 *
 * Old URLs come from https://www.darrodtennisacademy.com/page-sitemap.xml
 * (WordPress + WPML: Spanish at the root, English under /en/), Nov 2026.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../out");

// Same default as SITE_URL in src/lib/site.ts.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://balearstudio.github.io/darrodtennis"
).replace(/\/$/, "");

/** Old path → new path, both without the leading slash. */
const LEGACY = {
  "promocion/": "es/",
  "academia/": "es/",
  "metodologia/": "es/programas/",
  "programas/": "es/programas/",
  "contacto/": "es/contacto/",
  "aviso-legal/": "es/aviso-legal/",
  "politica-de-privacidad/": "es/privacidad/",
  "en/home/": "en/",
  "en/academy/": "en/",
  "en/methodology/": "en/programas/",
  "en/programs/": "en/programas/",
  "en/contact/": "en/contacto/",
  "en/rent-a-court/": "en/reservar/",
  "en/legal-notice/": "en/aviso-legal/",
  "en/privacy-policy/": "en/privacidad/",
};

const escape = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** `from` → `to` as a path relative to the directory `from` lives in. */
const relative = (from, to) => "../".repeat(from.split("/").filter(Boolean).length) + to;

function page({ from, to, lang, script }) {
  const rel = relative(from, to);
  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Darrod Tennis Academy</title>
    <link rel="canonical" href="${escape(`${SITE_URL}/${to}`)}" />
    <meta http-equiv="refresh" content="0; url=${escape(rel)}" />
    <style>
      html, body { margin: 0; background: #14170f; color: #f4f2ea;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
      .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
      a { color: #d06a2f; }
    </style>
    ${script ?? `<script>location.replace(${JSON.stringify(rel)} + location.hash);</script>`}
  </head>
  <body>
    <div class="wrap">
      <p><a href="${escape(rel)}">Darrod Tennis Academy</a></p>
    </div>
  </body>
</html>
`;
}

function write(from, html) {
  const dir = path.join(out, from);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), html);
}

// Root: English-language browsers get /en/. Crawlers are left on /es/ (the
// x-default), so Google reads `/` as a redirect to the Spanish homepage rather
// than to whichever language its renderer happens to report.
write(
  "",
  page({
    from: "",
    to: "es/",
    lang: "es",
    script: `<script>
      (function () {
        var bot = /bot|crawl|spider|slurp|facebookexternalhit|preview/i.test(navigator.userAgent);
        var en = (navigator.language || "es").toLowerCase().indexOf("en") === 0;
        location.replace("./" + (en && !bot ? "en" : "es") + "/" + location.search + location.hash);
      })();
    </script>`,
  }),
);

for (const [from, to] of Object.entries(LEGACY)) {
  write(from, page({ from, to, lang: to.startsWith("en") ? "en" : "es" }));
}

console.log(`static-redirects: / + ${Object.keys(LEGACY).length} legacy URLs → ${SITE_URL}`);
