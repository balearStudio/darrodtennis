import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// On GitHub Pages this is a *project* site served from
// https://balearstudio.github.io/darrodtennis/ — every asset therefore needs
// the `/darrodtennis` prefix. The deploy workflow injects this from
// `actions/configure-pages` (`steps.pages.outputs.base_path`); locally it is
// empty so the site runs at http://localhost:3000/.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  // Each route becomes `route/index.html` — the layout GitHub Pages serves best.
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    // No optimization server on GitHub Pages — images are served as authored.
    // `next/image` does not prefix `basePath` onto an unoptimized src, so all
    // image usage goes through <Img> (src/components/Img.tsx), which does.
    unoptimized: true,
  },
  // Static export never runs ESLint during `next build`, but keep type safety on.
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);
