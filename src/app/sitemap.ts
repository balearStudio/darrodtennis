import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/metadata";
import { PROGRAMS, COACHES } from "@/lib/content";

const PATHS = [
  "/",
  "/programas",
  "/equipo",
  "/reservar",
  "/torneos",
  "/hoteles",
  "/precios",
  "/contacto",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
  ...PROGRAMS.map((p) => `/programas/${p.slug}`),
  ...COACHES.map((c) => `/equipo/${c.slug}`),
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, localizedUrl(l, path)]),
        ),
      },
    })),
  );
}
