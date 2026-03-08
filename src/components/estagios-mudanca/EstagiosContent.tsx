"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ── tokens ── */
const EASE = [0.22, 1, 0.36, 1] as const;
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const SC = [
  { accent: "#C84B31", label: "Negação" },
  { accent: "#D4854A", label: "Ambivalência" },
  { accent: "#B84060", label: "Planejamento" },
  { accent: "#8B5CF6", label: "Execução" },
  { accent: "#3B82F6", label: "Resistência" },
  { accent: "#10B981", label: "Sentido" },
];

const CAT_COLORS: Record<string, string> = {
  Estrutura: "#C84B31", Relação: "#D4854A", Formulação: "#B84060", Performance: "#8B5CF6",
};

/* ── types ── */
interface BulletItem { text: string }
interface Stage {
  num: string; title: string; sub: string;
  intro: string[];
  bullets: { heading: string; items: BulletItem[] }[];
  examples?: string[];
}

/* ── small helpers ── */
function Grain({ opacity = 0.025 }: { opacity?: number }) {
  return <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: GRAIN, opacity }} />;
}
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-60px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: EASE }} className={className}>{children}</motion.div>;
}

/* ══════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════ */

const STAGES: Stage[] = [
  {
    num: "01", title: "Pré-contemplação", sub: "O sujeito nega ou minimiza o problema",
    examples: ["Paciente com alcoolismo não reconhecido como problema: sugerir que pare de beber está dois graus acima do estágio em que ele se encontra, forçando uma ação em alguém ainda em pré-consciência."],
    intro: [
      "Nesta fase de pré-contemplação, os indivíduos não se sentem preparados para agir: mantêm-se na defensiva e negam a existência do problema. Evitam ler, conversar ou refletir sobre seus comportamentos, subestimam os benefícios de mudar e superestimam os custos envolvidos. Muitos podem permanecer nesse estágio por anos, prejudicando a si mesmos e a quem está ao seu redor. Somente eventos marcantes — como a morte de um ente querido, o surgimento de uma doença próxima ou grandes transições de vida — costumam mobilizá-los.",
      "Geralmente, não há intenção de tomar qualquer providência no futuro imediato (em torno de seis meses), pois dispõem de pouca ou nenhuma informação sobre as consequências de suas ações atuais. Por isso, as intervenções devem ser iniciadas aos primeiros sinais de dificuldade, de forma cuidadosa, sem aguardar o fundo do poço.",
      "Podemos dizer que, nessa etapa, o sujeito vive numa consciência espontânea — reagindo apenas ao que lhe surge —, irrefletida — sem aprofundar o próprio pensamento — ou tradicional — guiada pelas ideias alheias. O terapeuta deve trabalhar dentro do quadro referencial do sujeito, buscando ampliar gradualmente sua compreensão sem impor interpretações externas.",
    ],
    bullets: [{ heading: "O que é interessante nessa fase?", items: [
      { text: "Estabelecer vínculo/conexão: Demonstrando empatia por meio da escuta ativa, acolhendo sem pressa e validando sentimentos e percepções do paciente." },
      { text: "Construir confiança e engajamento: Adotando postura não julgadora, mostrando-se presente e confiável, reforçando pequenos sinais de abertura e colaboração." },
      { text: "Aumentar a conscientização: Apontando com cuidado contradições ou conflitos no discurso do próprio paciente, estimulando a reflexão sobre esses pontos." },
      { text: "Oferecer informações neutras: Compartilhando dados simples sobre riscos atuais e benefícios da mudança sem pressionar, usando o discurso do sujeito para ampliar o entendimento." },
      { text: "Explorar valores e objetivos pessoais: Perguntando o que é significativo para o paciente na vida (família, trabalho, saúde), observando os impactos da não-contemplação." },
      { text: "Evitar confrontação direta: Reformulando objeções em perguntas abertas para reduzir resistência e manter o diálogo colaborativo." },
    ]}],
  },
  {
    num: "02", title: "Contemplação", sub: "Reconhecimento com ambivalência",
    intro: [
      "Nesta fase de contemplação, os sujeitos já reconhecem os benefícios de agir para promover mudanças em sua vida, mas permanecem agudamente conscientes dos custos envolvidos. Esse confronto entre prós e contras gera uma ambivalência profunda, que muitas vezes se expressa como uma oscilação entre atração e repulsa — semelhante ao relacionamento de amor e ódio que pode ocorrer na dependência química ou em laços afetivos conflituosos.",
      "Frequentemente, essa ambivalência leva a uma imobilização prolongada, caracterizada por um período crônico de reflexão ou por uma procrastinação comportamental. Apesar de existir a intenção de mudar, muitos acabam estacionados nesse estágio por longos períodos e, em alguns casos, até desistem de iniciar a transformação.",
      "Os autores chamam esse padrão de \"contemplação crônica\" ou \"procrastinação comportamental\", pois é exatamente aqui que a maioria das pessoas paralisa e não avança para a ação.",
    ],
    bullets: [{ heading: "O que é interessante nessa fase?", items: [
      { text: "Abordar a ambivalência e a incerteza: Conduzir um balanço reflexivo em que o paciente visualize os prós e contras da mudança, explore dúvidas e receios abertamente, e reflita sobre como cada aspecto pesa em suas motivações." },
      { text: "Avaliar comportamento e possíveis resultados: Mapear o comportamento atual e suas barreiras, utilizar role-plays ou visualizações para \"modelar\" a mudança, desenhar cenários de como seria o novo padrão de ação." },
      { text: "Explorar a autoeficácia: Resgatar experiências passadas de sucesso, definir pequenas metas testáveis, celebrar cada conquista e oferecer feedback encorajador para fortalecer a crença na própria capacidade de mudança." },
    ]}],
  },
  {
    num: "03", title: "Preparação", sub: "Organização e definição de passos",
    intro: [
      "Nessa fase de preparação, o indivíduo já adotou atitudes relevantes nos últimos meses — agendou consultas médicas, buscou terapia ou informações e até participou de grupos de apoio — mostrando clara disposição para a mudança. A intenção é agir num futuro muito próximo (cerca de um mês).",
      "É também o momento de estruturar o plano de ação: se o objetivo for, por exemplo, emagrecer, a pessoa já pesquisa profissionais de saúde, investiga quais tipos de exercício praticar e onde, e estuda diferentes abordagens alimentares.",
      "Embora já existam movimentos concretos em direção ao objetivo, ainda não se configura a ação propriamente dita — mas sim a organização e o delineamento dos passos iniciais para a transformação.",
    ],
    bullets: [{ heading: "O que é interessante nessa fase?", items: [
      { text: "Elaborar o plano de ação: Auxiliar o paciente a definir etapas concretas (o quê, como, quando e onde), prazos realistas e recursos necessários para cada tarefa." },
      { text: "Mobilizar informações e apoios: Orientar na busca de profissionais (médicos, terapeutas, nutricionistas), materiais de leitura e grupos de suporte, facilitando o contato e o agendamento de consultas." },
      { text: "Comprometer-se e acompanhar progressos: Incentivar o registro de compromissos (ex: assinatura de um \"contrato de mudança\" dentro do contrato terapêutico), uso de lembretes/calendários e revisões periódicas do avanço." },
    ]}],
  },
  {
    num: "04", title: "Ação", sub: "Implementação das mudanças",
    intro: [
      "Nessa fase de ação, os sujeitos começam a implementar mudanças reais em seu estilo de vida e em comportamentos específicos. Os sujeitos passam a conduzir pequenos experimentos, testando suas hipóteses no cotidiano e adotando estratégias para alcançar os resultados desejados.",
      "É aqui que o plano de ação delineado na etapa anterior ganha vida: as ações planejadas são efetivamente colocadas em prática, marcando uma fase de maior envolvimento e dinamismo. O paciente engaja-se em condutas específicas para dar forma à transformação e utiliza o espaço terapêutico para monitorar, validar e aperfeiçoar seu plano.",
    ],
    bullets: [{ heading: "O que é interessante nessa fase?", items: [
      { text: "Revisando o plano de ação: Incentivar o paciente a ajustar seu plano conforme avança nas ações, avaliando o que está funcionando e o que precisa ser modificado." },
      { text: "Apoio social e externo: Ajudar o paciente a identificar recursos e apoio de amigos, familiares ou grupos para sustentar as mudanças desejadas." },
      { text: "Estabelecendo metas tangíveis: Focar em ações específicas e mensuráveis, para que o paciente veja progresso concreto em direção à mudança." },
      { text: "Promover a autorregulação: Estimular o paciente a monitorar seu comportamento e refletir sobre os resultados das ações tomadas para reforçar o engajamento." },
      { text: "Reforçar conquistas e autoeficácia: Reconhecer e celebrar cada progresso, oferecer feedback positivo e incentivar o registro dos avanços para consolidar a confiança na própria capacidade." },
      { text: "Gerenciar barreiras e prevenir recaídas: Identificar desafios emergentes, elaborar planos de contingência para gatilhos e aplicar técnicas de enfrentamento sempre que necessário." },
      { text: "Ajustar suporte e consolidar autonomia: Facilitar o acionamento de recursos externos, reforçar a responsabilidade pessoal e promover a incorporação das mudanças ao cotidiano." },
    ]}],
  },
  {
    num: "05", title: "Manutenção", sub: "Consolidação e prevenção de recaídas",
    intro: [
      "No estágio de manutenção, segundo Prochaska, as pessoas continuam engajadas em manter as mudanças já alcançadas, embora utilizem os processos de mudança com menos frequência do que na fase da ação. As recaídas tornam-se menos comuns, e cresce a confiança de que é possível sustentar os novos comportamentos. Esse período pode durar de seis meses a cinco anos.",
      "Um dos principais desafios é lidar com o esforço prolongado que a manutenção exige. A metáfora proposta é a de uma maratona: exige resistência para atravessar estados emocionais como tristeza, ansiedade, raiva, tédio, solidão, estresse e desconforto — de formas mais saudáveis e consistentes.",
      "As mudanças de comportamento se consolidam e se tornam visíveis no estilo de vida. A pessoa mostra-se menos vulnerável a recaídas e mais segura quanto à sua capacidade de seguir com a transformação.",
    ],
    bullets: [{ heading: "O que é interessante nessa fase?", items: [
      { text: "Reforçar a prevenção de recaídas: Revisar e praticar regularmente as estratégias de coping identificadas; antecipar gatilhos emocionais e elaborar planos de contingência claros." },
      { text: "Sustentar a autoeficácia: Registro sistemático de sucessos e desafios, celebrar marcos alcançados e promover reflexões periódicas sobre o próprio progresso." },
      { text: "Gerenciar emoções e estresse prolongado: Ensaiar respostas adaptativas a sentimentos aversivos e revisar o uso dessas ferramentas no dia a dia." },
      { text: "Planejar suporte contínuo: Fortalecer a rede de apoio — terapeuta, amigos, grupos de suporte — e garantir acesso rápido a recursos em momentos de maior vulnerabilidade." },
      { text: "Avaliar e ajustar o plano de manutenção: Monitorar sistematicamente resultados, identificar sinais precoces de recaída e adaptar estratégias conforme surgem novas demandas ou contextos de vida." },
    ]}],
  },
  {
    num: "06", title: "Finalização", sub: "Estabilidade consolidada",
    intro: [
      "No estágio de encerramento ou estabilidade consolidada, a pessoa sente-se confiante em sua capacidade de manter as mudanças e não retornar aos antigos padrões disfuncionais. As condutas anteriores foram superadas a tal ponto que não representam mais uma ameaça, mesmo diante de situações desafiadoras. Esse é o cenário ideal — contudo, para muitos, o mais realista é alcançar e sustentar uma vida em manutenção constante.",
      "Em processos psicoterapêuticos voltados ao aperfeiçoamento pessoal, esse estágio se traduz não apenas na consolidação de novos comportamentos, mas também na capacidade da pessoa-sujeito de compreender seu próprio processo. Essa meta-compreensão favorece a construção de sínteses existenciais, a formulação de diretrizes de vida e a descoberta de sentido (como destaca Frankl) — tudo integrado ao viver cotidiano de forma autêntica e consciente.",
    ],
    bullets: [{ heading: "O que é interessante nessa fase?", items: [
      { text: "Estimular a meta-compreensão do processo: Conduzir reflexões estruturadas sobre a trajetória de mudança, ajudando o paciente a identificar quais fatores internos e externos sustentaram sua transformação." },
      { text: "Promover sínteses existenciais: Utilizar exercícios narrativos ou desenhos de linha de vida para integrar experiências passadas e presentes, revelando temas centrais que dão coerência à história pessoal." },
      { text: "Definir diretrizes de vida e propósito: Auxiliar na escolha consciente de valores e objetivos de longo prazo, vinculando-os a ações diárias e indicadores pessoais de realização." },
      { text: "Cultivar a descoberta de sentido: Incitar a reflexão para conectar pequenas conquistas a um sentido de vida mais amplo (Frankl)." },
      { text: "Consolidar autonomia reflexiva: Incentivar registros periódicos de insights (diário, gravações ou mapas mentais), revisões regulares de metas existenciais e o compartilhamento de aprendizados." },
    ]}],
  },
];

const RELATIONS = [
  { transition: "Pré-contempl. → Contemplação", color: "#C84B31", items: [
    { title: "Aumento da consciência", text: "Desenvolvimento progressivo da percepção sobre causas, consequências e possibilidades de superação de um problema. Intervenções adequadas: observação, interpretação, devolutiva (feedback), psicoeducação e biblioterapia. Em vez de confrontações, é mais eficaz destacar as causas e consequências de manter-se como está." },
    { title: "Alívio mobilizador", text: "Compreensão emocional do que se está vivenciando, acompanhada do alívio que a mudança pode proporcionar. Intervenções eficazes: dramatizações (psicodrama e role-playing), experiências de luto simbólico, depoimentos pessoais e contato emocional com sentimentos como medo, culpa, esperança e inspiração." },
    { title: "Reavaliação do ambiente", text: "Refletir, de forma cognitiva e emocional, sobre como o comportamento atual afeta o meio social. Intervenções: vivências de empatia, clarificação de valores e envolvimento de figuras significativas." },
  ]},
  { transition: "Contemplação → Preparação", color: "#D4854A", items: [
    { title: "Auto-reavaliação", text: "Capacidade de se imaginar livre do problema. Em vez de manter o foco nas causas que originaram o comportamento indesejado, a ênfase está no futuro e no potencial de transformação. Intervenções: visualizações, exposição a modelos saudáveis de comportamento e exercícios de clarificação de valores." },
  ]},
  { transition: "Preparação → Ação", color: "#B84060", items: [
    { title: "Crença e compromisso pessoal", text: "Fortalecimento da crença na própria capacidade de mudar e do comprometimento com esse processo. Estratégias mais eficazes são as públicas e visíveis, que aumentam a responsabilidade pessoal. Também é útil ampliar as opções de caminho." },
  ]},
  { transition: "Ação → Manutenção", color: "#8B5CF6", items: [
    { title: "Gerenciamento de contingências", text: "Utilizar reforços positivos para cada passo dado em direção à mudança. Os reforços internos (auto-reforços) são mais recomendáveis que os externos, pois estão sob maior controle da própria pessoa." },
    { title: "Relacionamentos de apoio", text: "Fundamentais para oferecer cuidado, aceitação, confiança e incentivo durante o processo de mudança. Intervenções: fortalecimento do vínculo terapêutico, ligações de apoio, grupos de ajuda mútua." },
    { title: "Contracondicionamento", text: "Aprendizado de novos comportamentos mais saudáveis em substituição aos antigos. Técnicas: dessensibilização, assertividade, reestruturação cognitiva." },
    { title: "Controle de estímulos", text: "Modificar o ambiente para favorecer comportamentos saudáveis e desencorajar os indesejados. Exemplos: evitar gatilhos, reorganizar espaços, participar de grupos de apoio." },
  ]},
];

/* ══════════════════════════════════════════════
   TABBED STAGE EXPLORER — the core new interaction
   ══════════════════════════════════════════════ */

function StageExplorer() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const stage = STAGES[active];
  const color = SC[active].accent;

  return (
    <section ref={ref} id="estagios" className="relative py-20 md:py-28" style={{ background: "#111" }}>
      <Grain />
      {/* moving gradient that follows active color */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ background: `radial-gradient(ellipse 80% 50% at 20% 0%,${color}12 0%,transparent 60%)` }}
        transition={{ duration: 1 }}
      />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
        {/* ── TABS ROW ── */}
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {STAGES.map((s, i) => {
              const isActive = i === active;
              const c = SC[i].accent;
              return (
                <motion.button
                  key={i}
                  onClick={() => setActive(i)}
                  className="relative flex items-center gap-3 px-5 py-3 rounded-xl font-dm text-sm font-medium transition-colors duration-300 outline-none border-none cursor-pointer"
                  style={{
                    background: isActive ? `${c}18` : "rgba(253,251,247,0.03)",
                    border: isActive ? `1px solid ${c}50` : "1px solid rgba(253,251,247,0.06)",
                    color: isActive ? c : "rgba(253,251,247,0.4)",
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-fraunces font-bold text-xs"
                    style={{
                      background: isActive ? `${c}25` : "rgba(253,251,247,0.04)",
                      color: isActive ? c : "rgba(253,251,247,0.3)",
                    }}
                  >
                    {s.num}
                  </span>
                  <span className="hidden sm:inline">{s.title}</span>
                  {isActive && (
                    <motion.div
                      layoutId="tab-glow"
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ boxShadow: `0 0 30px ${c}15, inset 0 0 30px ${c}08` }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </Reveal>

        {/* ── CONTENT AREA ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Stage header band */}
            <div
              className="rounded-t-3xl p-8 md:p-10 relative overflow-hidden"
              style={{ background: `${color}0C`, borderBottom: `1px solid ${color}20` }}
            >
              <span
                className="absolute -right-8 -top-8 font-fraunces font-bold select-none pointer-events-none"
                style={{ fontSize: "180px", color, opacity: 0.04, lineHeight: 1 }}
                aria-hidden
              >
                {stage.num}
              </span>
              <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full font-dm text-[10px] font-semibold tracking-[.2em] uppercase mb-3"
                    style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}
                  >
                    {SC[active].label} · Estágio {stage.num}
                  </span>
                  <h3
                    className="font-fraunces font-bold text-[#FDFBF7]"
                    style={{ fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
                  >
                    {stage.title}
                  </h3>
                  <p className="font-dm mt-2" style={{ color: `${color}AA`, fontSize: "15px" }}>
                    {stage.sub}
                  </p>
                </div>
                {/* mini progress */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {STAGES.map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: i === active ? 28 : 8,
                        background: i <= active ? color : "rgba(253,251,247,0.1)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Stage body */}
            <div
              className="rounded-b-3xl p-8 md:p-10"
              style={{ background: "rgba(253,251,247,0.02)", border: "1px solid rgba(253,251,247,0.05)", borderTop: "none" }}
            >
              <div className="grid md:grid-cols-3 gap-10">
                {/* Left: text — 2 cols */}
                <div className="md:col-span-2 space-y-6">
                  {/* Example */}
                  {stage.examples?.map((ex, i) => (
                    <div key={i} className="rounded-2xl p-6" style={{ background: `${color}08`, border: `1px solid ${color}20`, borderLeft: `4px solid ${color}` }}>
                      <p className="font-dm text-[10px] font-semibold tracking-[.2em] uppercase mb-2" style={{ color }}>Exemplo clínico</p>
                      <p className="font-dm text-sm leading-[1.8]" style={{ color: "rgba(253,251,247,0.65)" }}>{ex}</p>
                    </div>
                  ))}
                  {/* Paragraphs */}
                  {stage.intro.map((p, i) => (
                    <p key={i} className="font-dm leading-[1.85]" style={{ fontSize: "15px", color: "rgba(253,251,247,0.55)" }}>{p}</p>
                  ))}
                </div>

                {/* Right: bullets — 1 col */}
                <div>
                  {stage.bullets.map((section, si) => (
                    <div key={si}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-[2px] rounded-full" style={{ background: color }} />
                        <p className="font-dm font-semibold text-[10px] tracking-[.18em] uppercase" style={{ color }}>
                          {section.heading}
                        </p>
                      </div>
                      <div className="space-y-3">
                        {section.items.map((item, ii) => {
                          const ci = item.text.indexOf(":");
                          const bold = ci > -1 ? item.text.slice(0, ci) : "";
                          const rest = ci > -1 ? item.text.slice(ci) : item.text;
                          return (
                            <motion.div
                              key={ii}
                              className="rounded-xl p-4 group"
                              style={{ background: "rgba(253,251,247,0.02)", border: "1px solid rgba(253,251,247,0.05)" }}
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ii * 0.05, duration: 0.4, ease: EASE }}
                              whileHover={{ background: `${color}08`, borderColor: `${color}25` }}
                            >
                              <p className="font-dm text-[13px] leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>
                                {bold && <strong style={{ color: "rgba(253,251,247,0.85)" }}>{bold}</strong>}
                                {rest}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   TRANSITIONS — VERTICAL BRIDGE FLOW
   ══════════════════════════════════════════════ */

const TRANSITION_STAGES: { num: string; short: string; color: string }[] = [
  { num: "01", short: "Pré-consciência", color: "#C84B31" },
  { num: "02", short: "Contemplação", color: "#D4854A" },
  { num: "03", short: "Preparação", color: "#B84060" },
  { num: "04", short: "Ação", color: "#8B5CF6" },
  { num: "05", short: "Manutenção", color: "#63B397" },
];

function TransitionBridge({ group, index }: { group: typeof RELATIONS[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const from = TRANSITION_STAGES[index];
  const to = TRANSITION_STAGES[index + 1];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
      className="relative"
    >
      {/* ─── Bridge header: FROM → TO ─── */}
      <div className="flex items-center gap-0 mb-8">
        {/* FROM node */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-fraunces font-bold text-sm"
            style={{
              background: `${from.color}18`,
              border: `1px solid ${from.color}40`,
              color: from.color,
              boxShadow: `0 0 20px ${from.color}15`,
            }}
          >
            {from.num}
          </div>
          <div className="hidden sm:block">
            <p className="font-dm text-[10px] font-semibold tracking-[.2em] uppercase" style={{ color: "rgba(253,251,247,0.25)" }}>
              De
            </p>
            <p className="font-dm text-sm font-medium" style={{ color: from.color }}>
              {from.short}
            </p>
          </div>
        </div>

        {/* Connecting gradient bar */}
        <div className="flex-1 mx-4 relative h-[2px]">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(to right, ${from.color}60, ${from.color}20 30%, ${to.color}20 70%, ${to.color}60)`,
            }}
          />
          {/* Animated pulse dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
            style={{ background: to.color, boxShadow: `0 0 8px ${to.color}80` }}
            animate={inView ? { left: ["5%", "95%"] } : { left: "5%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          />
          {/* Center diamond */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45"
            style={{
              background: "#0D0D0D",
              border: `1px solid rgba(253,251,247,0.15)`,
            }}
          />
        </div>

        {/* TO node */}
        <div className="flex items-center gap-3 flex-shrink-0 flex-row-reverse sm:flex-row">
          <div className="hidden sm:block text-right sm:text-left">
            <p className="font-dm text-[10px] font-semibold tracking-[.2em] uppercase" style={{ color: "rgba(253,251,247,0.25)" }}>
              Para
            </p>
            <p className="font-dm text-sm font-medium" style={{ color: to.color }}>
              {to.short}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-fraunces font-bold text-sm"
            style={{
              background: `${to.color}18`,
              border: `1px solid ${to.color}40`,
              color: to.color,
              boxShadow: `0 0 20px ${to.color}15`,
            }}
          >
            {to.num}
          </div>
        </div>
      </div>

      {/* ─── Process cards ─── */}
      <div className={`grid gap-3 ${group.items.length === 1 ? "grid-cols-1 max-w-[640px]" : group.items.length === 2 ? "md:grid-cols-2" : group.items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {group.items.map((item, ii) => (
          <motion.div
            key={ii}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 + ii * 0.08, duration: 0.6, ease: EASE }}
            className="group relative rounded-xl p-5 overflow-hidden"
            style={{
              background: "rgba(253,251,247,0.02)",
              border: "1px solid rgba(253,251,247,0.06)",
            }}
          >
            {/* top accent line gradient from→to */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(to right, ${from.color}60, ${to.color}60)`,
              }}
            />
            {/* number badge */}
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-dm text-[11px] font-bold"
                style={{
                  background: `linear-gradient(135deg, ${from.color}20, ${to.color}20)`,
                  color: from.color,
                }}
              >
                {String.fromCharCode(65 + ii)}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-fraunces font-bold text-[15px] mb-2 leading-snug"
                  style={{ color: "rgba(253,251,247,0.85)" }}
                >
                  {item.title}
                </p>
                <p
                  className="font-dm text-[13px] leading-relaxed"
                  style={{ color: "rgba(253,251,247,0.42)" }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TransitionsSection() {
  return (
    <section id="transicoes" className="relative py-20 md:py-28 overflow-hidden" style={{ background: "#0D0D0D" }}>
      <Grain />
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(200,75,49,.05) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-[1000px] mx-auto px-6 md:px-10 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-5">
              Processos de Transição
            </p>
            <h2
              className="font-fraunces font-bold text-[#FDFBF7] mb-4"
              style={{ fontSize: "clamp(32px,5vw,48px)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              O que impulsiona cada{" "}
              <span className="italic text-[#C84B31]">passagem</span>
            </h2>
            <p className="font-dm mx-auto" style={{ color: "rgba(253,251,247,0.4)", maxWidth: 540 }}>
              Cada transição é mediada por processos específicos. O terapeuta que os reconhece pode escolher a intervenção certa no momento certo.
            </p>
          </div>
        </Reveal>

        {/* ─── Overview: all 6 stages as a connected row ─── */}
        <Reveal>
          <div className="hidden md:flex items-center justify-between mb-16 px-2">
            {TRANSITION_STAGES.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-fraunces font-bold text-xs"
                    style={{
                      background: `${s.color}15`,
                      border: `1px solid ${s.color}35`,
                      color: s.color,
                    }}
                  >
                    {s.num}
                  </div>
                  <span
                    className="font-dm text-[10px] text-center leading-tight"
                    style={{ color: s.color, maxWidth: 80, opacity: 0.7 }}
                  >
                    {s.short}
                  </span>
                </div>
                {i < TRANSITION_STAGES.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-4">
                    <div
                      className="h-px w-full min-w-[40px]"
                      style={{
                        background: `linear-gradient(to right, ${s.color}50, ${TRANSITION_STAGES[i + 1].color}50)`,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* ─── The 4 transition bridges ─── */}
        <div className="relative">
          {/* Vertical connecting line (desktop only) */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px hidden md:block pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #C84B31 0%, #D4854A 25%, #B84060 50%, #8B5CF6 75%, #63B397 100%)",
              opacity: 0.12,
            }}
          />

          <div className="space-y-16">
            {RELATIONS.map((group, gi) => (
              <TransitionBridge key={gi} group={group} index={gi} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   COMPETENCIAS — BENTO GRID
   ══════════════════════════════════════════════ */

function CompetenciasSection() {
  const COMP_LINKS: Record<string, string> = {
    "Estágio de Mudança": "/estagios-mudanca",
    "Estrutura do Atendimento": "/coerencia-consistencia",
    "Abertura & Encerramento": "/abertura-encerramento",
    "Acolhimento": "/acolhimento",
    "Segurança no Terapeuta": "/seguranca-terapeuta",
    "Segurança no Método": "/seguranca-metodo",
    "Aprofundar / Investigação": "/aprofundamento",
    "Hipóteses Clínicas": "/hipoteses-clinicas",
    "Interpretação": "/interpretacao",
    "Frase & Timing": "/frase-timing",
    "Corpo & Setting": "/setting-corpo",
    "Insight & Potência": "/potencia-insight",
  };
  const cats = [
    { cat: "Estrutura", items: [{ name: "Estágio de Mudança", active: true }, { name: "Estrutura do Atendimento" }, { name: "Abertura & Encerramento" }] },
    { cat: "Relação", items: [{ name: "Acolhimento" }, { name: "Segurança no Terapeuta" }, { name: "Segurança no Método" }] },
    { cat: "Formulação", items: [{ name: "Aprofundar / Investigação" }, { name: "Hipóteses Clínicas" }, { name: "Interpretação" }] },
    { cat: "Performance", items: [{ name: "Frase & Timing" }, { name: "Corpo & Setting" }, { name: "Insight & Potência" }] },
  ];

  return (
    <section id="competencias" className="relative py-20 md:py-28" style={{ background: "#141414" }}>
      <Grain />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">AvaliAllos</p>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-3" style={{ fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-0.03em" }}>
              Grade de <span className="italic text-[#C84B31]">Competências</span>
            </h2>
            <p className="font-dm text-sm mx-auto" style={{ color: "rgba(253,251,247,0.38)", maxWidth: 460 }}>
              Clique em qualquer competência para explorar em detalhes.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cats.map(({ cat, items }) => {
              const color = CAT_COLORS[cat] || "#C84B31";
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center gap-2 px-1 mb-1">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                    <p className="font-dm font-semibold text-[10px] tracking-[.2em] uppercase" style={{ color: "rgba(253,251,247,0.3)" }}>{cat}</p>
                  </div>
                  {items.map((c) => (
                    <motion.a key={c.name} href={COMP_LINKS[c.name] || "#"}
                      className="group rounded-xl p-4 relative block no-underline cursor-pointer"
                      style={{
                        background: c.active ? `${color}14` : "rgba(253,251,247,0.02)",
                        border: c.active ? `1px solid ${color}50` : "1px solid rgba(253,251,247,0.06)",
                      }}
                      whileHover={{ y: -3, boxShadow: `0 8px 24px ${color}15` }}>
                      {c.active && (
                        <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full font-dm text-[8px] font-bold tracking-wider uppercase"
                          style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}>
                          <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: color }} />
                          Aqui
                        </span>
                      )}
                      <p className="font-dm text-sm font-medium group-hover:text-[#FDFBF7] transition-colors" style={{ color: c.active ? "rgba(253,251,247,0.9)" : "rgba(253,251,247,0.55)" }}>
                        {c.name}
                      </p>
                      <p className="font-dm text-[11px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>Explorar →</p>
                    </motion.a>
                  ))}
                </div>
              );
            })}
          </div>
        </Reveal>
        {/* Formação CTA */}
        <Reveal delay={0.15}>
          <div className="mt-14 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.06)" }}>
            <div>
              <p className="font-dm text-[11px] tracking-[.2em] uppercase mb-2" style={{ color: "rgba(253,251,247,0.35)" }}>Quer ir além?</p>
              <p className="font-fraunces font-bold text-[#FDFBF7] text-lg">Conheça nossa formação contínua</p>
              <p className="font-dm text-sm mt-1" style={{ color: "rgba(253,251,247,0.4)" }}>Supervisão, grupos práticos e desenvolvimento clínico estruturado.</p>
            </div>
            <motion.a href="/Allos-site/formacao"
              className="flex-shrink-0 inline-flex items-center gap-2 font-dm font-semibold text-sm text-white rounded-full"
              style={{ padding: "12px 28px", background: "#C84B31" }}
              whileHover={{ scale: 1.04, boxShadow: "0 6px 20px rgba(200,75,49,.3)" }}
              whileTap={{ scale: 0.97 }}>
              Conhecer a formação
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.a>
          </div>
        </Reveal>
        {/* PBE reference */}
        <Reveal delay={0.2}>
          <div className="mt-5 flex items-center justify-center gap-3 py-4">
            <div className="h-px w-8" style={{ background: "rgba(253,251,247,0.06)" }} />
            <p className="font-dm text-[12px]" style={{ color: "rgba(253,251,247,0.3)" }}>
              Quer entender a ciência por trás?{" "}
              <a href="/Allos-site/pbe" className="transition-colors hover:text-[#C84B31]" style={{ color: "rgba(253,251,247,0.5)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                Conheça a história da Prática Deliberada
              </a>
            </p>
            <div className="h-px w-8" style={{ background: "rgba(253,251,247,0.06)" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════ */

export default function EstagiosContent() {
  return (
    <div className="relative">
      {/* ── INTRO ── */}
      <section className="relative py-20 md:py-28" style={{ background: "#1A1A1A" }}>
        <Grain />
        <div className="absolute top-0 left-0 w-[600px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at top left,rgba(200,75,49,.08) 0%,transparent 65%)" }} />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Reveal>
            {/* Bento intro grid */}
            <div className="grid md:grid-cols-12 gap-4">
              {/* Main text — large cell */}
              <div className="md:col-span-7 rounded-3xl p-8 md:p-10" style={{ background: "rgba(253,251,247,0.02)", border: "1px solid rgba(253,251,247,0.06)" }}>
                <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-5">Por que isso importa</p>
                <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-6" style={{ fontSize: "clamp(28px,4vw,42px)", letterSpacing: "-0.03em", lineHeight: 1.12 }}>
                  Compreender os estágios já transforma o <span className="italic text-[#C84B31]">atendimento</span>
                </h2>
                <div className="space-y-4">
                  <p className="font-dm leading-[1.8]" style={{ fontSize: "15px", color: "rgba(253,251,247,0.55)" }}>
                    O modelo diz respeito ao ajuste entre a intervenção terapêutica e o momento específico em que o paciente se encontra em seu processo de transformação. Saber reconhecer esse momento é o que permite ao terapeuta intervir com precisão — sem precipitação nem omissão.
                  </p>
                  <p className="font-dm leading-[1.8]" style={{ fontSize: "15px", color: "rgba(253,251,247,0.45)" }}>
                    Se o sujeito está em pré-consciência sobre a questão, ouvir e ser empático é fundamental. Confrontá-lo não é adequado, pois a intervenção se torna mais agressiva do que o paciente necessita.
                  </p>
                </div>
              </div>

              {/* Right column — stacked cells */}
              <div className="md:col-span-5 flex flex-col gap-4">
                {/* journey mini-map */}
                <div className="rounded-3xl p-6" style={{ background: "rgba(200,75,49,0.04)", border: "1px solid rgba(200,75,49,0.12)" }}>
                  <p className="font-dm text-[10px] font-semibold tracking-[.2em] uppercase mb-4" style={{ color: "rgba(253,251,247,0.3)" }}>A jornada de 6 estágios</p>
                  <div className="flex items-center justify-between">
                    {SC.map((s, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-fraunces font-bold text-xs"
                          style={{ background: `${s.accent}20`, color: s.accent, border: `1px solid ${s.accent}35` }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <span className="font-dm text-[9px] font-medium" style={{ color: s.accent, opacity: 0.7 }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example 1 */}
                <div className="rounded-3xl p-6 flex-1" style={{ background: "rgba(200,75,49,0.05)", border: "1px solid rgba(200,75,49,0.14)", borderLeft: "4px solid rgba(200,75,49,0.5)" }}>
                  <p className="font-dm text-[10px] font-semibold tracking-[.2em] uppercase text-[#C84B31] mb-2">Intervenção precipitada</p>
                  <p className="font-dm text-[13px] leading-relaxed" style={{ color: "rgba(253,251,247,0.58)" }}>
                    Paciente com alcoolismo sem reconhecimento: sugerir que pare está dois graus acima de onde ele está, forçando ação em alguém em pré-consciência.
                  </p>
                </div>

                {/* Example 2 */}
                <div className="rounded-3xl p-6 flex-1" style={{ background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.14)", borderLeft: "4px solid rgba(139,92,246,0.5)" }}>
                  <p className="font-dm text-[10px] font-semibold tracking-[.2em] uppercase mb-2" style={{ color: "#8B5CF6" }}>Timing errado</p>
                  <p className="font-dm text-[13px] leading-relaxed" style={{ color: "rgba(253,251,247,0.58)" }}>
                    Paciente a duas semanas do ENEM sem clareza sobre a escolha. Não é o momento de questionar se quer medicina — é hora de apoiar a ação.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TABBED STAGE EXPLORER ── */}
      <StageExplorer />

      {/* ── TRANSITIONS ── */}
      <TransitionsSection />

      {/* ── COMPETENCIAS ── */}
      <CompetenciasSection />

      {/* ── CTA ── */}
      <section className="relative py-32 text-center overflow-hidden" style={{ background: "#0A0A0A" }}>
        <Grain />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none" style={{ background: "radial-gradient(ellipse at bottom,rgba(200,75,49,.12) 0%,transparent 70%)" }} />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Reveal>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,5vw,52px)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Intervir com <span className="italic text-[#C84B31]">precisão</span>
            </h2>
            <p className="font-dm mx-auto mb-10" style={{ color: "rgba(253,251,247,0.45)", maxWidth: 560 }}>
              Reconhecer o estágio de mudança é o que permite ao terapeuta intervir sem precipitação nem omissão — transformando sensibilidade clínica em resultados reais.
            </p>
            <motion.a href="https://bit.ly/terapiasite" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-dm font-semibold text-white bg-[#C84B31] rounded-full"
              style={{ padding: "17px 52px", fontSize: "15px" }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ["0 0 0 0px rgba(200,75,49,0.5)", "0 0 0 14px rgba(200,75,49,0)", "0 0 0 0px rgba(200,75,49,0)"] }}
              transition={{ boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeOut" } }}>
              Agendar Sessão
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1 7.5h12M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </motion.a>
            <p className="font-dm text-sm mt-12" style={{ color: "rgba(253,251,247,0.3)" }}>
              Rua Rio Negro, 1048, Barroca, BH – MG<br />suporte@allos.org.br · +55 31 98757-7892
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
