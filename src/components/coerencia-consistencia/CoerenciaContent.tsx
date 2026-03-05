"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#C84B31",
  category: "Estrutura",
  activeCompetency: "Estrutura do Atendimento",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#pratica", label: "Na Prática" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Prática com",
  ctaTitleAccent: "coerência",
  ctaText: "A coerência clínica não é rigidez — é a capacidade de manter uma lógica integrada entre hipóteses, intervenções e postura.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "O que é Coerência",
      titleAccent: "Clínica?",
      content: [
        { type: "paragraph", text: "A coerência e a consistência são competências que transcendem a preferência por uma teoria específica. Elas podem se manifestar na capacidade do psicoterapeuta de estruturar seu trabalho de modo que prática clínica, hipóteses e intervenções sigam uma lógica integrada, mesmo que a base teórica não seja explicitamente declarada." },
        { type: "insight", text: "Não se trata apenas de \"seguir um manual\", mas de garantir que todas as ações no atendimento estejam alinhadas a uma estrutura interna — seja ela derivada de uma teoria formal ou de uma concepção pessoal organizada." },
        { type: "paragraph", text: "No caso do sujeito não possuir teoria de base, a coerência se manifesta na organização interna da sua prática — na consistência entre o que propõe, como investiga e como intervém. A ausência de uma teoria formal não é, por si só, um problema — o problema é a ausência de qualquer lógica estruturante." },
      ],
    },
    {
      id: "pratica",
      label: "Na Prática",
      title: "Como se Manifesta a",
      titleAccent: "Coerência?",
      content: [
        { type: "paragraph", text: "A coerência clínica pode ser observada em múltiplas dimensões do atendimento. É o fio condutor que conecta a abertura da sessão, a condução do processo e o encerramento — garantindo que cada etapa reflita uma lógica interna consistente." },
        { type: "cards", items: [
          { title: "Entre hipótese e intervenção", text: "As intervenções realizadas pelo terapeuta decorrem logicamente das hipóteses formuladas sobre o caso. Não há desconexão entre o que se pensa e o que se faz." },
          { title: "Entre teoria e prática", text: "O referencial teórico, quando existe, se traduz em ações concretas na sessão — não fica apenas no discurso. A prática demonstra a teoria em movimento." },
          { title: "Entre sessões", text: "Há continuidade e progressão entre as sessões. O trabalho de uma sessão se conecta à anterior e prepara a seguinte, criando um arco terapêutico coerente." },
          { title: "Entre discurso e postura", text: "O que o terapeuta diz está alinhado com o que faz. Se propõe acolhimento, sua postura corporal e tom de voz devem refletir isso." },
        ]},
        { type: "warning", text: "Um dos sinais mais claros de falta de coerência é quando o terapeuta troca abruptamente de técnica ou modelo teórico sem justificativa clínica — gerando confusão e insegurança no paciente." },
        { type: "question", text: "Se alguém observasse seu atendimento do início ao fim, conseguiria identificar uma lógica interna? Suas intervenções formariam um todo coerente ou pareceriam desconectadas?" },
      ],
    },
  ],
};

export default function CoerenciaContent() {
  return <DidaticTemplate data={DATA} />;
}
