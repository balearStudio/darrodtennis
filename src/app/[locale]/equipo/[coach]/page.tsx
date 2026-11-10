import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { COACHES, coachBySlug } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/Reveal";
import { Cta } from "@/components/Cta";
import { JsonLd } from "@/components/JsonLd";

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
  const tteam = await getTranslations({ locale, namespace: "team.coaches" });
  const tpage = await getTranslations({ locale, namespace: "equipoPage" });
  const tmeta = await getTranslations({ locale, namespace: "meta" });
  const info = tteam.raw(coach) as { name: string; role: string };
  const bio = tpage.raw(`bios.${coach}`) as string;
  return pageMetadata(
    locale,
    `/equipo/${coach}`,
    `${info.name} — ${info.role}`,
    `${bio} ${tmeta("coachSuffix")}`,
  );
}

export default async function CoachPage({ params }: Props) {
  const { locale, coach } = await params;
  setRequestLocale(locale);
  const found = coachBySlug(coach);
  if (!found) notFound();

  const tteam = await getTranslations("team.coaches");
  const tpage = await getTranslations("equipoPage");
  const tnav = await getTranslations("nav");
  const tmeta = await getTranslations("meta");

  const info = tteam.raw(coach) as { name: string; role: string };
  const bio = tpage.raw(`bios.${coach}`) as string;

  return (
    <section className="px-side bg-ink-800 pb-24 pt-32 text-cream md:pt-44">
      <JsonLd
        data={personSchema(locale, {
          slug: coach,
          name: info.name,
          role: info.role,
          bio,
          image: found.image,
        })}
      />
      <JsonLd
        data={breadcrumbSchema(locale, tmeta("breadcrumbHome"), [
          { name: tnav("team"), path: "/equipo" },
          { name: info.name, path: `/equipo/${coach}` },
        ])}
      />
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
