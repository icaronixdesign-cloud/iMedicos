// Conteúdo da landing page — fonte: ajustes_conteudo_imedicos_claude_code.md (17/11/2026),
// arquitetura_informacao_imedicos.md e inventario_conteudo_canva_imedicos.md.
//
// Pendências internas (não publicar no site):
// - Valores DEMO_* são fictícios. Substituir por dados validados antes da publicação
//   e manter o selo "Painel ilustrativo · dados fictícios" enquanto forem fictícios.
// - Confirmar a definição operacional de resolutividade ("sem encaminhamento").
// - Confirmar fonte, período e escopo de cada indicador institucional da TopMed.
// - Validar relação comercial iMédicos/TopMed, serviços incluídos, limites e cobertura.

const MAIL_SUBJECT = "Proposta de saúde emocional para minha empresa";
const MAIL_BODY =
  "Olá, equipe iMédicos.\n\nGostaria de receber uma proposta de saúde emocional.\n\nEmpresa:\nNúmero de colaboradores:\nNecessidades que queremos atender:\n";

export const CONTACT = {
  email: "contato@imedicos.com.br",
  mailto: `mailto:contato@imedicos.com.br?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`,
  phoneLabel: "(35) 99945-8888",
  tel: "tel:+5535999458888",
};

export const NAV = [
  { id: "solucao", label: "Solução" },
  { id: "pesquisa", label: "Pesquisa Saúde" },
  { id: "experiencia", label: "App Saúde24h" },
  { id: "empresa", label: "Indicadores" },
  { id: "educacao", label: "Educação" },
  { id: "duvidas", label: "Dúvidas" },
] as const;

export const CTA_LABEL = "Solicitar proposta";

export const HERO = {
  hat: "Saúde emocional para empresas",
  title: ["Apoio psicológico", "para quem trabalha com você."],
  description:
    "Conheça as necessidades da equipe, ofereça cuidado no dia a dia e acompanhe o programa.",
  primary: CTA_LABEL,
  secondary: "Entender como funciona",
  points: [
    "Acolhimento pela equipe de saúde, 24h.",
    "Consultas online com psicólogos em horário agendado.",
    "Educação em saúde para a equipe.",
  ],
} as const;

export const OVERVIEW = {
  hat: "Uma solução para a equipe e para a gestão",
  title: "Conhecer, acolher e acompanhar.",
  description:
    "Três frentes, ajustadas às necessidades da sua empresa.",
  pillars: [
    {
      title: "Conheça sua equipe",
      text: "A Pesquisa Saúde reúne as respostas dos colaboradores em um relatório do grupo para orientar as prioridades da empresa.",
      link: { href: "#pesquisa", label: "Pesquisa Saúde" },
      icon: "form",
    },
    {
      title: "Ofereça apoio no dia a dia",
      text: "Consultas online com psicólogos em horário agendado e acolhimento pela equipe de saúde no 0800, disponível 24 horas.",
      link: { href: "#experiencia", label: "App Saúde24h" },
      icon: "heart",
    },
    {
      title: "Acompanhe e promova o cuidado",
      text: "Indicadores de utilização apoiam a gestão. Rodas de conversa, lives e cursos levam a educação em saúde à rotina da equipe.",
      link: { href: "#empresa", label: "Indicadores e educação" },
      icon: "compass",
    },
  ],
  brands: {
    label: "Quem é quem",
    // Redação descritiva (documento de ajustes, seção 5): a iMédicos apresenta a solução
    // de saúde emocional da TopMed; o Saúde24h é o app de acesso dos colaboradores.
    roles: [
      { name: "iMédicos", role: "Apresenta a solução" },
      { name: "TopMed", role: "Responsável pela solução de saúde emocional" },
      { name: "Saúde24h", role: "App pelo qual os colaboradores acessam os serviços" },
    ],
  },
  proposal: {
    label: "Sobre a proposta",
    text: "Serviços, limites de consultas e ações educativas são definidos na proposta da sua empresa.",
  },
} as const;

export const MAPPING = {
  hat: "Pesquisa Saúde",
  title: "Entenda as necessidades antes de escolher as ações.",
  description:
    "Conheça o perfil de saúde da equipe e use o relatório do grupo, feito pela TopMed, para priorizar ações de cuidado e educação em saúde.",
  points: [
    {
      title: "Convidar a equipe",
      text: "Divulgue o QR Code ou envie o acesso por WhatsApp, e-mail ou SMS. A TopMed apoia a comunicação da campanha.",
      icon: "share",
    },
    {
      title: "Conhecer o grupo",
      text: "Os colaboradores respondem ao questionário e a TopMed analisa os dados para o relatório do grupo.",
      icon: "form",
    },
    {
      title: "Escolher as ações",
      text: "Use os resultados para discutir programas de acompanhamento, encaminhamentos e temas educativos adequados à equipe.",
      icon: "compass",
    },
  ],
  privacy: "A empresa recebe informações sobre o grupo, sem respostas individuais da pesquisa.",
  highlight: {
    value: "73%",
    text: "Em um dos grupos pesquisados, 73% dos participantes disseram ter interesse em melhorar o estilo de vida.",
    caption: "Caso apresentado no material da Pesquisa Saúde",
  },
} as const;

export const JOURNEY = {
  hat: "Por dentro do app Saúde24h",
  title: "Um caminho simples para buscar apoio.",
  description:
    "No Saúde24h, o colaborador encontra a triagem individual de saúde mental, o agendamento com psicólogos e os canais de acolhimento. Conheça esses recursos na demonstração a seguir.",
  note: [
    { label: "Pesquisa Saúde", text: "orienta as ações da empresa." },
    {
      label: "Triagem individual",
      text: "oferece ao colaborador uma avaliação dos fatores de risco emocional relatados.",
    },
  ],
  skip: "Pular demonstração e ver a visão da empresa",
  steps: [
    {
      title: "Responder à triagem",
      short: "Perguntas sobre sono, humor e ansiedade identificam fatores de risco emocional.",
      text: "Perguntas sobre sono, humor e ansiedade ajudam a identificar fatores de risco emocional.",
      screen: "Na tela: o “Questionário de Saúde Mental” aberto, com uma resposta ilustrativa selecionada e a barra de progresso avançando.",
    },
    {
      title: "Receber o resultado",
      short: "Após análise, o resultado vai para o e-mail do próprio colaborador.",
      text: "Após análise qualificada, o resultado da triagem é enviado ao e-mail do próprio colaborador.",
      screen: "Na tela: uma notificação abre a caixa de entrada com um trecho de e-mail marcado como exemplo fictício.",
    },
    {
      title: "Escolher um psicólogo",
      short: "Profissional, dia e horário escolhidos no Saúde24h, conforme o programa.",
      text: "O colaborador escolhe o psicólogo, o dia e o horário entre as opções disponíveis no Saúde24h, conforme o programa contratado.",
      screen: "Na tela: um perfil de psicóloga ilustrativo e a agenda com um horário disponível em destaque.",
    },
    {
      title: "Entrar na consulta",
      short: "Pelo app ou por link enviado por SMS ou WhatsApp.",
      text: "A sessão acontece pelo app ou pelo link enviado por SMS ou WhatsApp.",
      screen: "Na tela: o agendamento confirmado muda para a videochamada.",
    },
    {
      title: "Consultar o plano de cuidado",
      short: "Plano individual na plataforma, com assinatura digital e PDF.",
      text: "O plano individual fica disponível na plataforma, com assinatura digital do profissional e opção de exportar em PDF.",
      screen: "Na tela: “Minhas consultas”, o histórico e o documento do plano de cuidado em destaque.",
    },
    {
      title: "Encontrar apoio a qualquer hora",
      short: "Acolhimento 24h pelo 0800. Consultas com psicólogo em horário agendado.",
      text: "A equipe de saúde oferece acolhimento pelo 0800, 24 horas por dia. A assistente virtual Medy orienta o acesso aos serviços. As consultas com psicólogo têm horário agendado.",
      screen: "Na tela: a tela inicial com “Ligar para Central” em destaque e uma conversa ilustrativa com a Medy.",
    },
  ],
} as const;

export const COMPANY = {
  hat: "Gestão do programa",
  title: "Visibilidade para acompanhar o programa.",
  description:
    "Entenda quantas pessoas acessam o serviço, quantas estão em acompanhamento e qual parcela dos atendimentos é resolvida por telemedicina. A equipe técnica da TopMed apoia a leitura dos indicadores e a discussão das ações para o grupo.",
  laptopLabel: "Indicadores do programa",
} as const;

export const MAP = {
  hat: "Do atendimento à gestão",
  title: "Uma visão integrada do cuidado da sua equipe.",
  description:
    "O cuidado acontece com cada colaborador. Para a empresa, os indicadores reúnem a visão do programa. Veja abaixo o que cada um permite acompanhar.",
  scene: "Visão integrada do programa",
  legend:
    "Conexões digitais ilustrativas. As rotas não representam volumes de atendimento ou resultados por região.",
  regions: ["Sul", "Sudeste", "Centro-Oeste", "Nordeste", "Norte"],
  a11y:
    "Mapa conceitual do Brasil com conexões animadas do Sul às cinco regiões. A ilustração representa conexão digital, sem indicar utilização, cobertura contratual ou resultados por localidade. Os exemplos de indicadores aparecem nos gráficos a seguir.",
} as const;

// Painel ilustrativo — valores fictícios apenas para demonstrar a visualização.
// Pendência: substituir por dados validados antes da publicação.
export const DEMO_MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
export const DEMO_ACCESS = [120, 148, 176, 162, 204, 231];
export const DEMO_FOLLOWUP = [38, 46, 55, 61, 70, 78];
export const DEMO_RESOLUTION = 82;

/** Três indicadores — mesmas perguntas, unidades e períodos no notebook e nos gráficos. */
export const INDICATORS = {
  title: "Três indicadores para acompanhar o programa",
  // A identificação de demonstração fica nos selos (notebook e cabeçalho dos gráficos).
  badge: "Painel ilustrativo · dados fictícios",
  period: "Jan–Jun",
  items: [
    {
      id: "acesso",
      tab: "Acesso",
      title: "Acesso ao serviço",
      q: "Quantas pessoas acessaram?",
      unit: "Pessoas por mês",
      text: "Acompanhe a utilização do serviço ao longo dos meses para orientar ações de divulgação à equipe.",
    },
    {
      id: "acomp",
      tab: "Acompanhamento",
      title: "Pessoas em acompanhamento",
      q: "Quantas pessoas estão em acompanhamento?",
      unit: "Pessoas em acompanhamento por mês",
      text: "Compare o número de pessoas em acompanhamento a cada mês para apoiar a gestão do programa.",
    },
    {
      id: "resol",
      tab: "Resolutividade",
      title: "Resolutividade",
      q: "Qual parcela dos atendimentos foi resolvida?",
      unit: "% dos atendimentos por telemedicina",
      text: "Entenda a parcela dos atendimentos resolvida por telemedicina, sem encaminhamento, no período analisado.",
    },
  ],
} as const;

export const EDUCATION = {
  hat: "Educação em saúde · Academia TopMed",
  title: "Faça do cuidado uma conversa contínua.",
  description:
    "Complemente o atendimento individual com ações educativas ligadas às necessidades do grupo.",
  themes: ["Saúde mental", "Sono", "Atividade física", "Prevenção"],
  scope: "Os formatos e as ações educativas da sua empresa são definidos na proposta.",
  cards: [
    {
      kind: "Rodas de conversa",
      title: "Abrir espaço para perguntas",
      text: "Um profissional de saúde conduz a conversa sobre um tema combinado com a empresa. Os participantes podem compartilhar dúvidas e discutir o assunto.",
      tags: ["Até 30 participantes", "Até 60 min", "Online"],
    },
    {
      kind: "Lives",
      title: "Levar um tema a mais pessoas",
      text: "Um especialista apresenta o conteúdo em uma palestra online. Na transmissão ao vivo, a equipe pode participar pelo chat.",
      tags: ["Ao vivo ou gravada", "Interação por chat"],
    },
    {
      kind: "Cursos e conteúdos gravados",
      title: "Aprender no próprio ritmo",
      text: "Na área Minha Aprendizagem, o colaborador acessa os conteúdos disponíveis no seu programa. A empresa também pode discutir uma seleção de materiais voltada à liderança.",
      tags: ["Conteúdo sob demanda", "Liderança"],
    },
  ],
} as const;

export const FAQ = {
  hat: "Dúvidas frequentes",
  title: "Respostas para decidir com clareza.",
  description:
    "Entenda a composição da proposta, o acesso ao cuidado e a diferença entre as informações do colaborador e as entregas para a empresa.",
  aside: {
    text: "Quer conhecer as opções para a sua empresa?",
    cta: "Solicitar proposta por e-mail",
  },
  items: [
    {
      q: "O que minha empresa pode contratar?",
      a: "A solução reúne pesquisa de saúde, atendimento psicológico online, acolhimento 24h e educação em saúde. A composição dos serviços, os limites de consultas e as ações educativas são definidos na proposta. O atendimento com psiquiatra é opcional.",
    },
    {
      q: "Qual é a diferença entre a Pesquisa Saúde e a triagem individual? Quem recebe os resultados?",
      a: "A Pesquisa Saúde mapeia o perfil do grupo: a empresa recebe um relatório sobre o grupo, sem respostas individuais. A triagem individual acontece no Saúde24h e ajuda a identificar fatores de risco emocional; o resultado é enviado ao e-mail do próprio colaborador após análise.",
    },
    {
      q: "Como os colaboradores participam da Pesquisa Saúde?",
      a: "A empresa recebe um QR Code para divulgação. Também pode distribuir o código de acesso por WhatsApp, e-mail ou SMS.",
    },
    {
      q: "Como funcionam o acolhimento 24h e as consultas com psicólogo?",
      a: "O 0800 oferece acolhimento pela equipe de saúde a qualquer hora, e a Medy faz triagem virtual 24h. As consultas com psicólogo têm horário agendado: o colaborador escolhe profissional, dia e horário no Saúde24h, com sessões de 30 ou 50 minutos e opção de agendamento recorrente. As condições de acesso e os limites de consultas dependem do programa contratado.",
    },
    {
      q: "A empresa pode personalizar o programa?",
      a: "É possível discutir questões da pesquisa, protocolos de encaminhamento, limites de consultas e temas das ações educativas. A proposta deve indicar as opções disponíveis para a empresa.",
    },
    {
      q: "Como solicitar uma proposta e conhecer os valores?",
      a: "Entre em contato com a iMédicos por e-mail ou telefone e informe o número de colaboradores e as necessidades da sua empresa. A conversa permite alinhar os serviços e as condições comerciais da proposta.",
    },
  ],
} as const;

export const CREDENTIALS = {
  hat: "Indicadores institucionais",
  title: "A experiência da TopMed em saúde digital",
  context:
    "Indicadores institucionais da operação TopMed. Os números abrangem serviços de saúde digital e não representam resultados exclusivos do programa de saúde emocional.",
  center: { kicker: "Operação", name: "TopMed", sub: "Saúde digital" },
  metrics: [
    { value: "NPS 95", label: "Satisfação" },
    { value: "+8 milhões", label: "Atendimentos em 4 anos", note: "¹" },
    { value: "94%", label: "Resolutividade no pronto atendimento digital" },
    { value: "30 segundos", label: "Espera média para atendimento" },
    { value: "91%", label: "Resolutividade em teleconsultas especializadas" },
    { value: "+30", label: "Especialidades médicas" },
  ],
  footnote:
    "¹ Período de quatro anos informado na apresentação institucional da TopMed, fonte de todos os indicadores desta seção.",
} as const;

export const CTA = {
  hat: "iMédicos Saúde Emocional",
  // "o cuidado" fica unido (espaço inseparável) para o destaque não quebrar.
  title: ["Vamos estruturar", "o\u00A0cuidado", "da sua equipe?"],
  description:
    "Conte quantas pessoas trabalham na sua empresa e quais necessidades você quer atender.",
  primary: CTA_LABEL,
  secondary: "Ligar para a iMédicos",
  support: "O próximo passo é uma conversa sobre a sua empresa.",
} as const;
