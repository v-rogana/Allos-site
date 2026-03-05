"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#D4854A",
  category: "Relação",
  activeCompetency: "Segurança no Método",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#modalidades", label: "Modalidades" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Método que",
  ctaTitleAccent: "convence",
  ctaText: "Mostrar ao paciente o que está sendo feito, como funciona e como se conecta à sua questão — isso é segurança do método.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "Segurança do",
      titleAccent: "Método",
      content: [
        { type: "paragraph", text: "Refere-se à capacidade do terapeuta de transmitir confiança na abordagem ou posição que utiliza, seja de forma explícita ou implícita, convencendo o paciente de que o processo terapêutico proposto é adequado e eficaz para suas demandas." },
        { type: "insight", text: "É a habilidade de mostrar ao paciente o que está sendo feito na terapia, como funciona o processo e de que forma isso se conecta com a questão que ele trouxe." },
        { type: "question", text: "Se coloque no lugar do paciente. Implícita ou explicitamente, ficou claro o porquê, como — ou, no mínimo, o quê — o que seu terapeuta propôs como intervenção vai te ajudar? Você seria aderente ao tratamento?" },
      ],
    },
    {
      id: "modalidades",
      label: "Dois Caminhos",
      title: "Método Explícito",
      titleAccent: "& Implícito",
      content: [
        { type: "comparison", left: { title: "Método Explícito", text: "O terapeuta descreve diretamente como aspectos do seu método funcionam e como ele se aplica ao caso do paciente. Cria previsibilidade e segurança — especialmente útil para pacientes que precisam de clareza sobre o \"como\" e \"porquê\" do processo. Mais fácil de executar." }, right: { title: "Método Implícito", text: "O terapeuta aplica a teoria sem explicitar, confiando que a prática demonstrará sua eficácia. Demonstra o método na prática e produz efeitos. Exemplo: corte lacaniano — a intervenção é o método em ação, sem necessidade de explicação prévia." } },
        { type: "example", label: "Analogia médica", text: "Se eu vou ao médico e ele me explica por que devo tomar determinado remédio, como ele atua e de que forma pode me ajudar, é mais provável que eu me mantenha aderente ao tratamento. O mesmo princípio vale para a psicoterapia." },
      ],
    },
  ],
};

export default function SegurancaMetodoContent() {
  return <DidaticTemplate data={DATA} />;
}
