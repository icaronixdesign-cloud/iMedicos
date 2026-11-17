import { CONTACT, CREDENTIALS, CTA, NAV } from "@/content/site";
import { ArrowRight, ArrowUp, Mail, Phone } from "./Icons";
import { LogoHorizontal, LogoMark } from "./Logo";

/** Ordem de leitura no sentido horário, começando no alto à esquerda. */
const ANGLES = [240, 300, 0, 60, 120, 180];

/**
 * Indicadores institucionais da TopMed. O centro da órbita usa identificação
 * textual (não há logo TopMed aprovado no projeto) para não atribuir os números à iMédicos.
 */
export function Credentials() {
  return (
    <section id="credenciais" className="section creds" aria-labelledby="creds-title">
      <div className="creds__bg" aria-hidden="true" />
      <div className="container creds__grid">
        <div className="creds__copy">
          <div className="section-head">
            <p className="hat reveal">{CREDENTIALS.hat}</p>
            <h2 id="creds-title" className="h2 reveal" style={{ ["--d" as string]: "80ms" }}>
              {CREDENTIALS.title}
            </h2>
          </div>
          <p className="creds__context reveal" style={{ ["--d" as string]: "160ms" }}>
            {CREDENTIALS.context}
          </p>
          <p className="creds__foot reveal" style={{ ["--d" as string]: "220ms" }}>
            {CREDENTIALS.footnote}
          </p>
        </div>

        <figure className="orbit reveal" aria-labelledby="orbit-cap">
          <figcaption id="orbit-cap" className="sr-only">
            Indicadores institucionais da operação TopMed
          </figcaption>
          <div className="orbit__stage">
            <svg className="orbit__ring" viewBox="0 0 600 600" aria-hidden="true">
              <circle cx="300" cy="300" r="250" className="orbit__track" pathLength={1} />
              <circle cx="300" cy="300" r="170" className="orbit__inner" />
            </svg>
            <div className="orbit__center" aria-hidden="true">
              <span className="orbit__id">
                <small>{CREDENTIALS.center.kicker}</small>
                <b>{CREDENTIALS.center.name}</b>
                <small>{CREDENTIALS.center.sub}</small>
              </span>
            </div>
            <ol className="orbit__list">
              {CREDENTIALS.metrics.map((m, i) => (
                <li key={m.value} className="orbit__pill" style={{ ["--a" as string]: `${ANGLES[i]}deg`, ["--i" as string]: i }}>
                  <b>{m.value}</b>
                  <span>
                    {m.label}
                    {"note" in m && m.note ? <sup>{m.note}</sup> : null}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </figure>
      </div>
    </section>
  );
}

/** Encerramento comercial compacto: título, descrição e ações juntos. */
export function FinalCta() {
  return (
    <section id="contato" className="section cta" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta__panel reveal">
          <div className="cta__glow" aria-hidden="true" />
          <LogoMark className="cta__mark" />
          <div className="cta__copy">
            <p className="hat">{CTA.hat}</p>
            <h2 id="cta-title" className="h2 cta__title">
              {CTA.title[0]} <span className="highlight-tag">{CTA.title[1]}</span> {CTA.title[2]}
            </h2>
            <p className="lead cta__lead">{CTA.description}</p>
            <div className="btn-row cta__actions">
              <a className="btn btn--primary" href={CONTACT.mailto}>
                <Mail /> {CTA.primary}
                <ArrowRight />
              </a>
              <a className="btn btn--secondary" href={CONTACT.tel}>
                <Phone /> {CTA.secondary}
              </a>
            </div>
            <p className="cta__support">{CTA.support}</p>
            <p className="cta__contacts">
              <a className="link" href={CONTACT.mailto}>{CONTACT.email}</a>
              <span aria-hidden="true">·</span>
              <a className="link" href={CONTACT.tel}>{CONTACT.phoneLabel}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <LogoHorizontal className="footer__logo" />
            <p>Saúde Emocional</p>
          </div>
          <nav aria-label="Rodapé" className="footer__nav">
            <ul>
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__contact">
            <p className="footer__label">Contato</p>
            <a href={CONTACT.mailto}>
              <Mail /> {CONTACT.email}
            </a>
            <a href={CONTACT.tel}>
              <Phone /> {CONTACT.phoneLabel}
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© 2026 iMédicos Saúde Emocional</p>
          <a href="#inicio" className="footer__top-link">
            Voltar ao início <ArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}

