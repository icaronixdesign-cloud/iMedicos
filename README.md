# iMédicos Saúde Emocional — landing page

Next.js 16 · React 19 · TypeScript · three.js (só no mapa, carregado sob demanda).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera a página estática
```

## Estrutura

- `src/content/site.ts` — todos os textos, contatos e indicadores (fonte: arquitetura da informação).
- `src/styles/tokens.css` — paleta, tipografia e espaçamento do style guide do Figma (grade de 8 pt, container 1200 px).
- `src/components/` — seções na ordem da narrativa: `Hero`, `Mapping`, `journey/Journey` (+ `PhoneScreens`), `map/CompanyMap` (notebook → mapa 3D → gráficos), `Education`, `Faq`, `Closing` (CTA com órbita + rodapé).
- `src/components/map/map3d.ts` — cena three.js com o GLB do BLT (`public/mapa/mapa-brasil.glb`). Pins e rotas da BLT ficam ocultos; as conexões a partir do Sul são desenhadas aqui.
- `src/components/map/BrazilMapStatic.tsx` — versão SVG do mapa (mobile, movimento reduzido, sem WebGL).

## Modos de exibição

| Condição | Jornada do app | Notebook + mapa | Educação continuada |
|---|---|---|---|
| ≥ 1024 px de largura, ≥ 640 px de altura, movimento liberado | celular sticky, 6 passos pelo scroll | cena sticky com mapa 3D | cards horizontais pelo scroll |
| Tablet / mobile | stepper com botões, pontos e swipe | painel + mapa SVG em fluxo | carrossel nativo com scroll-snap |
| `prefers-reduced-motion` | stepper sem transições | fluxo estático | cards em sequência |

## Pendências de conteúdo

- **Foto da abertura**: o arco usa uma ilustração provisória. Trocar pela fotografia editorial aprovada (cortes desktop e mobile) em `HeroVisual`.
- **Gráficos e painel**: valores fictícios marcados como ilustrativos em `DEMO_*` (`site.ts`). Substituir por dados validados.
- **Telas do Saúde24h**: construídas em HTML/CSS com a paleta iMédicos; validar com a identidade real do app.
- **Visuais da Educação Continuada**: interfaces ilustrativas; podem receber fotografias com o mesmo tratamento.
