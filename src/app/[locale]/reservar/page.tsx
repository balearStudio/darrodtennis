import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { BookingMock } from "@/components/booking/BookingMock";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "reservar", "/reservar");
}

export default async function ReservarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("reservarPage");
  const tb = await getTranslations("book");
  const steps = tb.raw("steps") as { title: string; body: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="section-y px-side bg-ink-800">
        <Reveal>
          <ol className="grid gap-px border border-cream/15 bg-cream/15 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="bg-ink-800 p-7">
                <span className="font-mono text-[11px] tracking-[0.18em] text-clay">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-3 text-[17px] text-cream">{step.title}</div>
                <p className="mt-1.5 text-[14.5px] leading-[1.6] text-cream/60">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={80} className="mx-auto mt-12 max-w-3xl">
          <BookingMock compact />
        </Reveal>
      </section>
    </>
  );
}
