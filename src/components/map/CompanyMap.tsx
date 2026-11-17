"use client";

import { useEffect, useRef, useState } from "react";
import { COMPANY, INDICATORS, MAP } from "@/content/site";
import { easeInOut, range, useSceneMode } from "@/lib/hooks";
import { BarChart, LineChart, ProportionChart } from "./Charts";
import { Laptop } from "./Laptop";
import { BrazilMapStatic } from "./BrazilMapStatic";
import type { Map3D } from "./map3d";
import { RailDots } from "../RailDots";

/* Linha do tempo da cena (progresso do trilho 0–1) */
const T = {
  appear: [0.2, 0.38],
  shift: [0.38, 0.58],
  routes: [0.58, 0.92],
  anchorMap: 0.58,
};
const TRACK_VH = 520;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function CompanyMap({ svg }: { svg: string }) {
  const sceneWanted = useSceneMode(1024, 640);
  const [glOk, setGlOk] = useState<boolean | null>(null);
  useEffect(() => setGlOk(hasWebGL()), []);
  const [failed, setFailed] = useState(false);
  const scene = sceneWanted && glOk === true && !failed;

  return (
    <div id="empresa" className={`cm ${scene ? "cm--scene" : "cm--flow"}`}>
      {scene ? <Scene svg={svg} onFail={() => setFailed(true)} /> : <Flow svg={svg} />}
      <ChartsBlock />
    </div>
  );
}

/* ---------------------------------------------------------------- Cena (desktop) */

function Scene({ svg, onFail }: { svg: string; onFail: () => void }) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const startSlot = useRef<HTMLDivElement>(null);
  const endSlot = useRef<HTMLDivElement>(null);
  const companyEl = useRef<HTMLDivElement>(null);
  const laptopEl = useRef<HTMLDivElement>(null);
  const mapCopyEl = useRef<HTMLDivElement>(null);
  const legendEl = useRef<HTMLParagraphElement>(null);
  const mapRef = useRef<Map3D | null>(null);
  const [lit, setLit] = useState(0); // regiões conectadas (0–5)
  const [phase, setPhase] = useState<"company" | "moving" | "map">("company");
  const [ready, setReady] = useState(false);

  // carrega o 3D quando a seção se aproxima
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let disposed = false;
    let started = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        mapRef.current?.setRunning(e.isIntersecting);
        if (!e.isIntersecting || started) return;
        started = true;
        try {
          const { createMap3D } = await import("./map3d");
          if (disposed || !canvas.current) return;
          const m = await createMap3D(canvas.current, {
            glb: "/mapa/mapa-brasil.glb",
            motion: true,
          });
          if (disposed) return m.dispose();
          mapRef.current = m;
          measure();
          m.setRunning(true);
          update();
          setReady(true);
        } catch (err) {
          console.warn("Mapa 3D indisponível; usando versão estática.", err);
          onFail();
        }
      },
      { rootMargin: "120% 0px" },
    );
    io.observe(el);
    return () => {
      disposed = true;
      io.disconnect();
      mapRef.current?.dispose();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const measure = () => {
    const st = stage.current?.getBoundingClientRect();
    const a = startSlot.current?.getBoundingClientRect();
    const b = endSlot.current?.getBoundingClientRect();
    if (!st || !a || !b) return;
    mapRef.current?.resize();
    // o Brasil é tão largo quanto alto: a altura respeita a largura do espaço para não invadir o texto
    const fit = (r: DOMRect) => Math.min(r.height, r.width * 0.9);
    mapRef.current?.setFrames(
      { x: a.left - st.left + a.width / 2, y: a.top - st.top + a.height / 2, h: a.height },
      { x: b.left - st.left + b.width / 2, y: b.top - st.top + b.height / 2, h: fit(b) },
    );
  };

  const update = () => {
    const el = track.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const span = r.height - vh;
    const p = Math.min(1, Math.max(0, -r.top / span));
    const enter = Math.min(1, Math.max(0, 1 - r.top / vh)); // 0 quando o trilho aparece embaixo, 1 ao fixar

    const appear = range(p, T.appear[0], T.appear[1]);
    const shift = range(p, T.shift[0], T.shift[1]);
    const routes = range(p, T.routes[0], T.routes[1]);
    const es = easeInOut(shift);

    // notebook: sobe ao entrar e sai pelo alto durante o deslocamento do mapa
    if (laptopEl.current) {
      const ein = easeInOut(enter);
      // fase 1 (surgimento): sobe ~40% da tela e deixa a base no quadro; fase 2: sai pelo alto
      const y = (1 - ein) * 160 - easeInOut(appear) * vh * 0.4 - es * vh * 0.8;
      const s = 0.9 + 0.1 * ein;
      laptopEl.current.style.transform = `translate3d(0, ${y}px, 0) scale(${s})`;
      laptopEl.current.style.opacity = String(Math.min(1, 0.3 + ein) * (1 - range(shift, 0.55, 0.95)));
      laptopEl.current.toggleAttribute("inert", shift > 0.5);
    }
    if (companyEl.current) {
      const out = range(p, T.appear[0] - 0.02, T.appear[0] + 0.12);
      companyEl.current.style.opacity = String(1 - out);
      companyEl.current.style.transform = `translate3d(0, ${-out * vh * 0.3}px, 0)`;
      companyEl.current.toggleAttribute("inert", out > 0.6);
    }
    if (mapCopyEl.current) {
      const inn = range(shift, 0.55, 1);
      mapCopyEl.current.style.opacity = String(inn);
      mapCopyEl.current.style.transform = `translate3d(${(1 - easeInOut(inn)) * -32}px, 0, 0)`;
      mapCopyEl.current.toggleAttribute("inert", inn < 0.4);
    }
    if (legendEl.current) {
      const inn = range(shift, 0.7, 1);
      legendEl.current.style.opacity = String(inn);
      legendEl.current.style.transform = `translate3d(0, ${(1 - easeInOut(inn)) * 12}px, 0)`;
    }
    if (canvas.current) canvas.current.style.opacity = String(Math.min(1, appear * 1.6));

    mapRef.current?.setTargets({ appear, shift, routes });

    // mesmas janelas da cena 3D: origem em 0–0.12, depois 5 rotas de 0.168 cada
    setLit(Math.max(0, Math.min(5, Math.floor((routes - 0.12) / 0.168 + 1e-4))));
    setPhase(shift > 0.85 ? "map" : appear > 0.15 ? "moving" : "company");
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={track} className="cm__track" style={{ height: `${TRACK_VH}vh` }}>
      <span
        id="indicadores"
        className="cm__anchor"
        style={{ top: `calc(${T.anchorMap} * (100% - 100vh))` }}
        aria-hidden="true"
      />
      <div ref={stage} className="cm__stage">
        <canvas ref={canvas} className="cm__canvas" aria-hidden="true" />
        {!ready && <span className="cm__loading" aria-hidden="true" />}

        <span className={`perspective-chip cm__chip ${phase === "map" ? "is-map" : ""} ${phase === "moving" ? "is-moving" : ""}`}>
          <span className="perspective-chip__dot" />
          {phase === "map" ? MAP.scene : "Perspectiva da empresa"}
        </span>

        <div className="container cm__layer">
          <section className="cm__company" ref={companyEl} aria-labelledby="company-title">
            <div className="section-head section-head--center">
              <p className="hat">{COMPANY.hat}</p>
              <h2 id="company-title" className="h2">{COMPANY.title}</h2>
              <p className="lead">{COMPANY.description}</p>
            </div>
          </section>

          <div className="cm__laptop" ref={laptopEl}>
            <Laptop />
          </div>
          <div className="cm__slot cm__slot--start" ref={startSlot} aria-hidden="true" />

          <section className="cm__mapcopy" ref={mapCopyEl} aria-labelledby="map-title">
            <MapCopy lit={lit} />
          </section>
          <div className="cm__slot cm__slot--end" ref={endSlot} aria-hidden="true" />
          <p className="map-legend cm__legend" ref={legendEl}>
            <span className="map-legend__line" aria-hidden="true" />
            {MAP.legend}
          </p>
        </div>
      </div>
    </div>
  );
}

function MapCopy({ lit, all = false }: { lit: number; all?: boolean }) {
  return (
    <>
      <div className="section-head">
        <p className="hat">{MAP.hat}</p>
        <h2 id="map-title" className="h2">{MAP.title}</h2>
        <p className="lead">{MAP.description}</p>
      </div>
      <p className="sr-only">{MAP.a11y}</p>
      <ol className="regions" aria-hidden="true">
        {MAP.regions.map((r, i) => {
          const on = all || i < lit;
          return (
            <li key={r} className={`${on ? "is-on" : ""} ${!all && i === lit ? "is-next" : ""}`}>
              <span className="regions__mark">
                <i />
              </span>
              {r}
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ------------------------------------------------- Fluxo (mobile, reduzido, sem WebGL) */

function Flow({ svg }: { svg: string }) {
  return (
    <>
      <section className="section cm-company" aria-labelledby="company-title">
        <div className="container">
          <span className="perspective-chip reveal">
            <span className="perspective-chip__dot" /> Perspectiva da empresa
          </span>
          <div className="section-head section-head--center">
            <p className="hat reveal">{COMPANY.hat}</p>
            <h2 id="company-title" className="h2 reveal">{COMPANY.title}</h2>
            <p className="lead reveal">{COMPANY.description}</p>
          </div>
          <div className="cm-company__laptop reveal">
            <Laptop />
          </div>
        </div>
      </section>
      <section id="indicadores" className="section cm-map" aria-labelledby="map-title">
        <div className="container cm-map__grid">
          <div className="cm-map__copy reveal">
            <span className="perspective-chip cm-map__chip">
              <span className="perspective-chip__dot" /> {MAP.scene}
            </span>
            <MapCopy lit={5} all />
          </div>
          <figure className="cm-map__visual reveal">
            <BrazilMapStatic svg={svg} />
            <figcaption className="map-legend">
              <span className="map-legend__line" aria-hidden="true" />
              {MAP.legend}
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- Três gráficos */

const CHART_VIZ = { acesso: BarChart, acomp: LineChart, resol: ProportionChart } as const;

function ChartsBlock() {
  return (
    <section className="container charts" aria-labelledby="charts-title">
      <div className="charts__head reveal">
        <h3 id="charts-title" className="h4">{INDICATORS.title}</h3>
        <span className="demo-badge">{INDICATORS.badge}</span>
      </div>
      <ul id="charts-rail" className="charts__grid">
        {INDICATORS.items.map(({ id, title, q, unit, text }, i) => {
          const Chart = CHART_VIZ[id];
          return (
            <li key={id} className="chart-card reveal" style={{ ["--d" as string]: `${i * 100}ms` }}>
              <p className="chart-card__q">{q}</p>
              <h4 className="h5 chart-card__title">{title}</h4>
              <p className="chart-card__meta">
                {unit} · {INDICATORS.period}
              </p>
              <div className="chart-card__viz">
                <Chart id={`c-${id}`} />
              </div>
              <p className="chart-card__read">{text}</p>
            </li>
          );
        })}
      </ul>
      <RailDots targetId="charts-rail" count={INDICATORS.items.length} label="Indicadores" />
    </section>
  );
}
