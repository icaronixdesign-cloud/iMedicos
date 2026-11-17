import { readFile } from "node:fs/promises";
import path from "node:path";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Overview } from "@/components/Overview";
import { Mapping } from "@/components/Mapping";
import { Journey } from "@/components/journey/Journey";
import { CompanyMap } from "@/components/map/CompanyMap";
import { Education } from "@/components/Education";
import { Faq } from "@/components/Faq";
import { Credentials, FinalCta, Footer } from "@/components/Closing";
import { RevealObserver } from "@/components/RevealObserver";
import { MobileCta } from "@/components/MobileCta";

/** SVG do Brasil (mesmo traçado de UFs do projeto BLT) para o mapa estático. */
async function loadBrazilSvg() {
  "use cache";
  const raw = await readFile(path.join(process.cwd(), "public/mapa/brasil.svg"), "utf8");
  return raw
    .replace(/<svg[^>]*>/, '<svg viewBox="0 0 580 590" xmlns="http://www.w3.org/2000/svg" focusable="false">')
    .replace(/ fill="(?!none)[^"]*"/g, "");
}

export default async function Page() {
  const svg = await loadBrazilSvg();
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Overview />
        <Mapping />
        <Journey />
        <CompanyMap svg={svg} />
        <Education />
        <Faq />
        <Credentials />
        <FinalCta />
      </main>
      <Footer />
      <MobileCta />
      <RevealObserver />
    </>
  );
}
