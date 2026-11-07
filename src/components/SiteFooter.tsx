import { Img } from "@/components/Img";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT, STUDIO, telHref, whatsappHref } from "@/lib/site";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const locale = await getLocale();

  const columns = [
    {
      title: t("colAcademy"),
      links: [
        { label: tn("programs"), href: "/programas" },
        { label: tn("team"), href: "/equipo" },
        { label: t("linkPhilosophy"), href: "/#filosofia" },
        { label: tn("tournaments"), href: "/torneos" },
      ],
    },
    {
      title: t("colServices"),
      links: [
        { label: tn("cta"), href: "/reservar" },
        { label: t("linkHotels"), href: "/hoteles" },
        { label: t("linkStays"), href: "/contacto" },
      ],
    },
  ];

  return (
    <footer className="bg-ink-900">
      <div className="px-side pb-10 pt-24">
        <div className="grid gap-12 border-b border-cream/12 pb-16 md:grid-cols-[1.2fr_repeat(3,0.7fr)] md:gap-14">
          <div>
            <Img
              src="/darrod-logo.png"
              alt="Darrod Tennis Academy"
              width={220}
              height={123}
              style={{ filter: "invert(1) brightness(1.9)" }}
              className="h-[52px] w-auto"
            />
            <p className="mt-6 max-w-[34ch] text-[15px] leading-[1.65] text-cream/55">
              {t("tagline")}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-label mb-5 text-cream/40">{col.title}</div>
              <ul className="flex flex-col gap-3 text-[15px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-cream/75 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="text-label mb-5 text-cream/40">{t("colContact")}</div>
            <ul className="flex flex-col gap-3 text-[15px] text-cream/75">
              <li>{tc("location")}</li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="transition-colors hover:text-cream"
                >
                  {CONTACT.email}
                </a>
              </li>
              {telHref ? (
                <li>
                  <a
                    href={telHref}
                    className="transition-colors hover:text-cream"
                  >
                    {CONTACT.phone}
                  </a>
                </li>
              ) : null}
              {whatsappHref ? (
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-cream"
                  >
                    {tc("whatsapp")}
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-cream"
                >
                  {tc("instagram")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-label flex flex-col gap-4 pt-7 text-cream/35 sm:flex-row sm:items-center sm:justify-between">
          <span>{t("rights")}</span>
          <div className="flex gap-6">
            <Link href="/aviso-legal" className="transition-colors hover:text-cream">
              {t("legalNotice")}
            </Link>
            <Link href="/privacidad" className="transition-colors hover:text-cream">
              {t("privacy")}
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-cream">
              {t("cookies")}
            </Link>
          </div>
        </div>

        {/* Studio credit. The wordmark copies balearstudio.com's logo: "balear"
            lowercase/regular, "STUDIO" uppercase/bold, each with its tracking. */}
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 text-cream/35">
          <span className="text-label">{t("madeBy")}</span>
          <a
            href={STUDIO.url[locale === "en" ? "en" : "es"]}
            target="_blank"
            rel="noopener"
            aria-label="balearSTUDIO"
            className="inline-flex items-baseline text-[14px] leading-none text-cream/60 transition-colors hover:text-cream"
          >
            <span className="font-normal lowercase tracking-[0.14em]">balear</span>
            <span className="ml-[0.16em] font-bold uppercase tracking-[0.24em]">studio</span>
          </a>
          <span aria-hidden className="text-label">·</span>
          <a
            href={`mailto:${STUDIO.email}`}
            className="text-[13px] transition-colors hover:text-cream"
          >
            {STUDIO.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
