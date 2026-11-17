import { CONTACT, CTA_LABEL, OVERVIEW } from "@/content/site";
import { ArrowDown, ArrowRight, Compass, Form, Heart } from "./Icons";
import { RailDots } from "./RailDots";

const ICONS = { form: Form, heart: Heart, compass: Compass } as const;
/** Verbo do título ("Conhecer, acolher e acompanhar") associado a cada frente. */
const VERBS = ["Conhecer", "Acolher", "Acompanhar"];

/** Visão geral da solução: apresenta a oferta completa antes do detalhamento. */
export function Overview() {
  return (
    <section id="solucao" className="section overview" aria-labelledby="overview-title">
      <div className="container">
        <div className="overview__head">
          <div className="section-head">
            <p className="hat reveal">{OVERVIEW.hat}</p>
            <h2 id="overview-title" className="h2 reveal" style={{ ["--d" as string]: "80ms" }}>
              {OVERVIEW.title}
            </h2>
          </div>
          <p className="lead overview__lead reveal" style={{ ["--d" as string]: "160ms" }}>
            {OVERVIEW.description}
          </p>
        </div>

        <ol id="overview-rail" className="overview__grid">
          {OVERVIEW.pillars.map((p, i) => {
            const Icon = ICONS[p.icon];
            return (
              <li key={p.title} className="reveal" style={{ ["--d" as string]: `${i * 110}ms` }}>
                <article className="pillar" aria-labelledby={`pillar-${i}`}>
                  <div className="pillar__top" aria-hidden="true">
                    <span className="pillar__verb">{VERBS[i]}</span>
                    <span className="pillar__num">0{i + 1}</span>
                  </div>
                  <div className="pillar__body">
                    <span className="pillar__icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <h3 id={`pillar-${i}`} className="h5 pillar__title">
                      <span className="sr-only">Frente {i + 1}: </span>
                      {p.title}
                    </h3>
                    <p className="pillar__text">{p.text}</p>
                  </div>
                  <a className="pillar__link" href={p.link.href}>
                    <span>{p.link.label}</span>
                    <ArrowDown aria-hidden="true" />
                  </a>
                </article>
              </li>
            );
          })}
        </ol>
        <RailDots targetId="overview-rail" count={OVERVIEW.pillars.length} label="Frentes da solução" />

        <div className="overview__foot">
          <div className="overview__brands reveal">
            <p className="overview__label">{OVERVIEW.brands.label}</p>
            <ol className="roles" aria-label="Papéis das marcas">
              {OVERVIEW.brands.roles.map((r) => (
                <li key={r.name} className="roles__item">
                  <b>{r.name}</b>
                  <span>{r.role}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="overview__proposal reveal" style={{ ["--d" as string]: "120ms" }}>
            <p className="overview__label">{OVERVIEW.proposal.label}</p>
            <p className="overview__text">{OVERVIEW.proposal.text}</p>
            <a className="link overview__cta" href={CONTACT.mailto}>
              {CTA_LABEL}
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
