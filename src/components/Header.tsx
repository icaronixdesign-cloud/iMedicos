"use client";

import { useEffect, useState } from "react";
import { CONTACT, CTA_LABEL, NAV } from "@/content/site";
import { LogoHorizontal } from "./Logo";
import { ArrowRight, Close, Menu } from "./Icons";

/** Seções que acendem cada item do menu (a visão da empresa e o mapa contam como "Indicadores"). */
const SPY: Record<string, string> = {
  solucao: "solucao",
  pesquisa: "pesquisa",
  experiencia: "experiencia",
  empresa: "empresa",
  indicadores: "empresa",
  educacao: "educacao",
  duvidas: "duvidas",
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy: a seção que cruza a linha a 40% da altura da tela fica ativa.
  useEffect(() => {
    const ids = Object.keys(SPY);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const check = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) current = SPY[el.id];
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Menu mobile: Esc fecha e trava a rolagem do fundo enquanto aberto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="container site-header__inner">
        <a href="#inicio" className="site-header__brand" aria-label="iMédicos — voltar ao início" onClick={() => setOpen(false)}>
          <LogoHorizontal />
        </a>

        <nav className="site-nav" aria-label="Principal">
          <ul>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} aria-current={active === n.id ? "location" : undefined}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn--primary btn--sm site-header__cta" href={CONTACT.mailto}>
          {CTA_LABEL}
        </a>

        <button
          type="button"
          className="site-header__toggle icon-btn"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      <div id="menu-mobile" className="mobile-menu" hidden={!open}>
        <nav aria-label="Menu móvel" className="container">
          <ul>
            {NAV.map((n, i) => (
              <li key={n.id} style={{ ["--i" as string]: i }}>
                <a href={`#${n.id}`} onClick={() => setOpen(false)} aria-current={active === n.id ? "location" : undefined}>
                  <span>{n.label}</span>
                  <ArrowRight />
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--primary" href={CONTACT.mailto} onClick={() => setOpen(false)}>
            {CTA_LABEL} <ArrowRight />
          </a>
          <a className="link mobile-menu__phone" href={CONTACT.tel}>
            {CONTACT.phoneLabel}
          </a>
        </nav>
      </div>
    </header>
  );
}
