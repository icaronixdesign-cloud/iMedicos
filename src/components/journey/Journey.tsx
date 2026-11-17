"use client";

import { useCallback, useRef, useState } from "react";
import { JOURNEY } from "@/content/site";
import { scrollTrackTo, useReducedMotion, useSceneMode, useTrackProgress } from "@/lib/hooks";
import { ArrowDown, ArrowLeft, ArrowRight } from "../Icons";
import { PhoneFrame } from "./PhoneScreens";

const N = JOURNEY.steps.length;

/**
 * Informação complementar ao lado do aparelho: só o que a etapa não diz,
 * em etiquetas curtas (o texto principal fica na etapa).
 */
const Tags = ({ items }: { items: string[] }) => (
  <div className="jd__tags">
    {items.map((t) => (
      <span key={t} className="tag tag--sand">
        {t}
      </span>
    ))}
  </div>
);

const DETAILS: React.ReactNode[] = [
  <>
    <p className="jd__title">Triagem individual de saúde mental</p>
    <Tags items={["No app Saúde24h"]} />
    <details className="jd__more">
      <summary>Referências técnicas</summary>
      <ul className="jd__list">
        <li>Escala do Impacto do Evento (IES-R)</li>
        <li>Índice de Gravidade de Insônia</li>
        <li>PHQ-9 · GAD-7</li>
        <li>Escala de Humor de Brunel</li>
      </ul>
    </details>
  </>,
  <>
    <p className="jd__title">Análise qualificada</p>
    <Tags items={["Enviado por e-mail", "Só para o colaborador"]} />
    <span className="demo-badge">Exemplo fictício</span>
  </>,
  <>
    <p className="jd__title">Agendamento</p>
    <Tags items={["Sessões de 30 ou 50 min", "Agendamento recorrente"]} />
  </>,
  <>
    <p className="jd__title">Onde a sessão acontece</p>
    <Tags items={["App Saúde24h", "SMS", "WhatsApp"]} />
  </>,
  <>
    <p className="jd__title">Plano de Cuidado Individual</p>
    <Tags items={["Assinatura digital", "Exportar em PDF"]} />
  </>,
  <>
    <p className="jd__title">Acolhimento 24h, consultas agendadas</p>
    <Tags items={["0800 · 24h", "Medy", "Consultas agendadas"]} />
    <p className="jd__text">Conteúdos de autoconhecimento e autocuidado também ficam disponíveis no app.</p>
  </>,
];

export function Journey() {
  const scene = useSceneMode();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);

  useTrackProgress(
    track,
    (p) => {
      const s = Math.min(N - 1, Math.floor(p * N * 0.999 + 0.0001));
      setStep((prev) => (prev === s ? prev : s));
    },
    scene,
  );

  const go = useCallback(
    (i: number) => {
      const t = Math.max(0, Math.min(N - 1, i));
      if (scene && track.current) scrollTrackTo(track.current, (t + 0.5) / N, reduced);
      else setStep(t);
    },
    [scene, reduced],
  );

  const onTouchStart = (e: React.TouchEvent) => (touch.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (scene || touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 48) go(step + (dx < 0 ? 1 : -1));
    touch.current = null;
  };

  const current = JOURNEY.steps[step];

  return (
    <section
      id="experiencia"
      className={`journey ${scene ? "journey--scene" : "journey--stepper"}`}
      aria-labelledby="journey-title"
    >
      <div className="container journey__intro">
        <div className="section-head">
          <p className="hat reveal">{JOURNEY.hat}</p>
          <h2 id="journey-title" className="h2 reveal" style={{ ["--d" as string]: "80ms" }}>
            {JOURNEY.title}
          </h2>
          <p className="lead reveal" style={{ ["--d" as string]: "160ms" }}>
            {JOURNEY.description}
          </p>
        </div>
        <div className="journey__aside reveal" style={{ ["--d" as string]: "240ms" }}>
          <dl className="journey__note">
            {JOURNEY.note.map((n) => (
              <div key={n.label}>
                <dt>{n.label}</dt>
                <dd>{n.text}</dd>
              </div>
            ))}
          </dl>
          <a className="link journey__skip" href="#empresa">
            {JOURNEY.skip}
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>

      <div
        ref={track}
        className="journey__track"
        style={scene ? { height: `${N * 80 + 100}vh` } : undefined}
      >
        <div className="journey__stage">
          <div className="container journey__grid">
            <div className="journey__text">
              <span className="perspective-chip">
                <span className="perspective-chip__dot" /> Perspectiva do colaborador
              </span>

              <div className="journey__counter" aria-hidden="true">
                <span className="journey__count">
                  {String(step + 1).padStart(2, "0")}
                  <small>/ {String(N).padStart(2, "0")}</small>
                </span>
                <span className="journey__bar">
                  <i style={{ transform: `scaleX(${(step + 1) / N})` }} />
                </span>
              </div>
              {!scene && (
                <p className="sr-only" aria-live="polite">
                  Passo {step + 1} de {N}: {current.title}
                </p>
              )}

              <ol className="journey__steps">
                {JOURNEY.steps.map((s, i) => (
                  <li
                    key={s.title}
                    className={`jstep ${i === step ? "is-active" : ""} ${i < step ? "is-past" : ""}`}
                    hidden={!scene && i !== step ? true : undefined}
                    aria-current={i === step ? "step" : undefined}
                  >
                    <h3 className="h3 jstep__title">
                      <span className="sr-only">Passo {i + 1} de {N}: </span>
                      {s.title}
                    </h3>
                    <p className="body-3 jstep__text">{s.text}</p>
                    <p className="sr-only">{s.screen}</p>
                  </li>
                ))}
              </ol>

              <div className="journey__controls">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => go(step - 1)}
                  disabled={step === 0}
                  aria-label="Passo anterior"
                >
                  <ArrowLeft />
                </button>
                <div className="journey__dots" role="group" aria-label="Escolher passo">
                  {JOURNEY.steps.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      className={`dot ${i === step ? "is-on" : ""} ${i < step ? "is-past" : ""}`}
                      aria-label={`Passo ${i + 1}: ${s.title}`}
                      aria-current={i === step ? "step" : undefined}
                      onClick={() => go(i)}
                    >
                      <span />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => go(step + 1)}
                  disabled={step === N - 1}
                  aria-label="Próximo passo"
                >
                  <ArrowRight />
                </button>
              </div>
              <p className="journey__now" aria-hidden="true">
                <span>Passo atual</span> {current.title}
              </p>
            </div>

            <div className="journey__device" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div className="journey__glow" aria-hidden="true" />
              <PhoneFrame step={step} />
              <span className="demo-badge journey__demo">Demonstração ilustrativa</span>
            </div>

            <aside className="journey__detail" aria-label="Detalhes do passo atual">
              {DETAILS.map((d, i) => (
                <div
                  key={i}
                  className={`jd ${i === step ? "is-active" : ""}`}
                  hidden={i !== step ? true : undefined}
                >
                  {d}
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
