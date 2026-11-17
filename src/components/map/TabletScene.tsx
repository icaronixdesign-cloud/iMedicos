"use client";

import { useRef, useState } from "react";
import { DEMO_ACCESS, DEMO_FOLLOWUP, DEMO_RESOLUTION, INDICATORS } from "@/content/site";
import { useTrackProgress } from "@/lib/hooks";
import { LogoMark } from "../Logo";
import { BarChart, LineChart, ProportionChart } from "./Charts";

/**
 * Celular: o tablet fica fixo no centro e a rolagem troca uma tela por vez
 * (Acesso → Acompanhamento → Resolutividade). A tela desliza para o lado, o
 * gráfico anima ao entrar e a explicação do indicador sobe abaixo do aparelho.
 * Dados fictícios (painel ilustrativo).
 */
const ITEMS = INDICATORS.items;
const N = ITEMS.length;
const pct = (a: number, b: number) => Math.round(((a - b) / b) * 100);
const L = (a: number[]) => a[a.length - 1];
const P = (a: number[]) => a[a.length - 2];

const KPI = [
  { value: `${L(DEMO_ACCESS)}`, label: "pessoas em junho", delta: `+${pct(L(DEMO_ACCESS), P(DEMO_ACCESS))}% vs. maio` },
  { value: `${L(DEMO_FOLLOWUP)}`, label: "pessoas em junho", delta: `+${pct(L(DEMO_FOLLOWUP), P(DEMO_FOLLOWUP))}% vs. maio` },
  { value: `${DEMO_RESOLUTION}%`, label: "resolvidos por telemedicina", delta: INDICATORS.period },
];
const VIZ = [BarChart, LineChart, ProportionChart];

export function TabletScene() {
  const track = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useTrackProgress(track, (p) => {
    const s = Math.min(N - 1, Math.floor(p * N * 0.999 + 0.0001));
    setStep((prev) => (prev === s ? prev : s));
  });

  return (
    <div ref={track} className="tscene" style={{ height: `${N * 70 + 100}vh` }}>
      <div className="tscene__stage">
        <div className="tscene__counter" aria-hidden="true">
          <span className="tscene__count">
            {String(step + 1).padStart(2, "0")}
            <small>/ {String(N).padStart(2, "0")}</small>
          </span>
          <span className="tscene__bar">
            <i style={{ transform: `scaleX(${(step + 1) / N})` }} />
          </span>
        </div>

        <div className="tscene__device" aria-hidden="true">
          <span className="tscene__cam" />
          <div className="tscene__screen">
            <div className="tscene__top">
              <span className="tscene__brand">
                <LogoMark className="tscene__logo" />
                iMédicos
              </span>
              <span className="tscene__live">
                <i /> {INDICATORS.period}
              </span>
            </div>
            <div className="tscene__tabs">
              {ITEMS.map((it, i) => (
                <span key={it.id} className={i === step ? "is-on" : ""}>
                  {it.tab}
                </span>
              ))}
              <b className="tscene__tabs-ink" style={{ ["--s" as string]: step }} />
            </div>
            <div className="tscene__layers">
              {ITEMS.map((it, i) => {
                const Viz = VIZ[i];
                return (
                  <div
                    key={it.id}
                    className={`tscreen ${i === step ? "is-active" : ""} ${i < step ? "is-past" : ""}`}
                  >
                    <p className="tscreen__q">{it.q}</p>
                    <div className="tscreen__kpi">
                      <b>{KPI[i].value}</b>
                      <span>{KPI[i].label}</span>
                      <em>{KPI[i].delta}</em>
                    </div>
                    <div className="tscreen__chart">
                      <Viz compact id={`ts-${it.id}`} />
                    </div>
                    <p className="tscreen__unit">
                      {it.unit} · {INDICATORS.period}
                    </p>
                  </div>
                );
              })}
            </div>
            <span className="demo-badge tscene__badge">{INDICATORS.badge}</span>
          </div>
        </div>

        <ol className="tscene__captions">
          {ITEMS.map((it, i) => (
            <li
              key={it.id}
              className={`tcap ${i === step ? "is-active" : ""} ${i < step ? "is-past" : ""}`}
              aria-current={i === step ? "step" : undefined}
            >
              <h3 className="tcap__title">{it.title}</h3>
              <p className="tcap__text">{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
