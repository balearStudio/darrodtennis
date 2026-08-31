import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "text";

const base =
  "inline-flex items-center gap-3 rounded-[2px] text-sm tracking-[0.02em] transition-colors";

const variants: Record<Variant, string> = {
  primary:
    "bg-clay border border-clay px-7 py-4 text-cream hover:bg-clay-hover",
  secondary:
    "border border-cream/30 px-7 py-4 text-cream hover:border-cream",
  text: "text-label border-b border-cream/30 pb-1.5 text-cream hover:border-clay",
};

const creamSurface: Record<Variant, string> = {
  primary: "",
  secondary: "border-ink-900/25 text-ink-900 hover:border-ink-900",
  text: "border-ink-900/30 text-ink-900 hover:border-clay",
};

type CtaProps = {
  href: string;
  variant?: Variant;
  /** set when the button sits on a cream section */
  onCream?: boolean;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "children">;

/**
 * Buttons/links: 2px radius, colour/border transitions only (design guide §2).
 * Internal hrefs (`/…`, `#…`) route through the locale-aware <Link>; anything
 * with a scheme opens as a plain external anchor.
 */
export function Cta({
  href,
  variant = "primary",
  onCream = false,
  children,
  className = "",
  ...rest
}: CtaProps) {
  const classes = `${base} ${variants[variant]} ${onCream ? creamSurface[variant] : ""} ${className}`;
  const isExternal = /^https?:|^mailto:|^tel:/.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
