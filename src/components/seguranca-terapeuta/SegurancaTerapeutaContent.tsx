"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#D4854A",
  category: "Relação",
  activeCompetency: "Segurança no Terapeuta",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#indicadores", label: "Indicadores" },
    { href: "#erros", label: "Erros Comuns" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Confiança que se",
  ctaTitleAccent: "demonstra",
  ctaText: "A segurança do terapeuta não é arrogância — é a capacidade de transmitir domínio com humildade e naturalidade.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "Segurança do",
      titleAccent: "Terapeuta",
      content: [
        { type: "paragraph", text: "Trata-se da capacidade de transmitir ao paciente, de forma consistente, confiança e domínio sobre o processo terapêutico, gerando a sensação de que está em mãos competentes." },
        { type: "question", text: "A pessoa passou confiança? Se você ocupasse a posição de paciente, estaria seguro de que ele é competente e sabe o que está fazendo?" },
      ],
    },
    {
      id: "indicadores",
      label: "Indicadores",
      title: "O que Demonstra",
      titleAccent: "Segurança?",
      content: [
        { type: "numbered", heading: "Indicadores de segurança", items: [
          "Fluidez nas intervenções: O terapeuta seguro mantém coerência em sua abordagem, sem trocar abruptamente de técnica ou desviar do modelo teórico.",
          "Conhecimento acessível: Traduzir conceitos complexos em linguagem acessível, vinculando-os à experiência concreta do paciente — sem cair no pedantismo.",
          "Escuta ativa e síntese: Demonstrar não apenas que ouviu, mas que compreendeu as camadas emocionais e contextuais do problema.",
          "Humildade técnica: Compartilhar conceitos e hipóteses sem soar arrogante, admitindo os limites do saber quando necessário — mas sem expor dúvidas de forma gratuita.",
          "Consistência: Clareza e alinhamento entre o que é dito e o que é feito em cada intervenção.",
        ]},
        { type: "paragraph", text: "O terapeuta deve reconhecer suas próprias inseguranças e gerenciá-las para que não contaminem a sessão. Segurança clínica não é ausência de dúvida — é a capacidade de contê-la e manejá-la profissionalmente." },
      ],
    },
    {
      id: "erros",
      label: "Armadilhas",
      title: "Erros que Comprometem a",
      titleAccent: "Confiança",
      content: [
        { type: "cards", items: [
          { title: "Hesitação excessiva", text: "Demonstrar incerteza constante sobre as próprias intervenções transmite ao paciente que o processo não está sendo conduzido com segurança." },
          { title: "Sobrecarregar com teoria", text: "Usar citações teóricas excessivas para \"provar\" competência produz o efeito contrário — o paciente percebe a insegurança por trás da performance intelectual." },
          { title: "Justificar demais", text: "Explicar e justificar excessivamente as próprias escolhas em vez de assumir a responsabilidade clínica com naturalidade fragiliza a autoridade terapêutica." },
        ]},
        { type: "warning", text: "Esses deslizes fragilizam a autoridade terapêutica e podem levar à desconfiança ou à evasão. A segurança se transmite na naturalidade, não na justificação." },
      ],
    },
  ],
};

export default function SegurancaTerapeutaContent() {
  return <DidaticTemplate data={DATA} />;
}
