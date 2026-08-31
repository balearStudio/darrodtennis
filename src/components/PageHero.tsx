import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

/**
 * Standard heading block for inner pages. Top padding clears the fixed header;
 * `tone` switches between the two backgrounds.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  tone = "dark",
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "dark" | "cream";
  children?: ReactNode;
}) {
  return (
    <section
      className={`px-side pb-2 pt-28 md:pt-40 ${
        tone === "dark" ? "bg-ink-800 text-cream" : "bg-cream text-ink-800"
      }`}
    >
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h1 className="text-h2 mt-8 max-w-[20ch]">{title}</h1>
      {intro ? (
        <p
          className={`mt-7 max-w-[56ch] text-body ${
            tone === "dark" ? "text-cream/65" : "text-slate"
          }`}
        >
          {intro}
        </p>
      ) : null}
      {children}
    </section>
  );
}
