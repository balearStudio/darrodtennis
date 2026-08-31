import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { HOTEL_PARTNERS } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/Eyebrow";
import { PartnerWall } from "@/components/PartnerWall";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "hoteles", "/hoteles");
}

export default async function HotelesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hoteles");
  const steps = t.raw("steps") as { title: string; body: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("body")} />

      <section className="section-y px-side bg-ink-800 text-cream">
        <Reveal>
          <Eyebrow>{t("stepsTitle")}</Eyebrow>
        </Reveal>
        <Reveal className="mt-10 grid gap-px bg-cream/15 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="bg-ink-800 p-8">
              <span className="font-mono text-[11px] tracking-[0.18em] text-clay">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3 mt-4 text-cream">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-cream/65">
                {step.body}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="section-y px-side bg-cream text-ink-800">
        <Reveal>
          <PartnerWall
            label={t("partnersLabel")}
            partners={HOTEL_PARTNERS}
            variant="color"
          />
        </Reveal>

        <Reveal className="mt-16 border-t border-ink-900/15 pt-14">
          <h2 className="text-h2 max-w-[18ch]">{t("formTitle")}</h2>
          <div className="mt-10">
            <EnquiryForm tone="cream" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
