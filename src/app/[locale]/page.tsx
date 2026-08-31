import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { createMetadata } from "@/lib/metadata";
import { businessSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/home/Hero";
import { Filosofia } from "@/components/home/Filosofia";
import { Programas } from "@/components/home/Programas";
import { Jugadores } from "@/components/home/Jugadores";
import { Equipo } from "@/components/home/Equipo";
import { Reservar } from "@/components/home/Reservar";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata(locale, "home", "/");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("meta");

  return (
    <>
      <JsonLd data={businessSchema(locale, t("home.description"))} />
      <Hero />
      <Filosofia />
      <Programas />
      <Jugadores />
      <Equipo />
      <Reservar />
    </>
  );
}
