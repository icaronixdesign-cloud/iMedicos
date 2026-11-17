import { DEMO_ACCESS, DEMO_FOLLOWUP, DEMO_MONTHS, DEMO_RESOLUTION } from "@/content/site";

/*
 * Gráficos em SVG — valores fictícios de demonstração (Painel ilustrativo).
 * No notebook (compact) os valores aparecem ao passar o ponteiro; nos cartões
 * os gráficos têm movimento contínuo e discreto (desligado com movimento reduzido).
 */

export function BarChart({ compact = false, id }: { compact?: boolean; id: string }) {
  const max = 250;
  const w = 320;
  const h = compact ? 132 : 168;
  const pad = { l: compact ? 4 : 32, r: 4, t: compact ? 22 : 16, b: 24 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const bw = iw / DEMO_ACCESS.length;
  const ticks = [0, 125, 250];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart chart--bar" role="img" aria-labelledby={`${id}-t`}>
      <title id={`${id}-t`}>
        {`Barras por mês, de janeiro a junho, com pessoas que acessaram o serviço (dados fictícios): ${DEMO_MONTHS.map((m, i) => `${m} ${DEMO_ACCESS[i]}`).join(", ")}.`}
      </title>
      {ticks.map((t) => {
        const y = pad.t + ih - (t / max) * ih;
        return (
          <g key={t}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} className="chart__grid" />
            {!compact && (
              <text x={pad.l - 8} y={y + 4} className="chart__axis" textAnchor="end">
                {t}
              </text>
            )}
          </g>
        );
      })}
      {DEMO_ACCESS.map((v, i) => {
        const bh = (v / max) * ih;
        const x = pad.l + i * bw + bw * 0.2;
        const last = i === DEMO_ACCESS.length - 1;
        return (
          <g key={i} className={`chart__bar ${last ? "is-last" : ""}`} style={{ ["--i" as string]: i }}>
            <rect className="chart__hit" x={pad.l + i * bw} y={pad.t} width={bw} height={ih} />
            <rect x={x} y={pad.t + ih - bh} width={bw * 0.6} height={bh} rx={compact ? 3 : 4} className={`chart__col ${last ? "is-hl" : ""}`} />
            <text x={x + bw * 0.3} y={pad.t + ih - bh - 6} className={`chart__val ${compact ? "chart__val--tip" : ""}`} textAnchor="middle">
              {v}
            </text>
            <text x={x + bw * 0.3} y={h - 6} className="chart__axis" textAnchor="middle">
              {DEMO_MONTHS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function LineChart({ compact = false, id }: { compact?: boolean; id: string }) {
  const max = 100;
  const w = 320;
  const h = compact ? 132 : 168;
  const pad = { l: compact ? 10 : 32, r: 12, t: compact ? 24 : 16, b: 24 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const pts = DEMO_FOLLOWUP.map((v, i) => [pad.l + (i / (DEMO_FOLLOWUP.length - 1)) * iw, pad.t + ih - (v / max) * ih]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${d} L${pts[pts.length - 1][0]} ${pad.t + ih} L${pts[0][0]} ${pad.t + ih} Z`;
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart chart--line" role="img" aria-labelledby={`${id}-t`}>
      <title id={`${id}-t`}>
        {`Linha mensal, de janeiro a junho, com pessoas em acompanhamento no programa (dados fictícios): ${DEMO_MONTHS.map((m, i) => `${m} ${DEMO_FOLLOWUP[i]}`).join(", ")}.`}
      </title>
      {[0, 50, 100].map((t) => {
        const y = pad.t + ih - (t / max) * ih;
        return (
          <g key={t}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} className="chart__grid" />
            {!compact && (
              <text x={pad.l - 8} y={y + 4} className="chart__axis" textAnchor="end">
                {t}
              </text>
            )}
          </g>
        );
      })}
      <path d={area} className="chart__area" />
      <path d={d} className="chart__line" pathLength={1} />
      <path d={d} className="chart__flow" pathLength={1} />
      <circle cx={lx} cy={ly} r={5} className="chart__pulse" />
      {pts.map(([x, y], i) => {
        const last = i === pts.length - 1;
        return (
          <g key={i} className="chart__node" style={{ ["--i" as string]: i }}>
            <rect className="chart__hit" x={x - iw / 10} y={pad.t} width={iw / 5} height={ih} />
            <line className="chart__guide" x1={x} x2={x} y1={pad.t} y2={pad.t + ih} />
            <circle cx={x} cy={y} r={last ? 5 : 3.5} className={`chart__pt ${last ? "is-hl" : ""}`} />
            <text x={x} y={y - 10} className={`chart__val ${compact ? "chart__val--tip" : ""}`} textAnchor="middle">
              {DEMO_FOLLOWUP[i]}
            </text>
            <text x={x} y={h - 6} className="chart__axis" textAnchor="middle">
              {DEMO_MONTHS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function ProportionChart({ compact = false, id }: { compact?: boolean; id: string }) {
  const v = DEMO_RESOLUTION;
  return (
    <div className={`proportion ${compact ? "proportion--compact" : ""}`} role="img" aria-labelledby={`${id}-t`}>
      <span id={`${id}-t`} className="sr-only">
        Barra proporcional: {v}% dos atendimentos resolvidos por telemedicina no período (dado fictício); {100 - v}% com
        encaminhamento.
      </span>
      <div className="proportion__value" aria-hidden="true">
        <b>{v}%</b>
        <span>resolvidos por telemedicina</span>
      </div>
      <div className="proportion__bar" aria-hidden="true">
        <span className="proportion__fill" style={{ width: `${v}%` }} />
        <span className="proportion__rest" style={{ width: `${100 - v}%` }} />
      </div>
      <div className="proportion__legend" aria-hidden="true">
        <span>
          <i className="sw sw--fill" /> Resolvidos · {v}%
        </span>
        <span>
          <i className="sw sw--rest" /> Encaminhados · {100 - v}%
        </span>
      </div>
    </div>
  );
}
