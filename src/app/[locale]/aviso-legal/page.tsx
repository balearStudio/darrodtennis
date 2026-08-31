import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { LegalPage } from "@/components/LegalPage";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "avisoLegal", "/aviso-legal");
}

export default async function AvisoLegalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const data = t.raw("avisoLegal") as {
    title: string;
    sections: { heading: string; body: string }[];
  };

  return (
    <LegalPage
      title={data.title}
      sections={data.sections}
      disclaimer={t("disclaimer")}
      lastUpdated={t("lastUpdated")}
    />
  );
}
