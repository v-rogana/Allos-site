"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#B84060",
  category: "Formulação",
  activeCompetency: "Interpretação",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#pratica", label: "Na Prática" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Interpretar com",
  ctaTitleAccent: "precisão",
  ctaText: "Captar o momento certo para intervir, aprofundando da forma correta, sem perder a força do que foi dito.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "Capacidade",
      titleAccent: "Interpretativa",
      content: [
        { type: "paragraph", text: "Trata-se da capacidade de interpretar com precisão o que é dito, seja na fala, no texto ou no corpo do paciente. É a habilidade de identificar ganchos e, mais ainda, saber escolher em qual deles aprofundar." },
        { type: "insight", text: "Isso exige distinguir o que é central do que é periférico em cada fala. É uma interseção entre capacidade de aprofundamento e timing: captar o momento certo para intervir, aprofundando da forma correta, sem perder a força do que foi dito." },
        { type: "paragraph", text: "Trata-se de uma escuta frase a frase, palavra a palavra, corpo a corpo, atenta a cada movimento da narrativa." },
      ],
    },
    {
      id: "pratica",
      label: "Na Prática",
      title: "A Arte da",
      titleAccent: "Priorização",
      content: [
        { type: "example", label: "Exemplo clínico", text: "Paciente diz: \"Estou parando de fazer exercícios, justamente porque meu trabalho está pesado, minha barriga continua crescendo. Como vou explicar para a minha namorada?\"" },
        { type: "paragraph", text: "A questão central aqui não é o trabalho nem o corpo — é a relação com a namorada. Se o terapeuta decide falar sobre aceitação corporal nesse momento, erra a interpretação do que está em jogo." },
        { type: "cards", items: [
          { title: "Identificar ganchos", text: "Em cada fala do paciente existem múltiplos pontos de entrada. O terapeuta precisa percebê-los em tempo real — na fala, no tom, no gesto." },
          { title: "Priorizar", text: "Nem todo gancho merece ser explorado naquele momento. A capacidade interpretativa inclui saber qual gancho é central e qual é periférico." },
          { title: "Escolher o timing", text: "Mesmo o gancho certo perde força se explorado no momento errado. A interpretação e o timing são indissociáveis." },
        ]},
        { type: "warning", text: "O erro mais comum não é a falta de percepção dos ganchos, mas a escolha equivocada de qual aprofundar — interpretando o periférico como central." },
      ],
    },
  ],
};

export default function InterpretacaoContent() {
  return <DidaticTemplate data={DATA} />;
}
