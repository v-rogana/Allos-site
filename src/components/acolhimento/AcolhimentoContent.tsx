"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#D4854A",
  category: "Relação",
  activeCompetency: "Acolhimento",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#erros", label: "Erros Comuns" },
    { href: "#abordagens", label: "Abordagens" },
    { href: "#estrategias", label: "Estratégias" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Acolher com",
  ctaTitleAccent: "intenção",
  ctaText: "O acolhimento eficaz não é sobre ser agradável — é sobre ser intencional em cada gesto, reconhecendo que até um silêncio pode ser profundamente acolhedor.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "Sensação de",
      titleAccent: "Acolhimento",
      content: [
        { type: "paragraph", text: "O acolhimento em psicoterapia vai além de gestos superficiais de gentileza ou de criar um ambiente confortável. Trata-se de uma postura intencional, que pode variar desde a escuta empática até intervenções mais diretas ou confrontadoras, desde que estejam alinhadas aos objetivos terapêuticos e às necessidades do paciente." },
        { type: "insight", text: "O que define um acolhimento eficaz não é o tom suave ou a simpatia, mas a capacidade de ajustar a interação para sustentar o vínculo e promover o crescimento." },
        { type: "paragraph", text: "A confrontação, quando bem aplicada, também pode ser uma forma de acolhimento. A chave está na intencionalidade: cada palavra, gesto ou silêncio deve servir a um propósito terapêutico, seja para validar, desafiar ou ampliar a consciência. Tudo isso faz parte do acolhimento." },
      ],
    },
    {
      id: "erros",
      label: "Armadilhas",
      title: "Erros que Destroem o",
      titleAccent: "Acolhimento",
      content: [
        { type: "cards", items: [
          { title: "O \"entendo\" mecânico", text: "Repetir mecanicamente \"entendo\" sem demonstrar verdadeiro engajamento passa a sensação de distanciamento ou falta de interesse — a não ser que seja uma intervenção específica." },
          { title: "A expressão fixa", text: "Balançar a cabeça continuamente ou sorrir incondicionalmente, independente do conteúdo emocional, cria uma dinâmica robótica e sem potência." },
          { title: "Validação automática", text: "Dizer \"isso deve ser difícil\" sem contextualizar às experiências únicas do paciente. O acolhimento perde sentido quando se torna um conjunto de frases prontas." },
        ]},
        { type: "warning", text: "O terapeuta que parece seguir um roteiro pré-definido, em vez de responder organicamente ao que emerge na sessão, compromete a relação terapêutica." },
      ],
    },
    {
      id: "abordagens",
      label: "Variações por Abordagem",
      title: "Acolhimento nas",
      titleAccent: "Diferentes Abordagens",
      content: [
        { type: "comparison", left: { title: "TCC — Diálogo Colaborativo", text: "O acolhimento frequentemente assume a forma de um diálogo colaborativo, estruturado e orientado a objetivos, onde paciente e terapeuta trabalham juntos." }, right: { title: "Humanista — Presença Autêntica", text: "O acolhimento se manifesta na presença autêntica do terapeuta, que reflete emoções sem julgamento e valida a experiência subjetiva do paciente." } },
        { type: "paragraph", text: "Porém, a forma de acolher depende tanto do contexto quanto da abordagem. Não há uma fórmula universal — há uma intenção universal: que o paciente se sinta genuinamente acompanhado em seu processo." },
      ],
    },
    {
      id: "estrategias",
      label: "Estratégias Práticas",
      title: "O Acolhimento",
      titleAccent: "Ideal",
      content: [
        { type: "numbered", heading: "Práticas de acolhimento eficaz", items: [
          "Tom de voz: Ajustar conforme o momento — não manter um tom uniforme durante toda a sessão.",
          "Silêncios estratégicos: Usar silêncios para permitir processamento emocional ou incentivar a autonomia do paciente.",
          "Respostas personalizadas: Contextualizar cada resposta à experiência única daquele paciente, evitando frases genéricas.",
          "Presença integral: Ouvir não apenas as palavras, mas os sinais não verbais e as nuances emocionais.",
        ]},
        { type: "quote", text: "Não se trata de ser sempre \"agradável\", mas de ser intencional em cada gesto, reconhecendo que até um silêncio incômodo ou uma pergunta direta podem ser profundamente acolhedores quando servem ao crescimento do paciente." },
      ],
    },
  ],
};

export default function AcolhimentoContent() {
  return <DidaticTemplate data={DATA} />;
}
