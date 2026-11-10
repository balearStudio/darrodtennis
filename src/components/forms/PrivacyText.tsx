"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LEGAL } from "@/lib/site";

/** Opens in a new tab so a half-filled form is not lost. */
function policyLink(chunks: React.ReactNode) {
  return (
    <Link
      href="/privacidad"
      target="_blank"
      rel="noopener"
      className="underline decoration-current/40 underline-offset-2 hover:decoration-current"
    >
      {chunks}
    </Link>
  );
}

/** "I have read and accept the privacy policy", with the policy linked. */
export function PrivacyConsentText() {
  const t = useTranslations("legal");
  return <>{t.rich("consent", { link: policyLink })}</>;
}

/**
 * The short "basic information on data protection" the AEPD recommends next
 * to every form (first layer); the policy page is the second layer.
 */
export function DataProtectionNote({ tone }: { tone: "dark" | "cream" }) {
  const t = useTranslations("legal");
  return (
    <p
      className={`text-[11.5px] leading-[1.6] ${
        tone === "dark" ? "text-cream/45" : "text-muted"
      }`}
    >
      {t.rich("formNote", { name: LEGAL.name, link: policyLink })}
    </p>
  );
}
