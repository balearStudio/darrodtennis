import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { CONTACT, whatsappHref, FEDERATION_LICENCE_URL } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/Eyebrow";
import { Cta } from "@/components/Cta";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "escuela", "/escuela");
}

/**
 * Tennis school (season 2026/27) and federation licences, from the client's
 * two posters. Licence fees are the federation's, not lesson prices — those
 * stay off the site.
 */
export default async function EscuelaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("escuela");
  const facts = t.raw("facts") as { label: string; value: string }[];
  const offer = t.raw("offer.items") as { title: string; body: string }[];
  const fees = t.raw("licences.fees") as { group: string; ages: string; price: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
        <dl className="mt-14 grid border-t border-cream/15 sm:grid-cols-3">
          {facts.map((fact, i) => (
            <div
              key={fact.label}
              className={`border-cream/15 py-6 sm:pr-6 ${
                i > 0 ? "border-t sm:border-l sm:border-t-0 sm:pl-7" : ""
              }`}
            >
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-cream/50">
                {fact.label}
              </dt>
              <dd className="mt-2 whitespace-pre-line text-[17px] leading-[1.5] text-cream">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="px-side bg-ink-800 pb-20 pt-6">
        <PhotoFrame
          src="/images/escuela.jpg"
          alt={t("imageAlt")}
          className="aspect-[16/9] w-full"
          sizes="100vw"
          priority
        />
      </section>

      {/* What the school covers */}
      <section className="section-y px-side bg-cream text-ink-800">
        <div className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <Reveal>
            <Eyebrow tone="cream">{t("offer.eyebrow")}</Eyebrow>
            <h2 className="text-h2 mt-8 max-w-[16ch]">{t("offer.title")}</h2>
          </Reveal>
          <Reveal delay={80} className="border-t border-ink-900/15">
            {offer.map((item) => (
              <div key={item.title} className="border-b border-ink-900/10 py-7">
                <h3 className="text-[1.1875rem] tracking-[-0.01em]">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-muted">{item.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Federation licences 2026/27 */}
      <section id="licencias" className="section-y px-side scroll-mt-24 bg-ink-900 text-cream">
        <Reveal>
          <Eyebrow>{t("licences.eyebrow")}</Eyebrow>
          <h2 className="text-h2 mt-7 max-w-[18ch]">{t("licences.title")}</h2>
          <p className="mt-7 max-w-[52ch] text-[16px] leading-[1.65] text-cream/65">
            {t("licences.intro")}
          </p>
        </Reveal>

        <Reveal delay={60} className="mt-14 grid gap-px bg-cream/15 md:grid-cols-2">
          <div className="bg-ink-900 py-8 md:pr-10">
            <span className="font-mono text-[11px] tracking-[0.18em] text-clay">01</span>
            <h3 className="text-h3 mt-4">{t("licences.renewTitle")}</h3>
            <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.65] text-cream/65">
              {t("licences.renewBody")}
            </p>
          </div>
          <div className="bg-ink-900 py-8 md:pl-10">
            <span className="font-mono text-[11px] tracking-[0.18em] text-clay">02</span>
            <h3 className="text-h3 mt-4">{t("licences.newTitle")}</h3>
            <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.65] text-cream/65">
              {t("licences.newBody")}
            </p>
            <div className="mt-6 border-l-2 border-clay bg-clay/10 px-4 py-3">
              <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-cream/55">
                {t("licences.clubLabel")}
              </div>
              <div className="mt-1 text-[17px] text-cream">{t("licences.clubName")}</div>
            </div>
            <div className="mt-7">
              <Cta href={FEDERATION_LICENCE_URL} variant="primary">
                {t("licences.newCta")} ↗
              </Cta>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-14">
          <div className="text-label text-cream/45">{t("licences.feesTitle")}</div>
          <dl className="mt-5 grid border-t border-cream/15 sm:grid-cols-3">
            {fees.map((fee, i) => (
              <div
                key={fee.group}
                className={`border-cream/15 py-6 sm:pr-6 ${
                  i > 0 ? "border-t sm:border-l sm:border-t-0 sm:pl-7" : ""
                }`}
              >
                <dt>
                  <span className="text-[17px] text-cream">{fee.group}</span>
                  <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-cream/50">
                    {fee.ages}
                  </span>
                </dt>
                <dd className="mt-3 text-[2rem] leading-none tracking-[-0.02em] text-cream">
                  {fee.price}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-[56ch] font-mono text-[11px] leading-[1.8] tracking-[0.04em] text-cream/40">
            {t("licences.feesNote")}
          </p>
        </Reveal>
      </section>

      {/* Questions / sign-up */}
      <section className="section-y px-side bg-cream text-ink-800">
        <Reveal>
          <h2 className="text-h2 max-w-[18ch]">{t("cta.title")}</h2>
          <p className="mt-5 max-w-[52ch] text-body text-slate">
            {t("cta.body", { email: CONTACT.email })}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {whatsappHref ? (
              <Cta href={whatsappHref} variant="primary">
                {t("cta.whatsapp")}
              </Cta>
            ) : null}
            <Cta href="/contacto" variant="secondary" onCream>
              {t("cta.contact")}
            </Cta>
          </div>
        </Reveal>
      </section>
    </>
  );
}
