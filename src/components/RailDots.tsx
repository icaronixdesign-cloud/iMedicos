"use client";

import { useEffect, useState } from "react";

/**
 * Indicador de posição para listas que viram carrossel com scroll-snap no mobile.
 * Lê a rolagem horizontal do elemento `targetId`; no desktop fica oculto via CSS.
 */
export function RailDots({ targetId, count, label }: { targetId: string; count: number; label: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const items = Array.from(el.children) as HTMLElement[];
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      items.forEach((it, i) => {
        const c = it.offsetLeft + it.offsetWidth / 2 - el.offsetLeft;
        const d = Math.abs(c - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  const go = (i: number) => {
    const el = document.getElementById(targetId);
    const it = el?.children[i] as HTMLElement | undefined;
    if (!el || !it) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: it.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || "0"), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="rail-dots" role="group" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`rail-dots__dot ${i === active ? "is-on" : ""}`}
          aria-label={`Ir para o item ${i + 1} de ${count}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() => go(i)}
        >
          <span />
        </button>
      ))}
    </div>
  );
}
