import { CONTACT, HERO } from "@/content/site";
import { ArrowDown, ArrowRight, Check } from "./Icons";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hat reveal">{HERO.hat}</p>
          <h1 id="hero-title" className="h1 hero__title reveal" style={{ ["--d" as string]: "80ms" }}>
            {HERO.title[0]} <em className="accent-italic">{HERO.title[1]}</em>
          </h1>
          <p className="lead hero__lead reveal" style={{ ["--d" as string]: "160ms" }}>
            {HERO.description}
          </p>
          <div className="btn-row reveal" style={{ ["--d" as string]: "240ms" }}>
            <a className="btn btn--primary" href={CONTACT.mailto}>
              {HERO.primary}
              <ArrowRight />
            </a>
            <a className="btn btn--secondary" href="#solucao">
              {HERO.secondary}
              <ArrowDown />
            </a>
          </div>
          <ul className="hero__checks reveal" style={{ ["--d" as string]: "320ms" }} aria-label="O que a solução reúne">
            {HERO.points.map((p) => (
              <li key={p}>
                <Check /> {p}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>

      <a href="#solucao" className="hero__cue" aria-label="Rolar para a próxima seção: visão geral da solução">
        <span className="hero__cue-line" aria-hidden="true" />
        <span>Role para conhecer</span>
      </a>
    </section>
  );
}
