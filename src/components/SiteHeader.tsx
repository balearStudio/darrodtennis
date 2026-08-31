"use client";

import { useEffect, useState } from "react";
import { Img } from "@/components/Img";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_LINKS } from "@/lib/site";
import { LanguageToggle } from "./LanguageToggle";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const solid = !isHome || scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-cream/12 bg-ink-900/95 backdrop-blur-sm"
          : "border-b border-cream/12 bg-transparent"
      }`}
    >
      <div className="px-side flex items-center justify-between gap-6 py-4 md:py-[22px]">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Darrod Tennis Academy"
        >
          <Img
            src="/darrod-logo.png"
            alt="Darrod Tennis Academy"
            width={200}
            height={112}
            priority
            style={{ filter: "invert(1) brightness(1.9)" }}
            className="h-9 w-auto md:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-sm tracking-[0.01em] text-cream/80 transition-colors hover:text-cream"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <LanguageToggle className="hidden sm:flex" />
          <Link
            href="/reservar"
            className="hidden rounded-[2px] border border-cream/30 px-5 py-3 text-[13px] tracking-[0.02em] text-cream transition-colors hover:border-clay hover:bg-clay sm:inline-block"
          >
            {t("cta")}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? tc("closeMenu") : tc("openMenu")}
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-cream transition-transform duration-300 ${
                  menuOpen ? "top-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-px w-6 bg-cream transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-cream transition-transform duration-300 ${
                  menuOpen ? "top-1/2 -rotate-45" : "top-full"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`grid overflow-hidden border-cream/12 bg-ink-900 transition-[grid-template-rows,border-width] duration-300 lg:hidden ${
          menuOpen ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr] border-t-0"
        }`}
      >
        <div className="min-h-0">
          <nav className="px-side flex flex-col gap-1 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-cream/10 py-4 text-lg text-cream/85 transition-colors hover:text-cream"
              >
                {t(link.key)}
              </Link>
            ))}
            <Link
              href="/reservar"
              onClick={() => setMenuOpen(false)}
              className="mt-5 inline-block rounded-[2px] bg-clay px-6 py-4 text-center text-sm text-cream transition-colors hover:bg-clay-hover"
            >
              {t("cta")}
            </Link>
            <LanguageToggle className="mt-6" onNavigate={() => setMenuOpen(false)} />
          </nav>
        </div>
      </div>
    </header>
  );
}
