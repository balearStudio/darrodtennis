import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { CoachCard } from "@/components/CoachCard";
import { PartnerWall } from "@/components/PartnerWall";
import { COACHES } from "@/lib/content";

export async function Equipo() {
  const t = await getTranslations("team");

  return (
    <section id="equipo" className="section-y px-side scroll-mt-24 bg-cream text-ink-800">
      <Reveal className="flex flex-col gap-8 border-b border-ink-900/15 pb-11 md:flex-row md:items-end md:justify-between md:gap-16">
        <div>
          <Eyebrow tone="cream">{t("eyebrow")}</Eyebrow>
          <h2 className="text-h2 mt-7 max-w-[20ch]">{t("title")}</h2>
        </div>
        <Link
          href="/equipo"
          className="inline-flex w-fit shrink-0 items-center gap-2.5 border-b border-ink-900/30 pb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-900 transition-colors hover:border-clay"
        >
          {t("cta")}
          <span aria-hidden>→</span>
        </Link>
      </Reveal>

      <Reveal className="mt-11 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
        {COACHES.map((coach) => (
          <CoachCard key={coach.slug} coach={coach} linked />
        ))}
      </Reveal>

      <Reveal className="mt-20 border-t border-ink-900/15 pt-11">
        <PartnerWall label={t("collabLabel")} variant="muted" />
      </Reveal>
    </section>
  );
}
