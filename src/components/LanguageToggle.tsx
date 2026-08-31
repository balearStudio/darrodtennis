"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LOCALE_LABELS } from "@/lib/site";

/**
 * `ES / EN` toggle. `usePathname()` here is locale-stripped, so switching
 * language always lands on the same page in the other locale.
 */
export function LanguageToggle({
  className = "",
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = useLocale();
  const t = useTranslations("common");

  return (
    <div
      className={`flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] ${className}`}
      aria-label={t("langToggleLabel")}
    >
      {routing.locales.map((loc, i) => (
        <Fragment key={loc}>
          {i > 0 && <span className="text-cream/30">/</span>}
          {loc === active ? (
            <span className="text-cream" aria-current="true">
              {LOCALE_LABELS[loc]}
            </span>
          ) : (
            <Link
              href={pathname}
              locale={loc}
              onClick={onNavigate}
              className="text-cream/50 transition-colors hover:text-cream"
            >
              {LOCALE_LABELS[loc]}
            </Link>
          )}
        </Fragment>
      ))}
    </div>
  );
}
