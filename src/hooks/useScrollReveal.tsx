import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Reveals an element with a subtle 3D tilt + fade as it enters the viewport.
 * Use the returned ref + dataset attributes on a wrapper element styled by
 * `.reveal-3d` in styles.css.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; once?: boolean },
): { ref: RefObject<T | null>; visible: boolean } {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  const once = options?.once ?? true;
  const threshold = options?.threshold ?? 0.15;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, threshold]);

  return { ref, visible };
}

/**
 * Tracks scroll Y to drive parallax translation on hero sections.
 */
export function useParallax(strength = 0.25): number {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setOffset(window.scrollY * strength));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return offset;
}
