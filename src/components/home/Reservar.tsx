import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { BookingMock } from "@/components/booking/BookingMock";

export async function Reservar() {
  const t = await getTranslations("book");
  const steps = t.raw("steps") as { title: string; body: string }[];

  return (
    <section id="reservar" className="section-y px-side scroll-mt-24 bg-ink-800">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[4.5rem]">
        <Reveal>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-h2 mt-7 max-w-[18ch] text-cream">{t("title")}</h2>
          <p className="mt-7 max-w-[44ch] text-[16px] leading-[1.65] text-cream/65">
            {t("body")}
          </p>

          <ol className="mt-12 border-t border-cream/15">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-5 border-b border-cream/10 py-6"
              >
                <span className="pt-1 font-mono text-[11px] tracking-[0.18em] text-clay">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="text-[17px] text-cream">{step.title}</div>
                  <p className="mt-1.5 text-[14.5px] leading-[1.6] text-cream/60">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={80}>
          <BookingMock />
        </Reveal>
      </div>
    </section>
  );
}
