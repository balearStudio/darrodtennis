import { Img } from "@/components/Img";
import { getTranslations } from "next-intl/server";
import { Cta } from "@/components/Cta";
import { Eyebrow } from "@/components/Eyebrow";
import { HeroVideo } from "@/components/home/HeroVideo";

export async function Hero() {
  const t = await getTranslations("hero");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-ink-800 lg:min-h-[54rem]">
      {/* Aerial still stays the poster / LCP; the loop fades in over it. */}
      <div className="absolute inset-0">
        <Img
          src="/images/aerial.jpg"
          alt="Vista aérea de las pistas de Darrod Tennis Academy en Maspalomas"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "52% 46%",
            filter: "saturate(0.82) contrast(1.06) brightness(0.88)",
          }}
        />
        <HeroVideo
          src="/videos/club-tennis.mp4"
          style={{
            objectPosition: "52% 46%",
            filter: "saturate(0.82) contrast(1.06) brightness(0.88)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,23,15,0.82) 0%, rgba(20,23,15,0.34) 30%, rgba(20,23,15,0.58) 64%, rgba(20,23,15,0.97) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 20% 60%, rgba(20,23,15,0.55) 0%, rgba(20,23,15,0) 60%)",
          }}
        />
      </div>

      {/* Dashed grid overlay — hero only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid grid-cols-4"
      >
        <div className="border-r border-dashed border-cream/10" />
        <div className="border-r border-dashed border-cream/10" />
        <div className="border-r border-dashed border-cream/10" />
        <div />
      </div>

      <div className="px-side relative z-10 pb-12 pt-32">
        <div className="max-w-[62rem] pb-12">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="text-display mt-7 text-cream">
            {t("titleLine1")}{" "}
            <span className="font-accent">{t("titleAccent")}</span>
          </h1>
          <p className="mt-8 max-w-[32rem] text-body text-cream/70">{t("body")}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Cta href="/reservar" variant="primary">
              {t("cta1")}
            </Cta>
            <Cta href="/programas" variant="secondary">
              {t("cta2")}
            </Cta>
          </div>
        </div>

        <dl className="grid grid-cols-2 border-t border-cream/15 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`min-w-0 border-cream/15 py-6 pr-4 md:px-7 md:first:pl-0 ${
                i % 2 === 1 ? "border-l pl-4" : ""
              } ${i >= 2 ? "border-t" : ""} md:border-t-0 md:pl-7 ${
                i >= 1 ? "md:border-l" : "md:border-l-0"
              }`}
            >
              <dd className="text-[1.75rem] leading-none tracking-[-0.02em] text-cream md:text-[2.125rem]">
                {stat.value}
              </dd>
              <dt className="mt-2 font-mono text-[10.5px] uppercase leading-tight tracking-[0.12em] text-cream/50 md:text-[11px] md:tracking-[0.14em]">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
