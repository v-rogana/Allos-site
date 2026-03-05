"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#8B5CF6",
  category: "Performance",
  activeCompetency: "Insight & Potência",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#sinais", label: "Sinais" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Sessões com",
  ctaTitleAccent: "impacto",
  ctaText: "A potência clínica não é sobre técnicas espetaculares — é sobre o paciente sair da sessão transformado, mesmo que sutilmente.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "Potência &",
      titleAccent: "Insight",
      content: [
        { type: "paragraph", text: "Se o seu atendimento foi potente ou gerou algum insight, é possível perceber. Muitas vezes, achamos que nossas intervenções foram potentes, mas isso é fácil de intuir de maneira mais objetiva se nos colocarmos no lugar do paciente." },
        { type: "question", text: "Eu sairia dessa sessão com algo novo? Essa fala me provocaria algo? Se a resposta for não — a intervenção não teve a potência que parecia ter." },
      ],
    },
    {
      id: "sinais",
      label: "Indicadores",
      title: "Sinais de",
      titleAccent: "Potência",
      content: [
        { type: "paragraph", text: "Dá para perceber a potência nas reações do paciente — são sinais observáveis que indicam que algo aterrissou:" },
        { type: "numbered", heading: "Reações que indicam impacto", items: [
          "O sorriso reflexivo: Quando o paciente sorri depois de uma intervenção — não por educação, mas porque algo fez sentido.",
          "O silêncio que pesa: Quando fica em silêncio refletindo — processando algo que não esperava ouvir.",
          "Expressões de reconhecimento: \"Ahhh sim\", \"faz sentido\", \"caramba\", \"wow\" — expressões espontâneas de impacto.",
          "A mudança de postura: O corpo reage antes da mente. Inclinar-se para frente, abrir os olhos, mudar a respiração.",
        ]},
        { type: "divider" },
        { type: "insight", text: "Quando o problema é a falta de insight, tudo pode ser a causa: a estrutura do atendimento, o aprofundamento, o timing, o próprio fato do terapeuta não ser interessante, a falta de match com o paciente. Não existe um único conserto específico, porque o problema pode estar em qualquer competência." },
        { type: "warning", text: "Cuidado com a \"ilusão de potência\" — achar que uma intervenção foi brilhante sem verificar se realmente produziu efeito no paciente. O critério é sempre o impacto real, não a sofisticação da fala." },
      ],
    },
  ],
};

export default function PotenciaInsightContent() {
  return <DidaticTemplate data={DATA} />;
}
