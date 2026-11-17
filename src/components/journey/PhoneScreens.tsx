import { Calendar, Chat, Doc, Download, Home, Lock, Mail, Mic, Phone, Spark, Video, Check, Clock, Users } from "../Icons";

/**
 * Seis estados de tela do Saúde24h — demonstração ilustrativa com dados fictícios.
 * Uma única moldura; o conteúdo troca dentro dela. `.is-active` dispara as microinterações.
 */

function StatusBar() {
  return (
    <div className="ps-status">
      <span>9:41</span>
      <span className="ps-status__icons">
        <i /> <i /> <b />
      </span>
    </div>
  );
}

function AppBar({ title, back = true }: { title: string; back?: boolean }) {
  return (
    <div className="ps-appbar">
      {back ? <span className="ps-back">‹</span> : <span className="ps-logo">S24h</span>}
      <span className="ps-appbar__title">{title}</span>
      <span className="ps-avatar ps-avatar--me">VC</span>
    </div>
  );
}

function ScreenQuiz() {
  const opts = ["Nunca", "Em alguns dias", "Em mais da metade dos dias", "Quase todos os dias"];
  return (
    <div className="ps ps--quiz">
      <StatusBar />
      <AppBar title="Saúde mental" />
      <div className="ps-body">
        <p className="ps-kicker">Questionário de Saúde Mental</p>
        <div className="ps-progress">
          <span className="ps-progress__bar"><i /></span>
          <span className="ps-progress__label">Etapa: sono</span>
        </div>
        <p className="ps-question">
          Nas últimas duas semanas, com que frequência você teve dificuldade para dormir?
        </p>
        <ul className="ps-options">
          {opts.map((o, i) => (
            <li key={o} className={i === 1 ? "is-picked" : ""}>
              <span className="ps-radio" />
              {o}
            </li>
          ))}
        </ul>
        <span className="ps-cta">Continuar</span>
        <p className="ps-foot">Pergunta ilustrativa</p>
      </div>
    </div>
  );
}

function ScreenMail() {
  return (
    <div className="ps ps--mail">
      <StatusBar />
      <div className="ps-notif">
        <span className="ps-notif__icon"><Mail /></span>
        <span>
          <b>E-mail · agora</b>
          <small>Resultado do teste de Saúde Mental</small>
        </span>
      </div>
      <div className="ps-inbox">
        <div className="ps-appbar ps-appbar--mail">
          <span className="ps-back">‹</span>
          <span className="ps-appbar__title">Caixa de entrada</span>
          <span />
        </div>
        <div className="ps-mail">
          <span className="ps-fict">Exemplo fictício</span>
          <p className="ps-mail__subject">Resultado teste de Saúde Mental</p>
          <p className="ps-mail__from">Equipe de saúde · Saúde24h</p>
          <div className="ps-mail__body">
            <p>Olá!</p>
            <p>
              A análise do seu questionário foi concluída. Preparamos uma devolutiva com os pontos
              de atenção e caminhos de cuidado disponíveis para você.
            </p>
            <span className="ps-mail__line" />
            <span className="ps-mail__line ps-mail__line--s" />
          </div>
          <span className="ps-cta ps-cta--ghost">Ver devolutiva</span>
        </div>
      </div>
    </div>
  );
}

function ScreenSchedule() {
  const days = [
    ["Seg", 12],
    ["Ter", 13],
    ["Qua", 14],
    ["Qui", 15],
    ["Sex", 16],
  ] as const;
  const slots = ["08:00", "09:30", "11:00", "14:30", "16:00", "18:30"];
  return (
    <div className="ps ps--sched">
      <StatusBar />
      <AppBar title="Teleconsulta" />
      <div className="ps-body">
        <div className="ps-pro">
          <span className="ps-avatar ps-avatar--lg">AL</span>
          <span>
            <b>Psicóloga</b>
            <small>Perfil ilustrativo</small>
          </span>
          <span className="ps-pro__check"><Check /></span>
        </div>
        <div className="ps-chips">
          <span className="is-on">50 min</span>
          <span>30 min</span>
          <span>Recorrente</span>
        </div>
        <p className="ps-label"><Calendar /> Escolha o dia</p>
        <div className="ps-days">
          {days.map(([d, n], i) => (
            <span key={d} className={i === 2 ? "is-on" : ""}>
              <small>{d}</small>
              <b>{n}</b>
            </span>
          ))}
        </div>
        <p className="ps-label"><Clock /> Horários disponíveis</p>
        <div className="ps-slots">
          {slots.map((s, i) => (
            <span key={s} className={i === 3 ? "is-pick" : i === 1 ? "is-off" : ""}>{s}</span>
          ))}
        </div>
        <span className="ps-cta">Agendar</span>
      </div>
    </div>
  );
}

function ScreenCall() {
  return (
    <div className="ps ps--call">
      <div className="ps-confirm">
        <StatusBar />
        <div className="ps-confirm__body">
          <span className="ps-confirm__icon"><Check /></span>
          <b>Consulta confirmada</b>
          <small>Qua, 14 · 14:30 · 50 min</small>
          <span className="ps-cta">Entrar na consulta</span>
        </div>
      </div>
      <div className="ps-video">
        <div className="ps-video__remote">
          <span className="ps-video__person" />
          <span className="ps-video__tag">Psicóloga · perfil ilustrativo</span>
          <span className="ps-video__time"><i /> 00:12</span>
        </div>
        <div className="ps-video__self" />
        <div className="ps-video__controls">
          <span><Mic /></span>
          <span><Video /></span>
          <span className="is-end"><Phone /></span>
        </div>
      </div>
    </div>
  );
}

function ScreenPlan() {
  const items = [
    ["Qua, 14", "Consulta · 50 min"],
    ["Qua, 07", "Consulta · 50 min"],
    ["Qua, 30", "Primeira consulta"],
  ];
  return (
    <div className="ps ps--plan">
      <StatusBar />
      <AppBar title="Minhas consultas" />
      <div className="ps-body">
        <div className="ps-tabs">
          <span>Agendadas</span>
          <span className="is-on">Histórico</span>
        </div>
        <ul className="ps-history">
          {items.map(([d, t], i) => (
            <li key={d} className={i === 0 ? "is-open" : ""}>
              <span className="ps-history__date">{d}</span>
              <span className="ps-history__text">{t}</span>
            </li>
          ))}
        </ul>
        <div className="ps-docfile">
          <span className="ps-docfile__icon"><Doc /></span>
          <span className="ps-docfile__text">
            <b>Plano de Cuidado Individual</b>
            <small><Lock /> Assinado digitalmente</small>
          </span>
          <span className="ps-docfile__pdf"><Download /> PDF</span>
        </div>
        <p className="ps-foot">Visível apenas para o colaborador</p>
      </div>
    </div>
  );
}

function ScreenHome() {
  const tiles = [
    { t: "Teleconsulta", i: <Video /> },
    { t: "Ligar para Central", i: <Phone />, hl: true },
    { t: "Chat Equipe Saúde", i: <Chat /> },
    { t: "Minhas consultas", i: <Calendar /> },
    { t: "Assistente Medy", i: <Spark /> },
    { t: "Conteúdos", i: <Users /> },
  ];
  return (
    <div className="ps ps--home">
      <StatusBar />
      <AppBar title="Início" back={false} />
      <div className="ps-body">
        <p className="ps-hello">Como podemos ajudar?</p>
        <div className="ps-tiles">
          {tiles.map((x) => (
            <span key={x.t} className={x.hl ? "is-hl" : ""}>
              {x.i}
              <small>{x.t}</small>
            </span>
          ))}
        </div>
        <div className="ps-medy">
          <div className="ps-medy__head">
            <span className="ps-medy__avatar"><Spark /></span>
            <b>Medy</b>
            <small>Assistente virtual · 24h</small>
          </div>
          <p className="ps-bubble ps-bubble--bot">Olá! O que você sente?</p>
          <p className="ps-bubble ps-bubble--me">Quero conversar com alguém.</p>
          <p className="ps-bubble ps-bubble--bot">Posso indicar o serviço adequado.</p>
        </div>
      </div>
      <nav className="ps-tabbar" aria-hidden="true">
        <span className="is-on"><Home /></span>
        <span><Calendar /></span>
        <span><Chat /></span>
      </nav>
    </div>
  );
}

const SCREENS = [ScreenQuiz, ScreenMail, ScreenSchedule, ScreenCall, ScreenPlan, ScreenHome];

export function PhoneFrame({ step }: { step: number }) {
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone__frame">
        <span className="phone__island" />
        <div className="phone__screen">
          {SCREENS.map((S, i) => (
            <div
              key={i}
              className={`phone__layer ${i === step ? "is-active" : ""} ${i < step ? "is-past" : ""}`}
            >
              <S />
            </div>
          ))}
        </div>
      </div>
      <span className="phone__btn phone__btn--a" />
      <span className="phone__btn phone__btn--b" />
    </div>
  );
}
