import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

export async function Filosofia() {
  const t = await getTranslations("phil");
  const principles = t.raw("principles") as { title: string; body: string }[];

  return (
    <section
      id="filosofia"
      className="section-y px-side scroll-mt-24 bg-cream text-ink-800"
    >
      <div className="grid gap-14 md:grid-cols-[1.45fr_1fr] md:gap-20">
        <Reveal>
          <Eyebrow tone="cream">{t("eyebrow")}</Eyebrow>
          <h2 className="text-h2 mt-9 max-w-[16ch]">{t("title")}</h2>
          <p className="mt-8 max-w-[56ch] text-body text-slate">{t("body")}</p>
        </Reveal>

        <Reveal delay={80} className="border-t border-ink-900/15">
          {principles.map((p) => (
            <div key={p.title} className="border-b border-ink-900/10 py-7">
              <h3 className="text-[1.1875rem] tracking-[-0.01em]">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-muted">{p.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
