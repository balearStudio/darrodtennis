import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "torneos", "/torneos");
}

export default async function TorneosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("torneos");
  const list = t.raw("list") as { name: string; category: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="section-y px-side bg-ink-800 text-cream">
        <Reveal>
          <ul className="border-t border-cream/15">
            {list.map((item, i) => (
              <li
                key={item.name}
                className="flex flex-col gap-1 border-b border-cream/10 py-7 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.375rem] tracking-[-0.02em]">
                    {item.name}
                  </span>
                </div>
                <span className="pl-10 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/50 sm:pl-0">
                  {item.category}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
        <p className="mt-8 max-w-[52ch] font-mono text-[11px] leading-[1.8] tracking-[0.04em] text-cream/40">
          {t("note")}
        </p>
      </section>
    </>
  );
}
