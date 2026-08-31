import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { PROGRAMS } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { ProgramCard } from "@/components/ProgramCard";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "programas", "/programas");
}

export default async function ProgramasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("programasPage");
  const tp = await getTranslations("prog");
  const tphil = await getTranslations("phil");
  const classTypes = tp.raw("classTypes") as string[];
  const principles = tphil.raw("principles") as { title: string; body: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="section-y px-side bg-ink-800">
        <Reveal className="grid gap-px bg-cream/15 md:grid-cols-3">
          {PROGRAMS.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center gap-2.5">
          <span className="mr-3 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">
            {tp("classTypesLabel")}
          </span>
          {classTypes.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-cream/20 px-4 py-2 text-[13px] text-cream/85"
            >
              {chip}
            </span>
          ))}
        </Reveal>
      </section>

      <section className="section-y px-side bg-cream text-ink-800">
        <Reveal>
          <Eyebrow tone="cream">{tphil("eyebrow")}</Eyebrow>
          <h2 className="text-h2 mt-8 max-w-[22ch]">{t("methodologyTitle")}</h2>
        </Reveal>
        <Reveal className="mt-10 grid gap-px border border-ink-900/15 bg-ink-900/15 sm:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} className="bg-cream p-8">
              <h3 className="text-[1.1875rem] tracking-[-0.01em]">{p.title}</h3>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-muted">{p.body}</p>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-12">
          <Cta href="/reservar" variant="primary">
            {t("cta")}
          </Cta>
        </Reveal>
      </section>
    </>
  );
}
