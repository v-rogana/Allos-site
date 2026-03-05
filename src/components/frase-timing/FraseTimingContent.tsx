"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#8B5CF6",
  category: "Performance",
  activeCompetency: "Frase & Timing",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#elementos", label: "Elementos" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Cada palavra",
  ctaTitleAccent: "importa",
  ctaText: "O modo como se fala transforma completamente o efeito de uma intervenção — entonação, pausa e precisão fazem a diferença.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "Frase &",
      titleAccent: "Timing",
      content: [
        { type: "insight", text: "O principal problema nas intervenções não é a falta de vocabulário, mas a entonação. O modo como se fala transforma completamente o efeito de uma intervenção." },
        { type: "paragraph", text: "É importante adaptar o vocabulário ao estilo do paciente, escolhendo formas de construção de frase que se encaixem melhor à linguagem dele, sem forçar um jeito artificial. O terapeuta não precisa necessariamente falar como o paciente, mas deve ser sensível ao registro linguístico." },
      ],
    },
    {
      id: "elementos",
      label: "Elementos-Chave",
      title: "As Ferramentas da",
      titleAccent: "Voz",
      content: [
        { type: "numbered", heading: "O que observar e modular", items: [
          "Entonação e pausas: Observar a própria entonação durante o atendimento, saber usar pausas estratégicas, modular a voz, destacar palavras tônicas.",
          "Questões abertas vs. fechadas: Questões abertas permitem respostas amplas; questões fechadas limitam as respostas. Cada uma tem seu momento.",
          "Frases curtas vs. longas: Intervenções curtas estimulam a criatividade do paciente; intervenções longas servem para psicoeducar ou testar hipóteses.",
          "Adaptação ao paciente: Escolher formas de construção que se encaixem na linguagem do paciente, sem forçar artificialidade.",
        ]},
        { type: "example", label: "Princípio prático", text: "Quando estou explorando, frases curtas tendem a funcionar melhor. Quando estou explicando ideias, frases mais longas são adequadas. A regra não é fixa — mas a consciência sobre o efeito de cada formato é essencial." },
      ],
    },
  ],
};

export default function FraseTimingContent() {
  return <DidaticTemplate data={DATA} />;
}
