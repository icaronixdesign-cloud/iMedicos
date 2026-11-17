"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Calendar, Form, Phone } from "./Icons";
import { MARK_PATHS, WORD_PATHS } from "./logo-paths";

/** Palavras que se alternam no selo do arco. */
const WORDS = ["Saúde", "Acolhimento", "Propósito", "Cuidado"];
const INTERVAL = 2800;

const CARDS = [
  { icon: Phone, title: "Acolhimento 24h", sub: "0800 com a equipe de saúde", live: true },
  { icon: Calendar, title: "Consulta com psicólogo", sub: "Online, em horário agendado", live: false },
  { icon: Form, title: "Pesquisa Saúde", sub: "Relatório sobre o grupo", live: false },
];

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Composição da abertura: arco com a marca iMédicos, selo com palavras alternadas
 * e cartões de serviço em cascata. Decorativo (o conteúdo está no texto ao lado).
 * Parallax sutil pelo ponteiro em telas com mouse; tudo estático com movimento reduzido.
 */
export function HeroVisual() {
  const root = useRef<HTMLDivElement>(null);
  const words = useRef<(HTMLSpanElement | null)[]>([]);
  const [turn, setTurn] = useState(0);
  const [width, setWidth] = useState<number | null>(null);
  const active = turn % WORDS.length;

  // alterna as palavras (pausa com a aba oculta; desligado com movimento reduzido)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setTurn((t) => t + 1);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  // o selo acompanha a largura da palavra atual
  useIsoLayoutEffect(() => {
    const measure = () => {
      const el = words.current[active];
      if (el) setWidth(el.offsetWidth);
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
  }, [active]);

  // parallax pelo ponteiro (somente mouse/trackpad e movimento liberado)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0008 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const prev = (turn - 1 + WORDS.length) % WORDS.length;

  return (
    <div ref={root} className="hv reveal" style={{ ["--d" as string]: "160ms" }} aria-hidden="true">
      <div className="hv__arch">
        <span className="hv__glow hv__glow--a" />
        <span className="hv__glow hv__glow--b" />
        <span className="hv__grain" />
        <span className="hv__frame" />
      </div>

      <div className="hv__emblem">
        <svg className="hv__rings" viewBox="0 0 200 200">
          <circle className="hv__plate" cx="100" cy="100" r="66" />
          <circle className="hv__ring hv__ring--outer" cx="100" cy="100" r="98" pathLength={1} />
          <circle className="hv__ring hv__ring--dash" cx="100" cy="100" r="82" />
          <circle className="hv__ring hv__ring--inner" cx="100" cy="100" r="66" pathLength={1} />
          <g className="hv__orbit">
            <circle className="hv__dot" cx="100" cy="2" r="2.4" />
          </g>
        </svg>
        <svg className="hv__mark" viewBox="0 0 814 770" focusable="false">
          <g fill="currentColor" dangerouslySetInnerHTML={{ __html: MARK_PATHS }} />
        </svg>
      </div>

      <div className="hv__lockup">
        <svg className="hv__word" viewBox="34 806 752 152" focusable="false">
          <g fill="currentColor" dangerouslySetInnerHTML={{ __html: WORD_PATHS }} />
        </svg>
        <span className="hv__tag">Saúde Emocional</span>
      </div>

      <div className="hv__seal">
        <span className="hv__plus" style={{ ["--turn" as string]: turn }}>
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="hv__words" style={width ? { width } : undefined}>
          {WORDS.map((w, i) => (
            <span
              key={w}
              ref={(el) => {
                words.current[i] = el;
              }}
              className={`hv__wordx ${i === active ? "is-on" : ""} ${turn > 0 && i === prev ? "is-out" : ""}`}
            >
              {w}
            </span>
          ))}
        </span>
      </div>

      <ul className="hv__cards">
        {CARDS.map(({ icon: Icon, title, sub, live }, i) => (
          <li key={title} className={`hv-slot hv-slot--${i}`} style={{ ["--i" as string]: i }}>
            <div className="hv-card">
              <span className="hv-card__icon">
                <Icon />
              </span>
              <span className="hv-card__text">
                <b>{title}</b>
                <small>{sub}</small>
              </span>
              {live && <span className="hv-card__live" />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
