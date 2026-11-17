import type { Metadata, Viewport } from "next";
import { Figtree, Source_Serif_4 } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/sections.css";
import "@/styles/journey.css";
import "@/styles/scene.css";
import "@/styles/closing.css";
import "@/styles/refine.css";

const serif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "iMédicos Saúde Emocional | Apoio psicológico para empresas",
  description:
    "Apoio psicológico para empresas: consultas online com psicólogos em horário agendado, acolhimento 24h pela equipe de saúde e educação em saúde para colaboradores. Solicite uma proposta à iMédicos.",
  icons: { icon: "/brand/logo-mark.svg" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
