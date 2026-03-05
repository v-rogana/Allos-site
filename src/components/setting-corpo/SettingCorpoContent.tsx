"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#8B5CF6",
  category: "Performance",
  activeCompetency: "Corpo & Setting",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#elementos", label: "Elementos" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Presença como",
  ctaTitleAccent: "intervenção",
  ctaText: "Cada detalhe do setting comunica ao paciente — do vestuário à iluminação, da postura ao tom de voz.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "Setting &",
      titleAccent: "Corpo",
      content: [
        { type: "paragraph", text: "O setting e o corpo do terapeuta são intervenções em si mesmos. Cada detalhe do ambiente e da presença física comunica algo ao paciente — antes mesmo de qualquer palavra ser dita." },
        { type: "insight", text: "A questão não é apenas \"estar apresentável\", mas entender que vestuário, postura, iluminação, tom de voz e gestos são ferramentas clínicas — e que seu uso (ou descuido) impacta diretamente o processo terapêutico." },
      ],
    },
    {
      id: "elementos",
      label: "O que Importa",
      title: "Elementos do",
      titleAccent: "Setting",
      content: [
        { type: "numbered", heading: "O que observar", items: [
          "Vestuário: Como você se veste comunica profissionalismo, acessibilidade ou distanciamento. Observe também como o paciente está vestido — pode ser informação clínica.",
          "Câmera e posição: Se está mais acima ou abaixo, distante ou próximo, se fica flertando com a própria imagem. A posição da câmera altera a dinâmica de poder.",
          "Iluminação e ambiente: Se está bem iluminado ou se o sol interfere, se o espaço é organizado. O ambiente visual é parte da mensagem.",
          "Voz e microfone: Se a voz é agradável de ouvir, se o microfone e a internet estão em boas condições. Problemas técnicos quebram a conexão.",
          "Comportamentos dispersivos: Passar a mão no cabelo o tempo todo, olhar para o nada, escrever aleatoriamente durante a sessão sem explicar. Cada gesto é lido pelo paciente.",
          "Contato visual: Falar coisas importantes olhando diretamente para a câmera — especialmente em atendimentos online — comunica presença e intenção.",
          "Corpo como intervenção: Utilizar deliberadamente o corpo na sessão — inclinações, gestos, expressões faciais — como ferramenta de comunicação clínica.",
        ]},
        { type: "warning", text: "Escrever durante a sessão sem explicar ao paciente pode gerar insegurança. Se precisar anotar algo, comunique — \"vou anotar isso porque é importante\"." },
      ],
    },
  ],
};

export default function SettingCorpoContent() {
  return <DidaticTemplate data={DATA} />;
}
