"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** matchMedia reativo. No servidor devolve `serverValue`. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)", false);

/** Cena com scroll "preso" (sticky) só em telas largas e altas, com movimento liberado. */
export function useSceneMode(minWidth = 1024, minHeight = 620) {
  const wide = useMediaQuery(`(min-width: ${minWidth}px) and (min-height: ${minHeight}px)`, false);
  const reduced = useReducedMotion();
  return wide && !reduced;
}

/** Adiciona .is-in aos elementos .reveal dentro do container quando entram na tela. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (root.classList.contains("reveal")) els.unshift(root);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

/**
 * Progresso (0–1) de um trilho alto com palco sticky: 0 quando o topo do trilho
 * chega ao topo da tela, 1 quando o fim do trilho chega ao fim da tela.
 * O callback roda em rAF; não provoca re-render.
 */
export function useTrackProgress(
  ref: React.RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  enabled = true,
) {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      cb.current(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, enabled]);
}

/** Rola a janela até a fração `p` de um trilho sticky. */
export function scrollTrackTo(el: HTMLElement, p: number, reduced: boolean) {
  const top = el.getBoundingClientRect().top + window.scrollY;
  const span = el.offsetHeight - window.innerHeight;
  window.scrollTo({ top: top + span * p, behavior: reduced ? "auto" : "smooth" });
}

/** Observa se um elemento está próximo da viewport. */
export function useNearViewport(ref: React.RefObject<HTMLElement | null>, margin = "50%") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Mapeia v do intervalo [a,b] para 0–1. */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
