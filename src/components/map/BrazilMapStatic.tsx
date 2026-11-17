"use client";

import { useEffect, useRef } from "react";

/**
 * Mapa estático (SVG) — usado no mobile, com movimento reduzido e sem WebGL.
 * Mesma leitura do 3D: origem no Sul e conexões ilustrativas para as cinco regiões.
 */
const ORIGIN = "SC";
const DESTS = [
  { uf: "RS", label: "Sul" },
  { uf: "MG", label: "Sudeste" },
  { uf: "MT", label: "Centro-Oeste" },
  { uf: "PE", label: "Nordeste" },
  { uf: "AM", label: "Norte" },
];
const SOUTH = ["PR", "SC", "RS"];
const NS = "http://www.w3.org/2000/svg";

export function BrazilMapStatic({ svg, animate = true, className = "" }: { svg: string; animate?: boolean; className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const root = el.querySelector("svg");
    if (!root) return;
    if (!root.querySelector(".map-overlay") && !buildOverlay(root)) return;

    if (!animate) {
      el.classList.add("is-drawn");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-drawn");
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animate]);

  return (
    <div
      ref={host}
      className={`map-static ${animate ? "is-animated" : ""} ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/** Cria rotas e marcadores sobre o SVG. Devolve false se o SVG ainda não tem layout. */
function buildOverlay(root: SVGSVGElement): boolean {

    SOUTH.forEach((uf) => root.querySelector(`#UF-${uf}`)?.classList.add("is-south"));
    DESTS.forEach((d) => d.uf !== "RS" && root.querySelector(`#UF-${d.uf}`)?.classList.add("is-dest"));
    root.querySelector(`#UF-${ORIGIN}`)?.classList.add("is-origin");

    const center = (uf: string) => {
      const p = root.querySelector<SVGGraphicsElement>(`#UF-${uf}`);
      if (!p) return { x: 0, y: 0 };
      const b = p.getBBox();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    };
    const o = center(ORIGIN);
    if (!o.x && !o.y) return false; // SVG ainda sem layout (oculto)
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "map-overlay");

    DESTS.forEach((d, i) => {
      const t = center(d.uf);
      const dx = t.x - o.x;
      const dy = t.y - o.y;
      const len = Math.hypot(dx, dy) || 1;
      // arco: ponto de controle deslocado na perpendicular
      const bend = Math.min(90, len * 0.28) * (i % 2 ? -1 : 1);
      const cx = (o.x + t.x) / 2 + (-dy / len) * bend;
      const cy = (o.y + t.y) / 2 + (dx / len) * bend;
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", `M${o.x} ${o.y} Q${cx} ${cy} ${t.x} ${t.y}`);
      path.setAttribute("class", "map-route");
      path.setAttribute("pathLength", "1");
      path.style.setProperty("--i", String(i));
      g.appendChild(path);

      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", String(t.x));
      dot.setAttribute("cy", String(t.y));
      dot.setAttribute("r", "7");
      dot.setAttribute("class", "map-dest");
      dot.style.setProperty("--i", String(i));
      g.appendChild(dot);
    });

    const ring = document.createElementNS(NS, "circle");
    ring.setAttribute("cx", String(o.x));
    ring.setAttribute("cy", String(o.y));
    ring.setAttribute("r", "18");
    ring.setAttribute("class", "map-origin-ring");
    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("cx", String(o.x));
    dot.setAttribute("cy", String(o.y));
    dot.setAttribute("r", "9");
    dot.setAttribute("class", "map-origin");
    g.append(ring, dot);
    root.appendChild(g);
    return true;
}
