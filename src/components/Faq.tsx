"use client";

import { useState } from "react";
import { CONTACT, FAQ } from "@/content/site";
import { Chevron, Mail, Phone } from "./Icons";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" className="section faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__head">
          <div className="section-head">
            <p className="hat reveal">{FAQ.hat}</p>
            <h2 id="faq-title" className="h2 reveal">{FAQ.title}</h2>
            <p className="lead reveal">{FAQ.description}</p>
          </div>
          <div className="faq__aside reveal">
            <p className="faq__aside-text">{FAQ.aside.text}</p>
            <a className="btn btn--primary btn--sm faq__aside-btn" href={CONTACT.mailto}>
              <Mail /> {FAQ.aside.cta}
            </a>
            <a className="link faq__aside-phone" href={CONTACT.tel}>
              <Phone aria-hidden="true" /> {CONTACT.phoneLabel}
            </a>
          </div>
        </div>
        <ul className="faq__list">
          {FAQ.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q} className={`faq-item reveal ${isOpen ? "is-open" : ""}`} style={{ ["--d" as string]: `${i * 60}ms` }}>
                <h3 className="faq-item__h">
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="faq-item__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <span className="faq-item__q">{it.q}</span>
                    <span className="faq-item__icon" aria-hidden="true"><Chevron /></span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq-item__a" inert={!isOpen}>
                  <div>
                    <p>{it.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
