import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { CONTACT, telHref, whatsappHref } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "contacto", "/contacto");
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacto");
  const tc = await getTranslations("common");

  const items = [
    { label: t("locationLabel"), value: tc("location") },
    {
      label: t("emailLabel"),
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    ...(telHref
      ? [{ label: t("phoneLabel"), value: CONTACT.phone, href: telHref }]
      : []),
    ...(whatsappHref
      ? [
          {
            label: t("whatsappLabel"),
            value: tc("whatsapp"),
            href: whatsappHref,
            external: true,
          },
        ]
      : []),
    {
      label: t("instagramLabel"),
      value: "@darrodtennisacademy",
      href: CONTACT.instagram,
      external: true,
    },
  ];

  return (
    <>
      <PageHero
        tone="cream"
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("body")}
      />

      <section className="section-y px-side bg-cream text-ink-800">
        <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <Reveal>
            <dl className="border-t border-ink-900/15">
              {items.map((item) => (
                <div key={item.label} className="border-b border-ink-900/10 py-6">
                  <dt className="text-label text-muted">{item.label}</dt>
                  <dd className="mt-2 text-[17px]">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noreferrer" : undefined}
                        className="border-b border-ink-900/25 pb-0.5 transition-colors hover:border-clay"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={60}>
            <EnquiryForm tone="cream" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
