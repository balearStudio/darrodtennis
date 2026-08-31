"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";

type RevealProps = ComponentPropsWithoutRef<"div"> & {
  /** ms delay after the element enters the viewport */
  delay?: number;
};

/**
 * Section entrance: fade + 16px rise, once, via IntersectionObserver
 * (design guide §2 Motion). This is the seam where GSAP / ScrollTrigger
 * timelines can replace the CSS transition later.
 */
export function Reveal({ delay = 0, className = "", children, ...rest }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // No IntersectionObserver (outside Next's supported browsers): show it.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${shown ? "reveal-in" : "reveal-init"} ${className}`}
      style={shown && delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
