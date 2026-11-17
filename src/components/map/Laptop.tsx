"use client";

import { useEffect, useRef, useState } from "react";
import { COMPANY, DEMO_ACCESS, DEMO_FOLLOWUP, INDICATORS } from "@/content/site";
import { BarChart, LineChart, ProportionChart } from "./Charts";
import { LogoMark } from "../Logo";

const TABS = INDICATORS.items;

/** Resumo do mês mais recente para cada aba (derivado dos dados fictícios). */
const pct = (a: number, b: number) => Math.round(((a - b) / b) * 100);
const KPI = [
  { value: DEMO_ACCESS[5], suffix: "", label: "pessoas em junho", delta: `+${pct(DEMO_ACCESS[5], DEMO_ACCESS[4])}% vs. maio` },
  { value: DEMO_FOLLOWUP[5], suffix: "", label: "em acompanhamento em junho", delta: `+${pct(DEMO_FOLLOWUP[5], DEMO_FOLLOWUP[4])}% vs. maio` },
];

/** Contagem animada ao trocar de aba (instantânea com movimento reduzido). */
function CountUp({ to, suffix, run }: { to: number; suffix: string; run: number }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      setN(Math.round(to * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run]);
  return (
    <>
      {n}
      {suffix}
    </>
  );
}

/** Notebook com o painel corporativo — somente indicadores agregados. */
export function Laptop({ interactive = true }: { interactive?: boolean }) {
  const [tab, setTab] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = TABS.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      setTab(next);
      refs.current[next]?.focus();
    }
  };

  return (
    <div className="laptop">
      <div className="laptop__lid">
        <span className="laptop__cam" aria-hidden="true" />
        <div className="laptop__screen">
          <div className="dash">
            <aside className="dash__side" aria-hidden="true">
              <span className="dash__brand">
                <LogoMark className="dash__logo" />
                <b>iMédicos</b>
              </span>
              <span className="dash__nav is-on">Indicadores</span>
              <span className="dash__nav">Pesquisa Saúde</span>
              <span className="dash__nav">Ações educativas</span>
              <span className="dash__nav">Relatórios</span>
              <span className="dash__note">Indicadores de utilização do programa</span>
            </aside>
            <div className="dash__main">
              <div className="dash__head">
                <div>
                  <p className="dash__kicker">Painel da empresa</p>
                  <p className="dash__title">{COMPANY.laptopLabel}</p>
                </div>
                <span className="demo-badge">{INDICATORS.badge}</span>
              </div>

              <div className="dash__tabs" role="tablist" aria-label="Indicadores do painel">
                {TABS.map((t, i) => (
                  <button
                    key={t.id}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`dash-tab-${i}`}
                    aria-selected={tab === i}
                    aria-controls={`dash-panel-${i}`}
                    tabIndex={interactive ? (tab === i ? 0 : -1) : -1}
                    className={`dash__tab ${tab === i ? "is-on" : ""}`}
                    onClick={() => setTab(i)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    {t.tab}
                  </button>
                ))}
              </div>

              {TABS.map((t, i) => (
                <div
                  key={t.id}
                  role="tabpanel"
                  id={`dash-panel-${i}`}
                  aria-labelledby={`dash-tab-${i}`}
                  hidden={tab !== i}
                  className="dash__panel"
                >
                  <div className="dash__panel-head">
                    <span className="dash__q">{t.q}</span>
                    <span className="dash__unit">
                      {t.unit} · {INDICATORS.period}
                    </span>
                  </div>
                  {i < 2 && (
                  <div className="dash__kpi" aria-hidden="true">
                    <b>{tab === i ? <CountUp to={KPI[i].value} suffix={KPI[i].suffix} run={tab} /> : `${KPI[i].value}${KPI[i].suffix}`}</b>
                    <span>{KPI[i].label}</span>
                    <em>{KPI[i].delta}</em>
                  </div>
                  )}
                  <div className="dash__chart">
                    {i === 0 && <BarChart compact id="lap-bar" />}
                    {i === 1 && <LineChart compact id="lap-line" />}
                    {i === 2 && <ProportionChart compact id="lap-prop" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="laptop__base" aria-hidden="true">
        <span className="laptop__notch" />
      </div>
    </div>
  );
}
