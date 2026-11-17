import { DEMO_ACCESS, DEMO_FOLLOWUP, DEMO_RESOLUTION, INDICATORS } from "@/content/site";
import { LogoMark } from "../Logo";

/**
 * Painel da empresa em resumo, dentro de um tablet — representação usada no
 * celular no lugar do notebook. Dados fictícios (mesmos do painel ilustrativo).
 */
const pct = (a: number, b: number) => Math.round(((a - b) / b) * 100);
const last = (arr: number[]) => arr[arr.length - 1];
const prev = (arr: number[]) => arr[arr.length - 2];

function Bars({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <span className="td-bars">
      {values.map((v, i) => (
        <i
          key={i}
          className={i === values.length - 1 ? "is-hl" : ""}
          style={{ height: `${(v / max) * 100}%`, ["--i" as string]: i }}
        />
      ))}
    </span>
  );
}

function Line({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * 96 + 2, 34 - ((v - min) / (max - min)) * 28]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg className="td-line" viewBox="0 0 100 38">
      <path d={`${d} L${lx} 38 L2 38 Z`} className="td-line__area" />
      <path d={d} className="td-line__path" pathLength={1} />
      <circle cx={lx} cy={ly} r="3" className="td-line__dot" />
    </svg>
  );
}

export function TabletDash() {
  const [acc, acomp, resol] = INDICATORS.items;
  const rows = [
    {
      label: acc.tab,
      value: String(last(DEMO_ACCESS)),
      unit: "pessoas em junho",
      delta: `+${pct(last(DEMO_ACCESS), prev(DEMO_ACCESS))}%`,
      viz: <Bars values={DEMO_ACCESS} />,
    },
    {
      label: acomp.tab,
      value: String(last(DEMO_FOLLOWUP)),
      unit: "pessoas em junho",
      delta: `+${pct(last(DEMO_FOLLOWUP), prev(DEMO_FOLLOWUP))}%`,
      viz: <Line values={DEMO_FOLLOWUP} />,
    },
    {
      label: resol.tab,
      value: `${DEMO_RESOLUTION}%`,
      unit: "por telemedicina",
      delta: null,
      viz: (
        <span className="td-prog">
          <i style={{ width: `${DEMO_RESOLUTION}%` }} />
        </span>
      ),
    },
  ];

  return (
    <figure className="tdash">
      <figcaption className="sr-only">
        Painel ilustrativo com dados fictícios, de janeiro a junho: {last(DEMO_ACCESS)} pessoas acessaram o serviço em
        junho; {last(DEMO_FOLLOWUP)} pessoas em acompanhamento; {DEMO_RESOLUTION}% dos atendimentos resolvidos por
        telemedicina no período.
      </figcaption>
      <div className="tdash__device" aria-hidden="true">
        <span className="tdash__cam" />
        <div className="tdash__screen">
          <div className="tdash__bar">
            <span className="tdash__brand">
              <LogoMark className="tdash__logo" />
              iMédicos
            </span>
            <span className="tdash__live">
              <i /> {INDICATORS.period}
            </span>
          </div>
          <p className="tdash__kicker">Painel da empresa</p>
          <p className="tdash__title">Indicadores do programa</p>
          <ul className="tdash__rows">
            {rows.map((r, i) => (
              <li key={r.label} className="tdash__row" style={{ ["--r" as string]: i }}>
                <span className="tdash__info">
                  <span className="tdash__label">{r.label}</span>
                  <span className="tdash__value">
                    <b>{r.value}</b>
                    <small>{r.unit}</small>
                  </span>
                </span>
                <span className="tdash__viz">
                  {r.viz}
                  {r.delta && <em className="tdash__delta">{r.delta}</em>}
                </span>
              </li>
            ))}
          </ul>
          <span className="demo-badge tdash__badge">{INDICATORS.badge}</span>
        </div>
      </div>
    </figure>
  );
}
