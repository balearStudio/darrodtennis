import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates, ogBase } from "@/lib/metadata";
import { PROGRAMS, programBySlug, COACHES } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PROGRAMS.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const program = programBySlug(slug);
  if (!program) return {};
  const t = await getTranslations({ locale, namespace: "prog" });
  const item = t.raw(`items.${program.key}`) as { name: string; summary: string };
  const path = `/programas/${slug}`;
  return {
    title: item.name,
    description: item.summary,
    alternates: buildAlternates(locale, path),
    openGraph: { ...ogBase(locale, path), title: item.name, description: item.summary },
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const program = programBySlug(slug);
  if (!program) notFound();

  const tp = await getTranslations("prog");
  const t = await getTranslations("programasPage");
  const tteam = await getTranslations("team.coaches");

  const card = tp.raw(`items.${program.key}`) as {
    tag: string;
    name: string;
    summary: string;
  };
  const detail = t.raw(`items.${program.key}`) as {
    format: string;
    intro: string;
    works: string[];
  };

  const coaches = COACHES.filter((c) => c.programSlug === program.slug);

  return (
    <>
      <section className="px-side bg-ink-800 pb-16 pt-32 text-cream md:pb-20 md:pt-44">
        <Link
          href="/programas"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50 transition-colors hover:text-cream"
        >
          ← {t("detailBack")}
        </Link>
        <div className="mt-8">
          <Eyebrow>{card.tag}</Eyebrow>
        </div>
        <h1 className="text-display mt-7 max-w-[16ch] text-cream">{card.name}</h1>
        <p className="mt-8 max-w-[54ch] text-body text-cream/70">{detail.intro}</p>
      </section>

      <section className="px-side bg-ink-800 pb-20">
        <PhotoFrame
          src={program.image}
          alt={card.name}
          className="aspect-[16/9] w-full"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
      </section>

      <section className="section-y px-side bg-cream text-ink-800">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <Reveal>
            <div className="text-label text-muted">{t("formatLabel")}</div>
            <p className="mt-3 text-[17px] leading-[1.5]">{detail.format}</p>
          </Reveal>
          <Reveal delay={60}>
            <div className="text-label text-muted">{t("worksOnLabel")}</div>
            <ul className="mt-4 border-t border-ink-900/15">
              {detail.works.map((w) => (
                <li
                  key={w}
                  className="border-b border-ink-900/10 py-4 text-[16px] leading-[1.5] text-slate"
                >
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {coaches.length > 0 ? (
          <Reveal className="mt-16 flex flex-wrap gap-x-8 gap-y-3">
            <span className="text-label text-muted">{t("coachesLabel")}</span>
            {coaches.map((c) => {
              const info = tteam.raw(c.slug) as { name: string };
              return (
                <Link
                  key={c.slug}
                  href={`/equipo/${c.slug}`}
                  className="border-b border-ink-900/30 pb-1 text-[15px] transition-colors hover:border-clay"
                >
                  {info.name}
                </Link>
              );
            })}
          </Reveal>
        ) : null}

        <Reveal className="mt-14">
          <Cta href="/reservar" variant="primary">
            {t("cta")}
          </Cta>
        </Reveal>
      </section>
    </>
  );
}
