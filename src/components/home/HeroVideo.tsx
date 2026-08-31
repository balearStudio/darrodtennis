"use client";

import { useEffect, useRef, useState } from "react";
import { BASE_PATH } from "@/lib/site";

/**
 * Autoplaying muted loop laid over the hero still. Hero.tsx keeps the <Img>
 * beneath it as the poster and the LCP element, so first paint is unchanged.
 * The video only mounts after hydration, only fades in once it is actually
 * playing, and never loads at all for `prefers-reduced-motion` or Save-Data
 * users — they keep the still.
 */
export function HeroVideo({
  src,
  style,
}: {
  src: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [play, setPlay] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (reduce || connection?.saveData) return;
    setPlay(true);
  }, []);

  useEffect(() => {
    if (!play) return;
    const video = ref.current;
    if (!video) return;
    // React can drop the `muted` attribute on the server-less first mount;
    // force it before play() or the browser refuses to autoplay.
    video.muted = true;
    video.play().catch(() => {});
  }, [play]);

  if (!play) return null;

  const resolved = src.startsWith("/") ? `${BASE_PATH}${src}` : src;

  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
        playing ? "opacity-100" : "opacity-0"
      }`}
      style={style}
      src={resolved}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
    />
  );
}
