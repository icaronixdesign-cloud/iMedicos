"use client";

import { useEffect, useState } from "react";
import { CONTACT, CTA_LABEL } from "@/content/site";
import { ArrowRight, Phone } from "./Icons";

/**
 * Barra de ação fixa no mobile: aparece depois da abertura e some quando a
 * chamada final ou o rodapé estão na tela (não duplica botões visíveis).
 */
export function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const end = [document.getElementById("contato"), document.querySelector("footer")].filter(Boolean) as Element[];
    if (!hero) return;
    const state = { heroIn: true, endIn: false };
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) state.heroIn = e.isIntersecting;
        else seen.set(e.target, e.isIntersecting);
      }
      state.endIn = [...seen.values()].some(Boolean);
      setShow(!state.heroIn && !state.endIn);
    });
    io.observe(hero);
    end.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`mcta ${show ? "is-on" : ""}`} aria-hidden={!show} inert={!show}>
      <a className="btn btn--primary mcta__main" href={CONTACT.mailto}>
        {CTA_LABEL}
        <ArrowRight />
      </a>
      <a className="mcta__call" href={CONTACT.tel} aria-label={`Ligar para a iMédicos: ${CONTACT.phoneLabel}`}>
        <Phone />
      </a>
    </div>
  );
}
