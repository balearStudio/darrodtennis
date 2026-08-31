import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates, ogBase } from "@/lib/metadata";
import { COACHES, coachBySlug, programBySlug } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";

type Props = { params: Promise<{ locale: Locale; coach: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    COACHES.map((c) => ({ locale, coach: c.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, coach } = await params;
  const found = coachBySlug(coach);
  if (!found) return {};
  const t = await getTranslations({ locale, namespace: "team.coaches" });
  const info = t.raw(coach) as { name: string; role: string };
  const path = `/equipo/${coach}`;
  return {
    title: info.name,
    description: `${info.name} — ${info.role} · Darrod Tennis Academy`,
    alternates: buildAlternates(locale, path),
    openGraph: { ...ogBase(locale, path), title: info.name, description: info.role },
  };
}

export default async function CoachPage({ params }: Props) {
  const { locale, coach } = await params;
  setRequestLocale(locale);
  const found = coachBySlug(coach);
  if (!found) notFound();

  const tteam = await getTranslations("team.coaches");
  const tpage = await getTranslations("equipoPage");
  const tprog = await getTranslations("prog");

  const info = tteam.raw(coach) as { name: string; role: string };
  const bio = tpage.raw(`bios.${coach}`) as string;
  const program = found.programSlug ? programBySlug(found.programSlug) : undefined;
  const programName = program
    ? (tprog.raw(`items.${program.key}`) as { name: string }).name
    : null;

  return (
    <section className="px-side bg-ink-800 pb-24 pt-32 text-cream md:pt-44">
      <Link
        href="/equipo"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50 transition-colors hover:text-cream"
      >
        ← {tpage("coachBackLabel")}
      </Link>

      <div className="mt-10 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal>
          <PhotoFrame
            src={found.image}
            alt={info.name}
            variant="portrait"
            className="aspect-[3/4] max-w-md"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
        </Reveal>

        <Reveal delay={60}>
          <h1 className="text-display text-cream">{info.name}</h1>
          <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/50">
            {info.role}
          </div>
          <p className="mt-8 max-w-[48ch] text-body text-cream/70">{bio}</p>

          {programName && program ? (
            <div className="mt-10 border-t border-cream/15 pt-6">
              <div className="text-label text-cream/45">
                {tpage("coachProgramLabel")}
              </div>
              <Link
                href={`/programas/${program.slug}`}
                className="mt-2 inline-block border-b border-cream/30 pb-1 text-[17px] transition-colors hover:border-clay"
              >
                {programName}
              </Link>
            </div>
          ) : null}

          <div className="mt-10">
            <Cta href="/reservar" variant="primary">
              {tpage("coachCta")}
            </Cta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
