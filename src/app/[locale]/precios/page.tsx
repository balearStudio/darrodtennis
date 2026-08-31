import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "precios", "/precios");
}

export default async function PreciosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("precios");
  const rows = t.raw("rows") as { players: string; price: string }[];
  const tc = await getTranslations("common");

  return (
    <>
      <PageHero
        tone="cream"
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("body")}
      />

      <section className="section-y px-side bg-cream text-ink-800">
        <Reveal className="max-w-2xl">
          <div className="flex items-baseline justify-between border-b border-ink-900/20 pb-3 text-label text-muted">
            <span>{t("playersHeading")}</span>
            <span>{t("priceHeading")}</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.players}
              className="flex items-baseline justify-between border-b border-ink-900/10 py-6"
            >
              <span className="text-[17px]">{row.players}</span>
              <span className="flex items-baseline gap-2">
                <span className="text-[1.75rem] tracking-[-0.02em]">{row.price}</span>
                <span className="text-sm text-muted">{tc("perHour")}</span>
              </span>
            </div>
          ))}
          <p className="mt-6 text-[14px] leading-[1.6] text-muted">{t("note")}</p>
        </Reveal>

        <Reveal className="mt-12">
          <Cta href="/reservar" variant="primary" onCream>
            {t("cta")}
          </Cta>
        </Reveal>
      </section>
    </>
  );
}
