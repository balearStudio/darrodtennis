import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { Eyebrow } from "@/components/Eyebrow";
import { Cta } from "@/components/Cta";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = await createMetadata(locale, "gracias", "/reservar/gracias");
  return { ...meta, robots: { index: false, follow: true } };
}

export default async function GraciasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservarPage");
  const tb = await getTranslations("book");
  const steps = tb.raw("steps") as { title: string; body: string }[];

  return (
    <section className="px-side flex min-h-[70vh] flex-col justify-center bg-ink-800 py-32 text-cream">
      <div className="max-w-2xl">
        <Eyebrow>{tb("eyebrow")}</Eyebrow>
        <h1 className="text-display mt-7 text-cream">{t("graciasTitle")}</h1>
        <p className="mt-7 max-w-[48ch] text-body text-cream/70">{t("graciasBody")}</p>

        <div className="mt-12">
          <div className="text-label text-cream/45">{t("graciasStepsTitle")}</div>
          <ol className="mt-4 border-t border-cream/15">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-5 border-b border-cream/10 py-5">
                <span className="pt-0.5 font-mono text-[11px] tracking-[0.18em] text-clay">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[16px] text-cream">{step.title}</div>
                  <p className="mt-1 text-[14px] leading-[1.6] text-cream/60">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12">
          <Cta href="/" variant="secondary">
            {t("graciasCta")}
          </Cta>
        </div>
      </div>
    </section>
  );
}
