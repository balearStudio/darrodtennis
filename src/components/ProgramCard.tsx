import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PhotoFrame } from "@/components/PhotoFrame";
import type { Program } from "@/lib/content";

export async function ProgramCard({ program }: { program: Program }) {
  const t = await getTranslations("prog");
  const item = t.raw(`items.${program.key}`) as {
    index: string;
    tag: string;
    name: string;
    summary: string;
  };

  return (
    <article className="group flex flex-col bg-ink-800 pt-8 transition-colors duration-300 hover:bg-ink-700">
      <div className="flex items-baseline justify-between px-7 pb-6">
        <span className="font-mono text-[11px] tracking-[0.18em] text-clay">
          {item.index}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
          {item.tag}
        </span>
      </div>

      <PhotoFrame
        src={program.image}
        alt={item.name}
        className="h-64"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-h3 text-cream">{item.name}</h3>
        <p className="mt-3.5 text-[15px] leading-[1.65] text-cream/65">
          {item.summary}
        </p>
        <Link
          href={`/programas/${program.slug}`}
          className="mt-6 inline-flex w-fit items-center gap-2.5 border-b border-cream/30 pb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cream transition-colors hover:border-clay"
        >
          {t("link")}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
