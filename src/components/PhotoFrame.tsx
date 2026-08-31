import { Img } from "@/components/Img";

/**
 * Photography always stays in colour but is framed darkly (design guide §2):
 *  - "scene" — the full scene treatment + a top-to-bottom scrim
 *  - "portrait" — a lighter grade, no scrim by default
 * The wrapper is `position: relative`; callers set the box size / aspect-ratio.
 */
export function PhotoFrame({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
  objectPosition,
  variant = "scene",
  scrim = variant === "scene",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
  variant?: "scene" | "portrait";
  scrim?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-ink-800 ${scrim ? "photo-scrim" : ""} ${className}`}
    >
      <Img
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        className={`object-cover ${variant === "scene" ? "photo-treated" : "photo-portrait"}`}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}
