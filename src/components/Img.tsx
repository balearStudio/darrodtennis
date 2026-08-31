import Image, { type ImageProps } from "next/image";
import { BASE_PATH } from "@/lib/site";

/**
 * `next/image` wrapper that prepends `basePath` to local sources.
 *
 * The site is an unoptimized static export on a GitHub Pages *project* path
 * (`/darrodtennis`). `next/image` prefixes `basePath` onto `/_next/*` assets
 * but not onto a plain unoptimized `src`, so every `<Img>` does it here — the
 * fix for the earlier 4xx on image URLs.
 */
export function Img({ src, alt, ...props }: ImageProps) {
  const resolved =
    typeof src === "string" && src.startsWith("/") ? `${BASE_PATH}${src}` : src;
  return <Image src={resolved} alt={alt} {...props} />;
}
