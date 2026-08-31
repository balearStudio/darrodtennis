import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { COACHES } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { CoachCard } from "@/components/CoachCard";
import { PartnerWall } from "@/components/PartnerWall";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "equipo", "/equipo");
}

export default async function EquipoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("equipoPage");
  const tteam = await getTranslations("team");
  const method = t.raw("method") as { title: string; body: string }[];

  return (
    <>
      <PageHero
        tone="cream"
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
      />

      <section className="section-y px-side bg-cream text-ink-800">
        <Reveal className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {COACHES.map((coach) => (
            <CoachCard key={coach.slug} coach={coach} linked />
          ))}
        </Reveal>
      </section>

      <section className="section-y px-side bg-ink-800 text-cream">
        <Reveal>
          <Eyebrow>{t("methodTitle")}</Eyebrow>
        </Reveal>
        <Reveal className="mt-10 grid gap-px bg-cream/15 sm:grid-cols-2">
          {method.map((m) => (
            <div key={m.title} className="bg-ink-800 p-8 md:p-10">
              <h3 className="text-h3 text-cream">{m.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.65] text-cream/65">{m.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="section-y px-side bg-cream text-ink-800">
        <Reveal>
          <PartnerWall label={tteam("collabLabel")} variant="muted" />
        </Reveal>
      </section>
    </>
  );
}
