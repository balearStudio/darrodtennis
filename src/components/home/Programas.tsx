import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { ProgramCard } from "@/components/ProgramCard";
import { PROGRAMS } from "@/lib/content";

export async function Programas() {
  const t = await getTranslations("prog");
  const classTypes = t.raw("classTypes") as string[];

  return (
    <section id="programas" className="section-y px-side scroll-mt-24 bg-ink-800">
      <Reveal className="flex flex-col gap-10 border-b border-cream/15 pb-11 md:flex-row md:items-end md:justify-between md:gap-16">
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-h2 mt-7 max-w-[20ch] text-cream">{t("title")}</h2>
        </div>
        <p className="max-w-[38ch] text-[16px] leading-[1.6] text-cream/60">
          {t("body")}
        </p>
      </Reveal>

      <Reveal className="mt-px grid gap-px bg-cream/15 md:grid-cols-3">
        {PROGRAMS.map((program) => (
          <ProgramCard key={program.slug} program={program} />
        ))}
      </Reveal>

      <Reveal className="mt-16 border border-cream/15 p-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="mr-3 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">
            {t("classTypesLabel")}
          </span>
          {classTypes.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-cream/20 px-4 py-2 text-[13px] text-cream/85"
            >
              {chip}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
