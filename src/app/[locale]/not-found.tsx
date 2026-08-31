import { getTranslations } from "next-intl/server";
import { Cta } from "@/components/Cta";
import { Eyebrow } from "@/components/Eyebrow";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="px-side flex min-h-[70vh] flex-col justify-center bg-ink-800 py-32 text-cream">
      <div className="max-w-xl">
        <Eyebrow>404</Eyebrow>
        <h1 className="text-display mt-7 text-cream">{t("title")}</h1>
        <p className="mt-6 max-w-[42ch] text-body text-cream/65">{t("body")}</p>
        <div className="mt-10">
          <Cta href="/" variant="secondary">
            {t("cta")}
          </Cta>
        </div>
      </div>
    </section>
  );
}
