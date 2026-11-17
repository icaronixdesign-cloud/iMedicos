"use client";

import { useEffect, useRef, useState } from "react";
import { EDUCATION } from "@/content/site";
import { easeInOut, scrollTrackTo, useReducedMotion, useSceneMode, useTrackProgress } from "@/lib/hooks";
import { ArrowLeft, ArrowRight, Book, Broadcast, Chat, Users } from "./Icons";

const N = EDUCATION.cards.length;
const ICONS = [Users, Broadcast, Book];

/* ---------- Visuais (interface ilustrativa, sem pessoas reais) ---------- */
function VisualRoda() {
  const people = ["#C9906F", "#DFD1C6", "#7C5943", "#EEE5DE", "#8C4A2B", "#CBC3BC"];
  return (
    <div className="ev ev--roda" aria-hidden="true">
      <div className="ev-grid">
        {people.map((c, i) => (
          <span key={i} className="ev-tile" style={{ ["--i" as string]: i }}>
            <i style={{ background: c }} />
            <span className="ev-wave">
              <b />
              <b />
              <b />
            </span>
            {i === 0 && <small>Profissional</small>}
          </span>
        ))}
      </div>
      <div className="ev-bar">
        <span className="ev-bar__live" />
        <span>Roda de conversa · tema combinado</span>
        <span className="ev-bar__count"><Users /> até 30</span>
      </div>
    </div>
  );
}
function VisualLive() {
  const msgs = [
    { t: "Como manter uma rotina de sono?", me: false },
    { t: "Boa pergunta!", me: true },
    { t: "Vale para quem trabalha em turnos?", me: false },
  ];
  return (
    <div className="ev ev--live" aria-hidden="true">
      <div className="ev-stage">
        <span className="ev-onair">Ao vivo</span>
        <span className="ev-presenter" />
        <span className="ev-slide">
          <b />
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="ev-chat">
        <span className="ev-chat__head"><Chat /> Chat</span>
        {msgs.map((m, i) => (
          <span key={m.t} className={`ev-msg ${m.me ? "ev-msg--me" : ""}`} style={{ ["--i" as string]: i }}>
            {m.t}
          </span>
        ))}
        <span className="ev-typing">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
function VisualCurso() {
  const rows = [
    ["Liderança e saúde emocional", 0.72],
    ["Conversas difíceis na equipe", 0.4],
    ["Pausas e ritmo de trabalho", 0.12],
  ] as const;
  return (
    <div className="ev ev--curso" aria-hidden="true">
      <div className="ev-app">
        <span className="ev-app__crumb">Aprendizagem › <b>Minha Aprendizagem</b></span>
        {rows.map(([t, v], i) => (
          <span key={t} className="ev-course" style={{ ["--i" as string]: i, ["--v" as string]: v }}>
            <span className="ev-course__play"><Book /></span>
            <span className="ev-course__body">
              <b>{t}</b>
              <span className="ev-course__bar"><i /></span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
const VISUALS = [VisualRoda, VisualLive, VisualCurso];

function Card({ i, active }: { i: number; active?: boolean }) {
  const c = EDUCATION.cards[i];
  const Icon = ICONS[i];
  const V = VISUALS[i];
  return (
    <article className={`edu-card ${active ? "is-active" : ""}`} aria-labelledby={`edu-${i}`}>
      <V />
      <div className="edu-card__body">
        <p className="edu-card__kind">
          <span className="edu-card__icon"><Icon /></span>
          {c.kind}
          <span className="edu-card__pos" aria-hidden="true">{i + 1}/{N}</span>
        </p>
        <h3 id={`edu-${i}`} className="h4">{c.title}</h3>
        <p className="muted">{c.text}</p>
        <ul className="edu-card__tags" aria-label="Características">
          {c.tags.map((t) => (
            <li key={t} className="tag">{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Controls({ index, go, label = "Formatos" }: { index: number; go: (i: number) => void; label?: string }) {
  return (
    <div className="edu-controls">
      <button type="button" className="icon-btn" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Formato anterior">
        <ArrowLeft />
      </button>
      <span className="edu-controls__pos" aria-live="polite">
        <span className="sr-only">{label}: </span>
        <b>{index + 1}</b>/{N}
        <span className="sr-only"> — {EDUCATION.cards[index].kind}</span>
      </span>
      <button type="button" className="icon-btn" onClick={() => go(index + 1)} disabled={index === N - 1} aria-label="Próximo formato">
        <ArrowRight />
      </button>
      <span className="edu-controls__track" aria-hidden="true">
        <i style={{ transform: `scaleX(${(index + 1) / N})` }} />
      </span>
    </div>
  );
}

export function Education() {
  const scene = useSceneMode(1024, 680);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLUListElement>(null);

  // Cena: o scroll vertical move os cards na horizontal
  useTrackProgress(
    track,
    (p) => {
      const r = row.current;
      const v = viewport.current;
      if (!r || !v) return;
      const cs = getComputedStyle(v);
      const inner = v.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const max = Math.max(0, r.scrollWidth - inner);
      const e = range01(p);
      r.style.transform = `translate3d(${-max * e}px,0,0)`;
      const i = Math.min(N - 1, Math.round(p * (N - 1)));
      setIndex((prev) => (prev === i ? prev : i));
    },
    scene,
  );

  // Carrossel nativo (mobile/tablet): índice pelo scroll horizontal
  useEffect(() => {
    if (scene || reduced) return;
    const s = scroller.current;
    if (!s) return;
    const onScroll = () => {
      const items = Array.from(s.children) as HTMLElement[];
      const left = s.scrollLeft;
      let best = 0;
      let bestD = Infinity;
      items.forEach((it, i) => {
        const d = Math.abs(it.offsetLeft - s.offsetLeft - left);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setIndex(best);
    };
    s.addEventListener("scroll", onScroll, { passive: true });
    return () => s.removeEventListener("scroll", onScroll);
  }, [scene, reduced]);

  const go = (i: number) => {
    const t = Math.max(0, Math.min(N - 1, i));
    if (scene && track.current) {
      scrollTrackTo(track.current, t / (N - 1), reduced);
    } else if (scroller.current) {
      const it = scroller.current.children[t] as HTMLElement | undefined;
      if (it) scroller.current.scrollTo({ left: it.offsetLeft - scroller.current.offsetLeft, behavior: reduced ? "auto" : "smooth" });
      setIndex(t);
    }
  };

  const Intro = (
    <div className="edu__intro">
      <div className="section-head">
        <p className="hat reveal">{EDUCATION.hat}</p>
        <h2 id="edu-title" className="h2 reveal">{EDUCATION.title}</h2>
        <p className="lead reveal">{EDUCATION.description}</p>
      </div>
      <div className="edu__themes reveal">
        <p className="edu__themes-label">Temas de exemplo</p>
        <ul>
          {EDUCATION.themes.map((t) => (
            <li key={t} className="tag tag--sand">{t}</li>
          ))}
        </ul>
        <p className="edu__scope">{EDUCATION.scope}</p>
      </div>
    </div>
  );

  if (scene) {
    return (
      <section id="educacao" className="edu edu--scene" aria-labelledby="edu-title">
        <div ref={track} className="edu__track" style={{ height: `${N * 70 + 100}vh` }}>
          <div className="edu__stage">
            <div className="container edu__grid">
              <div className="edu__left">
                {Intro}
                <Controls index={index} go={go} />
              </div>
              <div className="edu__viewport" ref={viewport}>
                <div className="edu__row" ref={row}>
                  {EDUCATION.cards.map((c, i) => (
                    <Card key={c.kind} i={i} active={i === index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="educacao" className={`section edu ${reduced ? "edu--stack" : "edu--carousel"}`} aria-labelledby="edu-title">
      <div className="container">
        {Intro}
        {!reduced && <Controls index={index} go={go} />}
        <ul
          ref={scroller}
          className="edu__list"
          aria-label="Formatos de educação continuada"
          tabIndex={reduced ? undefined : 0}
        >
          {EDUCATION.cards.map((c, i) => (
            <li key={c.kind}>
              <Card i={i} active={i === index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const range01 = (p: number) => easeInOut(Math.min(1, Math.max(0, (p - 0.04) / 0.92)));
