"use client";
import DidaticTemplate, { type DidaticPageData } from "../DidaticTemplate";

const DATA: DidaticPageData = {
  accentColor: "#B84060",
  category: "Formulação",
  activeCompetency: "Aprofundar / Investigação",
  navItems: [
    { href: "#conceito", label: "Conceito" },
    { href: "#demanda", label: "Demanda Real" },
    { href: "#esquemas", label: "Esquemas" },
    { href: "#competencias", label: "Competências" },
  ],
  ctaTitle: "Aprofundar com",
  ctaTitleAccent: "propósito",
  ctaText: "Ir além da queixa inicial é o primeiro passo para revelar as raízes do sofrimento e transformar a prática clínica.",
  sections: [
    {
      id: "conceito",
      label: "Conceito Fundamental",
      title: "A Capacidade de",
      titleAccent: "Aprofundar",
      content: [
        { type: "paragraph", text: "Trata-se de uma estratégia clínica para ir além do conteúdo explícito, explorando a demanda real subjacente — muitas vezes não articulada. Essa transição não é uma negação da queixa do paciente, mas um movimento para revelar as raízes do sofrimento, conectando-o a conflitos internos, valores, escolhas ou padrões de vida que o paciente ainda não reconhece." },
        { type: "insight", text: "O papel da terapia é produzir um novo tipo de sofrimento — transformando um sofrimento neurótico (sofre sem saber o porquê) em um sofrimento genuíno (sofre e sabe o porquê). Ele deixa de sofrer pelas decisões que outros tomaram por ele e passa a sofrer pelas escolhas que ele mesmo está fazendo." },
        { type: "paragraph", text: "Antes de aceitar indiscriminadamente a queixa inicial do paciente, há um trabalho de aprofundamento e enriquecimento do conteúdo para compreender a totalidade do problema — investigando o que está por trás ou liga-se à demanda apresentada." },
      ],
    },
    {
      id: "demanda",
      label: "Demanda Explícita vs. Real",
      title: "Da Queixa à",
      titleAccent: "Raiz",
      content: [
        { type: "paragraph", text: "Todo mundo possui, em algum nível, uma estrutura interna de aprofundamento. Mesmo que a maioria das pessoas não tenha consciência disso, essa estrutura existe, pois há uma necessidade natural de dar sentido às experiências e de se aprofundar nas conversas." },
        { type: "paragraph", text: "O esquema de aprofundamento é uma forma de organizar o processo dialético entre pergunta e resposta na psicoterapia: não se trata só do conteúdo das perguntas (o \"o quê\"), mas da estrutura e da lógica do perguntar (o \"como\") para que o paciente gere conteúdo próprio — lembrando que o objetivo central é que o paciente produza material que permita compreender e transformar a experiência subjetiva." },
        { type: "quote", text: "Cada modelo de aprofundamento é um \"mapa\" de como orientar o movimento dialético entre terapeuta e paciente." },
      ],
    },
    {
      id: "esquemas",
      label: "Esquemas de Aprofundamento",
      title: "7 Formas de",
      titleAccent: "Aprofundar",
      content: [
        { type: "heading", text: "1. Aprofundamento Lateralizado" },
        { type: "paragraph", text: "Trata-se de aprofundar-se pouco em vários temas distintos, colocando-os de lado para usar novamente em outro momento da sessão." },
        { type: "example", label: "Exemplo", text: "Como vai sua família? E seu trabalho? E seu relacionamento? E o seu cachorro?" },
        { type: "comparison", left: { title: "❌ Mal uso", text: "Fazer várias perguntas sobre diferentes áreas sem dar significado a nenhuma delas. Acaba perdendo ganchos importantes porque internalizou a ideia de que atendimento é apenas uma análise geral da vida." }, right: { title: "✦ Uso correto", text: "Do conteúdo para a forma: ajudar o paciente a perceber que todos os temas apontam para um mesmo padrão. É como se o \"boss do jogo\" estivesse sendo evitado — no relacionamento ele foge do diálogo, no trabalho evita uma decisão." } },
        { type: "divider" },

        { type: "heading", text: "2. Aprofundamento até o Primeiro Gancho" },
        { type: "paragraph", text: "Você conduz a conversa, deixando a pessoa falar livremente, até encontrar o primeiro gancho — um ponto que chama atenção. A partir daí, aprofunda nesse tema e surge outro gancho, e outro, e assim vai. É um movimento de aprofundamento vertical, em direção a diversos núcleos." },
        { type: "divider" },

        { type: "heading", text: "3. Suprassunção Dialética" },
        { type: "paragraph", text: "Quando o paciente se vê dividido entre duas opções — A ou B —, o trabalho não é escolher entre elas, mas compreender que a própria tensão entre A e B pode apontar para uma terceira via, que é A e B também. Uma síntese que contém elementos essenciais de ambas." },
        { type: "example", label: "Exemplo — Casar-se ou comprar uma bicicleta?", text: "Não é apenas uma escolha prática entre estilos de vida. O que está em jogo são valores internos — compromisso, pertencimento, liberdade, autonomia. A resposta não está em optar por um ou outro, mas em descobrir como esses valores podem coexistir. Um símbolo conciliador: \"casar-se e descobrir que o amor também pode ser libertador\"." },
        { type: "divider" },

        { type: "heading", text: "4. Significante Mestre" },
        { type: "paragraph", text: "Você escolhe qualquer ponto da vida da pessoa — o \"X\" no mapa — e começa a escavar ali. Não importa qual seja: qualquer área da vida carrega a estrutura central que organiza a experiência daquela pessoa. Seja amizade, trabalho, família ou valores, tudo ecoa a mesma estrutura de sentido." },
        { type: "insight", text: "O ponto de partida é quase irrelevante. O que importa não é escolher o lugar certo para cavar, mas a capacidade de cavar fundo, de sustentar o processo até encontrar a estrutura que organiza o sofrimento." },
        { type: "divider" },

        { type: "heading", text: "5. Circunvolução" },
        { type: "paragraph", text: "Semelhante ao movimento de abutres: você começa de maneira aparentemente aleatória, orbitando a partir de experiências diversas, mas sempre ao redor de um núcleo central. É como construir uma espiral que, a cada volta, mergulha mais fundo, enriquecendo a narrativa com novas camadas de sentido." },
        { type: "paragraph", text: "Consiste em ver toda a vida do paciente em torno de um tema específico, criando paralelos simbólicos com filmes, músicas, vivências — e, a partir disso, retornar ao texto original com uma inflexão nova, revelando algo que não era óbvio antes." },
        { type: "example", label: "Exemplo", text: "Um paciente que se vê como \"corno sofredor\" pode, ao escutar Wesley Safadão, perceber que existe a possibilidade de ser \"corno, mas feliz\" — alguém que, mesmo traído, não se define apenas por isso. A validação da inflexão só é possível a posteriori." },
        { type: "divider" },

        { type: "heading", text: "6. Aprofundamento Sistêmico" },
        { type: "paragraph", text: "Aqui, o objetivo não é resolver o problema — é ampliá-lo. É deixar o problema crescer, se mostrar em sua totalidade e complexidade. Quanto mais você analisa as partes em relação umas às outras, mais sentidos são produzidos." },
        { type: "quote", text: "É como deixar um bolo crescer no forno: se você mexer antes da hora ou tentar \"resolver\" cedo demais, ele afunda e nunca vira bolo." },
        { type: "paragraph", text: "O paciente entra com um problema claro e sai com um problema maior, mais rico, mais cheio de sentidos — e, por isso mesmo, mais próximo da sua realidade psíquica. O novo surge não pela resolução, mas pela reconfiguração das relações entre os elementos do problema." },
        { type: "divider" },

        { type: "heading", text: "7. Resposta Reflexo" },
        { type: "paragraph", text: "Acontece quando o terapeuta devolve ao paciente uma síntese clara e precisa do que foi dito, sem interpretação, mas com articulação. É como segurar um espelho para que o paciente possa se escutar com mais nitidez." },
        { type: "paragraph", text: "Pode envolver retornar uma palavra, um gesto, comparar o que o paciente diz agora com o que disse anteriormente. Não é dar um sentido novo — é organizar o que já está ali, de forma que o próprio paciente possa reconhecer e criar formulações para si." },
        { type: "insight", text: "O paciente se sente escutado em um nível mais fino, mais exato, e essa precisão oferece a ele uma nova forma de pensar sobre si mesmo." },
      ],
    },
  ],
};

export default function AprofundamentoContent() {
  return <DidaticTemplate data={DATA} />;
}
