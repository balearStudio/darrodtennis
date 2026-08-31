import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PhotoFrame } from "@/components/PhotoFrame";
import type { Coach } from "@/lib/content";

export async function CoachCard({
  coach,
  linked = false,
}: {
  coach: Coach;
  linked?: boolean;
}) {
  const t = await getTranslations("team.coaches");
  const info = t.raw(coach.slug) as { name: string; role: string };

  const body = (
    <>
      <PhotoFrame
        src={coach.image}
        alt={info.name}
        variant="portrait"
        className="aspect-[3/4]"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      />
      <div className="mt-4 border-t border-ink-900/15 pt-4">
        <div className="text-[1.1875rem] tracking-[-0.015em]">{info.name}</div>
        <div className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
          {info.role}
        </div>
      </div>
    </>
  );

  if (linked) {
    return (
      <Link
        href={`/equipo/${coach.slug}`}
        className="group block transition-opacity hover:opacity-90"
      >
        {body}
      </Link>
    );
  }

  return <article>{body}</article>;
}
