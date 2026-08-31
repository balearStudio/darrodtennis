import { Img } from "@/components/Img";
import type { Partner } from "@/lib/content";
import { ALL_PARTNERS } from "@/lib/content";

/**
 * "Colaboramos con" logo wall. `muted` neutralises the full-colour logos to sit
 * quietly on a cream section; `color` shows them as-is (used on /hoteles).
 */
export function PartnerWall({
  label,
  partners = ALL_PARTNERS,
  variant = "muted",
}: {
  label: string;
  partners?: Partner[];
  variant?: "muted" | "color";
}) {
  return (
    <div>
      <div className="text-label mb-8 text-muted">{label}</div>
      <ul className="flex flex-wrap items-center gap-x-10 gap-y-7 sm:gap-x-12">
        {partners.map((p) => (
          <li key={p.id} className="shrink-0">
            <Img
              src={p.src}
              alt={p.name}
              width={160}
              height={44}
              className={
                variant === "muted"
                  ? "h-7 w-auto opacity-60 mix-blend-multiply grayscale sm:h-8"
                  : "h-9 w-auto sm:h-10"
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
