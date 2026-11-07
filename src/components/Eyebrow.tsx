import type { ReactNode } from "react";

/**
 * Clay hairline + mono micro-label. The one recurring section marker in the
 * design. `tone` picks the label colour for dark vs cream backgrounds; `as`
 * swaps the wrapper element (the homepage hero renders it as the `<h1>`).
 */
export function Eyebrow({
  children,
  tone = "dark",
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  tone?: "dark" | "cream";
  className?: string;
  as?: "div" | "h1";
}) {
  return (
    <Tag className={`flex items-center gap-3.5 ${className}`}>
      <span aria-hidden className="h-px w-9 shrink-0 bg-clay" />
      <span className={`text-label ${tone === "dark" ? "text-cream/70" : "text-muted"}`}>
        {children}
      </span>
    </Tag>
  );
}
