import { MAPPING } from "@/content/site";
import { Compass, Form, Lock, Share } from "./Icons";

const ICONS = { share: Share, form: Form, compass: Compass } as const;

/** Padrão de QR decorativo (não funcional). Determinístico para não variar entre renders. */
function DemoQr() {
  const n = 21;
  const cells: [number, number][] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) if (!finder(x, y) && rnd() > 0.52) cells.push([x, y]);
  const Finder = ({ x, y }: { x: number; y: number }) => (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width="6" height="6" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x={x + 2} y={y + 2} width="3" height="3" rx="0.6" fill="currentColor" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="qr" aria-hidden="true">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + 0.1} y={y + 0.1} width="0.8" height="0.8" rx="0.2" fill="currentColor" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={n - 7} y={0} />
      <Finder x={0} y={n - 7} />
    </svg>
  );
}

export function Mapping() {
  return (
    <section id="pesquisa" className="section mapping" aria-labelledby="mapping-title">
      <div className="container">
        <div className="mapping__top">
          <div className="section-head">
            <p className="hat reveal">{MAPPING.hat}</p>
            <h2 id="mapping-title" className="h2 reveal" style={{ ["--d" as string]: "80ms" }}>
              {MAPPING.title}
            </h2>
            <p className="lead reveal" style={{ ["--d" as string]: "160ms" }}>
              {MAPPING.description}
            </p>
          </div>

          {/* Composição: convite (QR) + relatório agregado */}
          <div className="mapping__visual reveal" style={{ ["--d" as string]: "200ms" }}>
            <div className="invite-card" aria-hidden="true">
              <div className="invite-card__head">
                <span className="invite-card__brand">Pesquisa Saúde</span>
                <span className="demo-badge">QR ilustrativo</span>
              </div>
              <DemoQr />
              <p className="invite-card__title">Convite à equipe</p>
              <div className="invite-card__channels">
                <span>WhatsApp</span>
                <span>E-mail</span>
                <span>SMS</span>
              </div>
            </div>

            <figure className="report-card">
              <div className="report-card__head">
                <span className="report-card__kicker">Relatório do grupo</span>
                <span className="report-card__sub">Análise das respostas pela TopMed</span>
              </div>
              <div className="report-card__stat">
                <div className="report-card__value" aria-hidden="true">
                  <span>{MAPPING.highlight.value}</span>
                  <svg viewBox="0 0 120 120" className="report-card__ring">
                    <circle cx="60" cy="60" r="52" className="ring-bg" />
                    <circle cx="60" cy="60" r="52" className="ring-fg" pathLength={100} strokeDasharray="73 100" />
                  </svg>
                </div>
                <figcaption className="report-card__caption">
                  <span className="report-card__tag">Exemplo de um grupo</span>
                  {MAPPING.highlight.caption}
                </figcaption>
              </div>
              <blockquote>
                <p>“{MAPPING.highlight.text}”</p>
              </blockquote>
              <p className="report-card__note">
                <Lock /> {MAPPING.privacy}
              </p>
            </figure>
          </div>
        </div>

        <ol className="mapping__steps">
          {MAPPING.points.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <li key={p.title} className="step-card reveal" style={{ ["--d" as string]: `${i * 120}ms` }}>
                <div className="step-card__top">
                  <span className="step-card__num" aria-hidden="true">0{i + 1}</span>
                  <span className="step-card__icon"><Icon /></span>
                </div>
                <h3 className="h5">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {p.title}
                </h3>
                <p className="muted">{p.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
