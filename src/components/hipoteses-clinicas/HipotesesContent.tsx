"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#B84060",
  category: "Formulação",
  activeCompetency: "Hipóteses Clínicas",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#relacoes", label: "Relações" },
    { href: "#dificuldades", label: "Dificuldades" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Formular com",
  ctaTitleAccent: "clareza",
  ctaText: "A hipótese é o guia da sessão — o intermediário que conecta a formulação do caso às interpretações de cada momento.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "Construção de",
      titleAccent: "Hipótese",
      content: [
        { type: "paragraph", text: "Trata-se da capacidade de visualizar o todo, de compreender a questão central do caso e de pensar o que será feito nas próximas sessões. É o intermediário entre a formulação e a interpretação." },
        { type: "insight", text: "Formulação é a construção de leitmotives (motivos/repetições) que atravessam sessões e sua articulação. Interpretação é a capacidade de dar sentido a uma frase, uma ação. A hipótese é o guia da sessão — que precisa ser articulado à formulação e que articula as interpretações." },
        { type: "paragraph", text: "É a habilidade do terapeuta de entender o conjunto da história do paciente, localizar o centro da problemática e formular hipóteses consistentes para o futuro do trabalho terapêutico — avaliando se a formulação está adequada ou não." },
      ],
    },
    {
      id: "relacoes",
      label: "Relações",
      title: "Formulação, Hipótese,",
      titleAccent: "Interpretação",
      content: [
        { type: "cards", items: [
          { title: "Formulação", text: "A construção de leitmotives — padrões e repetições que atravessam sessões. É o mapa macro do caso, a estrutura que organiza a compreensão do paciente." },
          { title: "Hipótese", text: "O guia da sessão. É articulada à formulação e orienta as interpretações. Funciona como um intermediário que traduz a formulação em direção clínica." },
          { title: "Interpretação", text: "A capacidade de dar sentido a uma frase, uma ação, um gesto. É o movimento micro, momento a momento, guiado pela hipótese." },
        ]},
        { type: "example", label: "Exemplo — Manter o foco", text: "Se o caso é sobre abuso, o terapeuta deve conseguir formular o caso como relacionado ao abuso, e não o diluir em temas paralelos como \"segurança do corpo\". A hipótese mantém o terapeuta no centro da questão." },
      ],
    },
    {
      id: "dificuldades",
      label: "Dificuldades Comuns",
      title: "Onde o Terapeuta",
      titleAccent: "Trava?",
      content: [
        { type: "paragraph", text: "Quando há dificuldade em formulação de caso e construção de hipóteses, geralmente o problema está na falta de base teórica, pois, em geral, depende largamente de teoria. A solução é aprofundar a leitura e o estudo de teoria clínica." },
        { type: "warning", text: "A maior dificuldade costuma ser na antecipação do futuro: muitos conseguem entender o presente do caso, mas patinam na projeção dos próximos passos." },
        { type: "question", text: "Você consegue, ao final de uma sessão, antecipar quais serão os próximos movimentos terapêuticos? Sua hipótese sobre o caso orienta concretamente suas intervenções?" },
      ],
    },
  ],
};

export default function HipotesesContent() {
  return <DidaticTemplate data={DATA} />;
}
