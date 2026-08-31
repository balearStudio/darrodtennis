import { BASE_PATH } from "@/lib/site";
import "./globals.css";

/**
 * Global fallback for any URL that matches no route. GitHub Pages serves the
 * emitted `404.html` for every unknown path, so this stands on its own (no
 * locale, no shared layout) and is intentionally bilingual.
 */
export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body className="bg-ink-900 text-cream">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-clay">
            404
          </p>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-[-0.03em]">
            Página no encontrada
            <span className="mt-1 block text-cream/50">Page not found</span>
          </h1>
          <p className="mt-5 text-[15px] leading-[1.6] text-cream/60">
            La página que buscas no existe o se ha movido.
            <br />
            The page you are looking for does not exist or has moved.
          </p>
          <a
            href={`${BASE_PATH}/es/`}
            className="mt-9 rounded-[2px] border border-cream/30 px-7 py-3.5 text-sm tracking-[0.02em] text-cream transition-colors hover:border-clay hover:bg-clay"
          >
            Volver al inicio · Back home
          </a>
        </main>
      </body>
    </html>
  );
}
