import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

type Player = { name: string; stat: string; note?: string };

/**
 * Track record for the coaching & advice programme. Same two-column rhythm as
 * Filosofía, on the deepest background so it reads as a spotlight between the
 * programmes and the team. Copy is carried over from the client's current site.
 */
export async function Jugadores() {
  const t = await getTranslations("players");
  const list = t.raw("list") as Player[];

  return (
    <section id="jugadores" className="section-y px-side scroll-mt-24 bg-ink-900">
      <div className="grid gap-14 md:grid-cols-[1.45fr_1fr] md:gap-20">
        <Reveal>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-h2 mt-9 max-w-[18ch] text-cream">{t("title")}</h2>
          <p className="mt-8 max-w-[52ch] text-body text-cream/60">{t("body")}</p>
          <Link
            href="/programas/coaching-asesoramiento"
            className="mt-9 inline-flex w-fit items-center gap-2.5 border-b border-cream/30 pb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream transition-colors hover:border-clay"
          >
            {t("cta")}
            <span aria-hidden>→</span>
          </Link>
        </Reveal>

        <Reveal delay={80}>
          <dl className="border-t border-cream/15">
            {list.map((player) => (
              <div
                key={player.name}
                className="flex flex-col gap-1.5 border-b border-cream/10 py-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[1.1875rem] tracking-[-0.01em] text-cream">
                    {player.name}
                  </dt>
                  <dd className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-cream/55">
                    {player.stat}
                  </dd>
                </div>
                {player.note ? (
                  <p className="max-w-[42ch] text-[13.5px] leading-[1.55] text-cream/45">
                    {player.note}
                  </p>
                ) : null}
              </div>
            ))}
          </dl>
          <p className="mt-6 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.14em] text-cream/35">
            {t("note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
