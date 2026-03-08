"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import basePath from "@/lib/basePath";

/* ── constants ─────────────────────────────────────────── */
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

const DOT_GRID = {
  backgroundImage: "radial-gradient(circle, rgba(200,75,49,0.04) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};

/* ── helpers ────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Grain({ opacity = 0.025 }: { opacity?: number }) {
  return <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: GRAIN, opacity }} />;
}

function GlowTL() {
  return (
    <div
      className="absolute top-0 left-0 w-[600px] h-[500px] pointer-events-none"
      style={{ background: "radial-gradient(ellipse at top left,rgba(200,75,49,.1) 0%,transparent 65%)" }}
    />
  );
}

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <div className="h-px w-12" style={{ background: "linear-gradient(to right,transparent,rgba(200,75,49,0.4))" }} />
      <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase">{children}</p>
      <div className="h-px flex-1 max-w-[200px]" style={{ background: "linear-gradient(to right,rgba(200,75,49,0.4),transparent)" }} />
    </div>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-50" />
      <div className="h-px w-12 bg-[#C84B31] opacity-20" />
      <div className="w-2 h-2 rounded-full bg-[#C84B31]" />
      <div className="h-px w-12 bg-[#C84B31] opacity-20" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#C84B31] opacity-50" />
    </div>
  );
}

function DecorCircles({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="200" height="200" viewBox="0 0 240 240" fill="none" opacity="0.06">
      <circle cx="120" cy="120" r="116" stroke="#C84B31" strokeWidth=".8" strokeDasharray="8 5" />
      <circle cx="120" cy="120" r="80" stroke="#C84B31" strokeWidth=".7" strokeDasharray="4 6" />
      <circle cx="120" cy="120" r="45" stroke="#C84B31" strokeWidth=".8" />
      <circle cx="120" cy="120" r="13" stroke="#C84B31" strokeWidth=".8" />
      <circle cx="120" cy="120" r="3" fill="#C84B31" />
    </svg>
  );
}

/* ── Competency colors ──────────────────────────────────── */
const CAT_COLORS: Record<string, string> = {
  Estrutura: "#C84B31",
  "Relação": "#D4854A",
  "Formulação": "#B84060",
  Performance: "#8B5CF6",
};

const COMPETENCIAS = [
  { cat: "Estrutura", items: ["Estágio de Mudança", "Estrutura do Atendimento", "Abertura & Encerramento"] },
  { cat: "Relação", items: ["Acolhimento", "Segurança no Terapeuta", "Segurança no Método"] },
  { cat: "Formulação", items: ["Aprofundar / Investigação", "Hipóteses Clínicas", "Interpretação"] },
  { cat: "Performance", items: ["Frase & Timing", "Corpo & Setting", "Insight & Potência"] },
];

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

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function PbeContent() {
  return (
    <div className="relative">
      {/* ─── SEÇÃO 1 — HISTÓRIA DA PBE ─── */}
      <section className="relative py-20 md:py-28 bg-[#1A1A1A] overflow-hidden">
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Reveal>
            <SectionBadge>Capítulo 01</SectionBadge>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <Reveal>
              <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-6" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em" }}>
                A História da Psicologia{" "}
                <span className="italic text-[#C84B31]">Baseada em Evidências</span>
              </h2>
              <p className="leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                O movimento da Psicologia Baseada em Evidências (PBE) nasceu da tentativa de aplicar o modelo médico à psicoterapia. A construção do DSM e a adoção da psicologia como ciência baseada em evidências começaram ao copiar o modelo da medicina, que compara intervenções e utiliza a eficácia clínica para avaliar se algo funciona.
              </p>
              <p className="leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                Contudo, além da eficácia, outros critérios como plausibilidade — especialmente quando os dados são limitados — e a solidez teórica da abordagem podem ser considerados. Os estudos geralmente iniciam com um transtorno específico, como a depressão, e comparam o impacto de diferentes tratamentos. Essa metodologia é a única forma de produzir conhecimento sobre intervenções. Mas isso tem vários problemas.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="space-y-5">
                {/* Card Modelo Médico */}
                <div className="rounded-xl p-6" style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.15)", borderLeft: "3px solid rgba(200,75,49,0.55)" }}>
                  <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase mb-3">Modelo Médico</p>
                  <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.6)" }}>
                    Diagnóstico específico → Tratamento específico → Resultado mensurável. A psicologia tentou replicar essa lógica importando a estrutura dos ensaios clínicos randomizados da medicina farmacêutica.
                  </p>
                </div>
                {/* Card DSM */}
                <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
                  <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase mb-3">DSM como Base</p>
                  <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                    O DSM categorizou transtornos psicológicos em categorias diagnósticas distintas, permitindo que pesquisadores testassem tratamentos para cada categoria separadamente. A psicometria define a existência pelo que não se correlaciona discretamente com outra coisa.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* OS DOIS PROBLEMAS */}
          <Reveal>
            <div className="mt-20">
              <h3 className="font-fraunces font-semibold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(20px,2.5vw,28px)" }}>
                Os Dois Grandes Problemas
              </h3>
              <p className="mb-10 max-w-[700px]" style={{ color: "rgba(253,251,247,0.5)" }}>
                Dois problemas fundamentais surgem ao tentar encaixar a psicoterapia no modelo médico:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    num: "1",
                    title: "Definir o Transtorno",
                    text: "Dissonância entre doenças psíquicas: na medicina, é mais fácil diferenciar um tumor cerebral de uma gripe. Em psicologia, conceitos como vício e transtorno borderline se confundem, com sobreposição de cerca de 80%. Esse problema reflete a dificuldade do DSM em delimitar fenômenos — o primeiro desafio é definir o que constitui uma doença.",
                  },
                  {
                    num: "2",
                    title: "Medir o Sucesso Terapêutico",
                    text: "Contar cortes em automutilação pode não captar a real melhora — o paciente pode parar de se cortar e se autodestruir de outras formas. Questionários são simples e enviesados. Muitas pessoas não têm plena consciência de seus sentimentos, embora pessoas próximas percebam mudanças — tornando impreciso assumir que o indivíduo conhece seu estado emocional.",
                  },
                ].map((item, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="flex gap-5">
                      <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-fraunces font-bold text-lg text-[#C84B31]" style={{ background: "rgba(200,75,49,.1)", border: "1px solid rgba(200,75,49,.25)" }}>
                        {item.num}
                      </div>
                      <div>
                        <h4 className="font-fraunces font-semibold text-[#FDFBF7] mb-2" style={{ fontSize: "clamp(17px,2vw,22px)" }}>
                          {item.title}
                        </h4>
                        <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── SEÇÃO 2 — O GRANDE DEBATE ─── */}
      <section className="relative py-20 md:py-28 bg-[#141414] overflow-hidden">
        <Grain />
        <GlowTL />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Reveal>
            <SectionBadge>Capítulo 02</SectionBadge>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em" }}>
              O Grande Debate: <span className="italic text-[#C84B31]">Barlow vs. Wampold</span>
            </h2>
            <p className="max-w-[720px] mb-12" style={{ color: "rgba(253,251,247,0.5)" }}>
              No coração da PBE há uma disputa que moldou décadas de pesquisa — a discordância fundamental entre David Barlow e Bruce Wampold sobre o que realmente funciona na terapia.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Barlow */}
            <Reveal delay={0.05}>
              <div className="rounded-2xl p-8 h-full" style={{ background: "rgba(255,255,255,.035)", border: "1px solid rgba(255,255,255,.08)" }}>
                <h3 className="font-fraunces font-semibold text-xl mb-1" style={{ color: "rgba(253,251,247,.85)" }}>David H. Barlow</h3>
                <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-4">Tratamentos específicos importam</p>
                <p className="font-dm text-sm leading-relaxed mb-5" style={{ color: "rgba(253,251,247,0.5)" }}>
                  David Barlow e sua equipe afirmam que existem abordagens na psicologia que funcionam e outras que não funcionam. Eles conduzem pesquisas para identificar quais intervenções produzem resultados baseadas no constructo e no tratamento, classificando as demais como pseudociência. Em alguns casos, são utilizados recursos legais para impedir a continuidade dessas práticas.
                </p>
                <div className="space-y-2.5">
                  {["Defende que método importa mais que terapeuta", "Abordagem baseada no DSM por transtorno", "Protocolos manualizados e específicos", "Argumenta que existem métodos superiores"].map((t, i) => (
                    <p key={i} className="font-dm text-sm flex items-start gap-2" style={{ color: "rgba(253,251,247,0.45)" }}>
                      <span className="text-[#C84B31] font-semibold mt-0.5">→</span> {t}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Wampold */}
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-8 h-full" style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.25)" }}>
                <h3 className="font-fraunces font-semibold text-xl text-[#FDFBF7] mb-1">Bruce Wampold</h3>
                <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-4">A abordagem não é o fator decisivo</p>
                <p className="font-dm text-sm leading-relaxed mb-5" style={{ color: "rgba(253,251,247,0.55)" }}>
                  Como avaliar o bem-estar e constructos de forma geral, em vez de focar em um transtorno específico? Wampold argumenta que, se a avaliação não se basear no DSM — que ele considera inadequado —, todas as abordagens mostram impacto, pois os fatores comuns são os que promovem a cura. Quando a avaliação não está vinculada a um constructo específico, todas as abordagens terapêuticas mostram impacto.
                </p>
                <div className="space-y-2.5">
                  {["Todas as abordagens têm impacto semelhante", "Fatores comuns impulsionam a cura", "O terapeuta importa mais que a técnica", "Avaliar bem-estar geral, não por transtorno"].map((t, i) => (
                    <p key={i} className="font-dm text-sm flex items-start gap-2" style={{ color: "rgba(253,251,247,0.55)" }}>
                      <span className="text-[#C84B31] font-semibold mt-0.5">→</span> {t}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Insight */}
          <Reveal>
            <div className="rounded-2xl p-8 mt-8" style={{ background: "rgba(139,92,246,.06)", border: "1px solid rgba(139,92,246,.2)", borderLeft: "4px solid #8B5CF6" }}>
              <p className="font-dm font-semibold text-[11px] tracking-[.26em] uppercase mb-3" style={{ color: "#8B5CF6" }}>
                Implicação Fundamental
              </p>
              <p className="font-dm text-[15px] leading-relaxed" style={{ color: "rgba(253,251,247,0.6)" }}>
                Se Wampold está correto — e os dados consistentemente apontam nessa direção — então o foco deveria sair dos protocolos específicos e ir para o{" "}
                <strong className="text-[#FDFBF7]">desenvolvimento do terapeuta como instrumento de cura</strong>. A pergunta não é {'"'}qual técnica usar?{'"'}, mas {'"'}como formar terapeutas excelentes?{'"'}.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── SEÇÃO 3 — ESTAGNAÇÃO ─── */}
      <section className="relative py-20 md:py-28 bg-[#1A1A1A] overflow-hidden">
        <Grain />
        <DecorCircles className="absolute right-8 top-20 hidden lg:block" />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Reveal>
            <SectionBadge>Capítulo 03</SectionBadge>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-6" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em" }}>
              Terapeutas Não Melhoram{" "}
              <span className="italic text-[#C84B31]">com Experiência</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <Reveal>
              <p className="leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                Na pesquisa de Wampold, um gráfico questiona se os pacientes melhoram ou pioram ao longo do tempo e se os psicólogos se desenvolvem com a experiência clínica. Esse gráfico indica que, com o passar dos anos, os resultados dos profissionais mais experientes são praticamente iguais aos dos iniciantes, sugerindo que, em média, os clínicos tendem a piorar um pouco com o tempo.
              </p>
              <p className="leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                Isso contraria profundamente a intuição. Afinal, em quase todas as profissões, a experiência melhora o desempenho. Por que a psicoterapia seria diferente?
              </p>

              {/* As 3 explicações */}
              <div className="mt-8 rounded-2xl p-7 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(200,75,49,.06),rgba(200,75,49,.02))", border: "1px solid rgba(200,75,49,.25)" }}>
                <p className="absolute right-[-10px] bottom-[-10px] font-fraunces font-bold select-none pointer-events-none" style={{ fontSize: "clamp(60px,10vw,120px)", color: "#FDFBF7", opacity: 0.025 }}>
                  Por quê?
                </p>

                <h4 className="font-fraunces font-semibold text-[#FDFBF7] mb-5" style={{ fontSize: "18px" }}>Três Explicações</h4>

                <div className="space-y-5">
                  <div>
                    <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-1">1. A Analogia do Basquete</p>
                    <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>
                      Se alguém treina arremessos vendado, sem ver a trajetória da bola, não progride. Segundo a tese, a melhoria depende do conhecimento profundo das consequências das próprias intervenções; sem esse retorno, o terapeuta age às cegas — o que explica a estagnação ou o declínio.
                    </p>
                  </div>
                  <div>
                    <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-1">2. A Cristalização do Conhecimento</p>
                    <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>
                      Inspirada em Jung: não há diferença real entre conhecimento e a cristalização de preconceitos. O que se conhece muitas vezes é um modelo mental simplificado que substitui o esforço de perceber a realidade. Em terapias de casal, a intervenção frequentemente consiste em promover a escuta mútua, justamente para combater essa tendência de substituir a escuta real por conhecimento preconcebido.
                    </p>
                  </div>
                  <div>
                    <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-1">3. O Ensino Incorreto</p>
                    <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>
                      Na verdade, a gente explica psicologia errado — ninguém aprende em nenhuma universidade da forma como está sendo explicado. A prática vem depois de anos de teoria pura, como ensinar natação mostrando PowerPoint da história da natação e depois jogar o aluno na piscina.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              {/* Gráfico SVG */}
              <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
                <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase mb-6">Eficácia clínica ao longo do tempo</p>
                <div className="relative mx-auto" style={{ maxWidth: "320px" }}>
                  <svg viewBox="0 0 300 180" fill="none" className="w-full">
                    <line x1="40" y1="150" x2="290" y2="150" stroke="rgba(253,251,247,.1)" strokeWidth="1" />
                    <line x1="40" y1="110" x2="290" y2="110" stroke="rgba(253,251,247,.04)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="70" x2="290" y2="70" stroke="rgba(253,251,247,.04)" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="40" y1="30" x2="290" y2="30" stroke="rgba(253,251,247,.04)" strokeWidth="1" strokeDasharray="4 4" />
                    <path d="M40 140 Q110 125 160 85 Q210 45 280 28" stroke="rgba(253,251,247,.15)" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
                    <path d="M40 140 Q90 128 140 122 Q190 118 230 122 Q270 126 280 128" stroke="#C84B31" strokeWidth="2.5" fill="none" />
                    <text x="278" y="22" fill="rgba(253,251,247,.25)" fontSize="9" fontFamily="DM Sans" textAnchor="end">Esperado</text>
                    <text x="278" y="143" fill="#C84B31" fontSize="9" fontFamily="DM Sans" textAnchor="end">Real</text>
                    <text x="160" y="170" fill="rgba(253,251,247,.25)" fontSize="9" fontFamily="DM Sans" textAnchor="middle">Anos de experiência</text>
                  </svg>
                </div>
                <p className="font-dm text-xs mt-5" style={{ color: "rgba(253,251,247,0.3)" }}>
                  A linha terracota mostra a realidade: eficácia estagnada ou em leve declínio ao longo da carreira.
                </p>
              </div>

              {/* Quote */}
              <div className="rounded-xl p-7 mt-5 relative" style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.15)" }}>
                <span className="absolute top-2 left-4 font-fraunces text-[56px] leading-none text-[#C84B31] opacity-30">{'"'}</span>
                <p className="font-dm text-[15px] italic leading-relaxed pl-4" style={{ color: "rgba(253,251,247,0.6)" }}>
                  A experiência sem feedback é apenas repetição de hábitos — bons ou ruins.
                </p>
              </div>

              {/* Dado impactante */}
              <div className="rounded-xl p-6 mt-5" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderLeft: "3px solid #C84B31" }}>
                <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>
                  <strong className="text-[#FDFBF7]">O dado mais impactante:</strong> Scott Miller comparou alunos entrando e saindo da graduação. Os que já eram bons continuaram bons; os que tinham dificuldades mantiveram os níveis. A experiência clínica acumulada e os métodos de ensino atuais não parecem fazer a diferença desejada.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── SEÇÃO 4 — SCOTT MILLER ─── */}
      <section className="relative py-20 md:py-28 bg-[#141414] overflow-hidden" style={DOT_GRID}>
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Reveal>
            <SectionBadge>Capítulo 04</SectionBadge>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em" }}>
              As Descobertas de <span className="italic text-[#C84B31]">Scott Miller</span>
            </h2>
            <p className="max-w-[720px] mb-12" style={{ color: "rgba(253,251,247,0.5)" }}>
              Passaram a focar pesquisas comparando psicoterapeutas cujos pacientes apresentaram grande melhora e aqueles cujos resultados foram piores. As diferenças são enormes.
            </p>
          </Reveal>

          {/* Dois cards topo */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                label: "Diferença entre Terapeutas",
                text: "As diferenças entre profissionais excelentes e os de desempenho insatisfatório são enormes, chegando a uma taxa de suicídio dos pacientes até 10 vezes menor entre os clínicos de alto desempenho. Não é marginal — é o abismo entre vida e morte.",
              },
              {
                label: "Autoavaliação vs. Percepção do Paciente",
                text: "Quando o próprio terapeuta se avalia como sensível, não há correlação com sucesso clínico. A percepção que o terapeuta tem de si mesmo não faz diferença. Porém, quando os pacientes relatam que o terapeuta é sensível, há correlação com melhores resultados — embora correlação não implique causalidade.",
              },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="rounded-xl p-7" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
                  <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase mb-4">{c.label}</p>
                  <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Achados — Timeline */}
          <Reveal>
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] mb-8" style={{ fontSize: "clamp(20px,2.5vw,28px)" }}>
              Achados Contraintuitivos
            </h3>
          </Reveal>

          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-[2px] rounded-full" style={{ background: "linear-gradient(to bottom,#C84B31,rgba(200,75,49,.1))" }} />

            {[
              {
                title: "O Melhor Preditor: Insegurança",
                text: "Cerca de 80% dos psicólogos acreditam atender acima da média. Um dos fatores que mais se correlaciona com bom desempenho é não ter essa certeza. Terapeutas inseguros sentem necessidade de se esforçar mais — estudam, treinam, revisam práticas — por conta de um mecanismo semelhante à síndrome do impostor. A certeza excessiva é inimiga da excelência.",
              },
              {
                title: "Aliança: Rupturas e Reparações",
                text: "As melhores alianças terapêuticas são marcadas por constantes rupturas e reestabelecimentos. Uma relação que se mantém estável demais — sempre acolhendo de forma passiva ou sempre adotando postura agressiva — tende a ser menos produtiva. O padrão ideal é aquele em que ocorrem conflitos e, em seguida, a reparação da aliança.",
              },
              {
                title: "A Autoilusão Universal",
                text: "Há um nível elevado de autoengano. Pesquisas mostram que 10% das pessoas acreditam que poderiam vencer uma luta contra um leão. 70% dos motoristas acreditam dirigir acima da média — algo matematicamente impossível. Na psicologia, essa ilusão de competência também aparece de forma marcante.",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="relative mb-10 pl-6">
                  <div className="absolute -left-8 top-[6px] w-6 h-6 rounded-full bg-[#1A1A1A]" style={{ border: "2px solid #C84B31" }} />
                  <div className="absolute -left-[21px] top-[13px] w-[10px] h-[10px] rounded-full bg-[#C84B31]" />
                  <h4 className="font-fraunces font-semibold text-[#FDFBF7] mb-2" style={{ fontSize: "clamp(17px,2vw,22px)" }}>{item.title}</h4>
                  <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="rounded-xl p-7 mt-4" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderLeft: "3px solid #C84B31" }}>
              <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>
                Apesar dessas correlações, a literatura ainda não conseguiu determinar exatamente o que faz um bom terapeuta, nem quais passos são necessários para se tornar um. O que se sabe é que <strong className="text-[#FDFBF7]">a diferença entre bons e maus terapeutas é significativa</strong>. Scott Miller defende que a chave é a prática deliberada.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── SEÇÃO 5 — PRÁTICA DELIBERADA ─── */}
      <section className="relative py-20 md:py-28 bg-[#1A1A1A] overflow-hidden">
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Reveal>
            <SectionBadge>Capítulo 05</SectionBadge>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-6" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em" }}>
              Prática Deliberada <span className="italic text-[#C84B31]">em Psicoterapia</span>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <Reveal>
              <p className="leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                É um conceito que vem da dissidência da psicologia do esporte e propõe diferenciar o que é performance do que é treino. Na performance, como em uma pelada de vôlei, a pessoa realiza várias ações sem saber exatamente o que está funcionando. Já no treino, o treinador fornece feedback específico sobre cada movimento, permitindo que o atleta pratique de forma direcionada.
              </p>
              <p className="leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                Pessoas clinicamente excelentes, seja de forma intuitiva ou consciente, treinam de maneira específica, recebendo feedback externo e repetindo os movimentos, quebrando tanto os aspectos complexos quanto os simples das suas habilidades.
              </p>
              <p className="leading-relaxed mb-4" style={{ color: "rgba(253,251,247,0.55)" }}>
                O insight de Miller é que a aprendizagem na psicologia não acontece dessa forma. Em vez de praticar e receber feedback, os estudantes geralmente escutam as ideias dos professores sem a oportunidade de praticar imediatamente.
              </p>
              <p className="leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                Receber feedback em um caso concreto torna possível identificar com clareza os erros e definir o que precisa ser ajustado. A teoria é útil para explicar por que certas intervenções funcionam, mas o que realmente faz a diferença é a repetição do exercício, não o simples conhecimento teórico.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl p-7 mb-5" style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.15)", borderLeft: "3px solid rgba(200,75,49,0.55)" }}>
                <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase mb-3">Formação Tradicional</p>
                <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                  <strong className="text-[#FDFBF7]">1° ao 5° ano:</strong> Teoria, teoria, teoria<br />
                  <strong className="text-[#FDFBF7]">6° ano:</strong> Estágio supervisionado (primeira prática real)
                </p>
                <p className="font-dm text-[13px] italic mt-3" style={{ color: "rgba(253,251,247,0.3)" }}>
                  Alunos ouvem ideias sem praticá-las imediatamente. Quando finalmente praticam, cristalizaram vícios difíceis de corrigir.
                </p>
              </div>

              <h4 className="font-fraunces font-semibold text-[#FDFBF7] mb-3 mt-8" style={{ fontSize: "18px" }}>O Modelo de Miller</h4>
              <p className="font-dm text-sm leading-relaxed mb-5" style={{ color: "rgba(253,251,247,0.5)" }}>
                Scott Miller defende a prática deliberada individual, altamente reflexiva e baseada em autoavaliação. Como um jogador de basquete que treina fundamentos por 20 anos, focando em exercícios simples executados continuamente.
              </p>

              <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderLeft: "3px solid rgba(139,92,246,.5)" }}>
                <p className="font-dm text-[13px] font-semibold mb-2" style={{ color: "#8B5CF6" }}>⚠ O Problema do Modelo de Miller</p>
                <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>
                  O método é repetitivo e maçante. Miller apresentou <strong className="text-[#FDFBF7]">20% de perda de dados</strong> por conta da baixa adesão dos terapeutas. O treinamento é individual, altamente reflexivo e depende de autoavaliação constante — desmotivador e difícil de sustentar.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── SEÇÃO 6 — INOVAÇÃO ALLOS ─── */}
      <section className="relative py-20 md:py-28 bg-[#141414] overflow-hidden">
        <Grain />
        <GlowTL />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Reveal>
            <SectionBadge>Capítulo 06</SectionBadge>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em" }}>
              A Inovação <span className="italic text-[#C84B31]">Allos</span>
            </h2>
            <p className="max-w-[720px] mb-6" style={{ color: "rgba(253,251,247,0.5)" }}>
              A Associação Allos desenvolveu uma metodologia que resolve os problemas identificados — combinando rigor científico com engajamento, dinâmica grupal e criatividade pedagógica.
            </p>
          </Reveal>

          {/* Princípio central */}
          <Reveal>
            <div className="rounded-2xl p-9 mb-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(200,75,49,.06),rgba(200,75,49,.02))", border: "1px solid rgba(200,75,49,.25)" }}>
              <p className="absolute right-[-12px] bottom-[-12px] font-fraunces font-bold select-none pointer-events-none" style={{ fontSize: "clamp(60px,10vw,140px)", color: "#FDFBF7", opacity: 0.025 }}>Allos</p>
              <h3 className="font-fraunces font-semibold text-[#FDFBF7] mb-4" style={{ fontSize: "22px" }}>O Princípio Central</h3>
              <p className="font-dm text-[15px] leading-relaxed" style={{ color: "rgba(253,251,247,0.6)" }}>
                A Allos combina <strong className="text-[#FDFBF7]">treino com performance</strong>. Em vez de separar aprendizado e atendimento, o modelo integra os dois. A Allos junta treino com performance — diferente de Miller, que foca apenas em fundamentos repetitivos. A proposta é criar um ambiente de aprendizado dinâmico e participativo, que combine exercícios simples e complexos, individuais e coletivos.
              </p>
            </div>
          </Reveal>

          {/* 4 cards pilares */}
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {[
              {
                label: "Dinâmica Grupal",
                text: "Em vez do modelo individual e solitário de Miller, a Allos usa dinâmicas de grupo que tornam o treinamento engajante e social. Exercícios variam entre simples e complexos, mantendo o interesse e a motivação.",
              },
              {
                label: "Avaliação por Pares",
                text: "Uma pessoa observando o atendimento pode identificar aspectos inconscientes que o próprio terapeuta não percebe ou não consegue descrever. Se perguntar ao cliente, ele pode dizer que foi boa sem perceber os pontos que precisam ser melhorados.",
              },
              {
                label: "Sem Gabarito Fixo",
                text: "Os exercícios não possuem gabarito fixo. O próprio processo de refletir sobre as respostas ideais já faz parte do treino. Não existe um estilo de comunicação — irônico, doce, confrontativo — que funcione sempre ou nunca.",
              },
              {
                label: "Roleplays Decompositivos",
                text: "O papel do terapeuta é testado em simulações. A avaliação acontece pela reconstrução das intervenções: o que funcionou? O que não funcionou? Por quê? A intervenção é desmembrada em aspectos como frase, entonação, timing e fundamentos.",
              },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="rounded-xl p-6 h-full" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderLeft: "3px solid #C84B31" }}>
                  <p className="font-dm font-semibold text-xs tracking-widest text-[#C84B31] uppercase mb-3">{c.label}</p>
                  <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* COMPARAÇÃO */}
          <Reveal>
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] mb-6" style={{ fontSize: "clamp(20px,2.5vw,28px)" }}>
              Allos vs. Miller: Diferenças Fundamentais
            </h3>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Reveal delay={0.05}>
              <div className="rounded-2xl p-7 h-full" style={{ background: "rgba(255,255,255,.035)", border: "1px solid rgba(255,255,255,.08)" }}>
                <h3 className="font-fraunces font-semibold text-lg mb-4" style={{ color: "rgba(253,251,247,.85)" }}>Scott Miller</h3>
                <div className="space-y-3">
                  {[
                    "Apenas intervenções suportadas pela literatura",
                    "Treino individual, solitário",
                    "Foco apenas em fundamentos",
                    "Repetitivo — 20% de perda de dados",
                    "Autoavaliação como base",
                    "Sem decomposição de intervenções",
                  ].map((t, i) => (
                    <p key={i} className="font-dm text-sm flex items-start gap-2 pb-3" style={{ color: "rgba(253,251,247,0.45)", borderBottom: "1px solid rgba(253,251,247,.06)" }}>
                      <span className="text-[#C84B31] font-semibold mt-0.5">→</span> {t}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-2xl p-7 h-full" style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.25)" }}>
                <h3 className="font-fraunces font-semibold text-lg text-[#FDFBF7] mb-4">Associação Allos</h3>
                <div className="space-y-3">
                  {[
                    "Valoriza plausibilidade (ex: interpretação, mesmo sem estudos)",
                    "Dinâmica grupal engajante",
                    "Mix de simples e complexo",
                    "Alta adesão e motivação",
                    "Avaliação por pares + autoavaliação",
                    "Decomposição: frase, entonação, timing, fundamentos",
                    "Remuneração financeira ligada à melhora clínica",
                  ].map((t, i) => (
                    <p key={i} className="font-dm text-sm flex items-start gap-2 pb-3" style={{ color: "rgba(253,251,247,0.55)", borderBottom: "1px solid rgba(200,75,49,.1)" }}>
                      <span className="text-[#C84B31] font-semibold mt-0.5">→</span> {t}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* SUPERVISÃO */}
          <Reveal>
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(20px,2.5vw,28px)" }}>
              O Modelo de Supervisão
            </h3>
            <p className="max-w-[700px] mb-8" style={{ color: "rgba(253,251,247,0.5)" }}>
              Um modelo de supervisão eficaz deve incorporar exercícios práticos. Em vez de levar o profissional apenas para formular um caso difícil, é importante treinar na prática os elementos causando dificuldades.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-xl p-6" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
                <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-3">Supervisão Tradicional</p>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.45)" }}>
                  Discute o caso → formula hipóteses → sugere direção. O terapeuta aprende a resolver aquele caso específico, mas o aprendizado acaba sendo muito particular, não necessariamente transferível para outros contextos.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-xl p-6" style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.15)", borderLeft: "3px solid rgba(200,75,49,0.55)" }}>
                <p className="font-dm text-[13px] font-semibold text-[#C84B31] mb-3">Supervisão Allos</p>
                <p className="font-dm text-sm" style={{ color: "rgba(253,251,247,0.6)" }}>
                  Usa o caso como ponto de partida para formular <strong className="text-[#FDFBF7]">princípios abstratos e transferíveis</strong>. Pratica os elementos problemáticos com feedback específico — como treinamentos esportivos onde cada movimento é corrigido. O erro não é a intervenção em si, mas a incapacidade de lidar com suas consequências.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── INSIGHT EPISTEMOLÓGICO ─── */}
      <section className="relative py-16 md:py-24 bg-[#1A1A1A] overflow-hidden">
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Ornament />
          <Reveal>
            <div className="text-center max-w-[800px] mx-auto rounded-2xl p-10 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(200,75,49,.06),rgba(200,75,49,.02))", border: "1px solid rgba(200,75,49,.25)" }}>
              <h3 className="font-fraunces font-semibold text-[#FDFBF7] mb-5" style={{ fontSize: "clamp(22px,3vw,32px)" }}>
                O Insight <span className="italic text-[#C84B31]">Epistemológico</span>
              </h3>
              <p className="font-dm text-[15px] leading-relaxed mb-6" style={{ color: "rgba(253,251,247,0.6)" }}>
                A ciência deve adaptar seus métodos ao objeto de estudo — não o contrário. Mesmo que algo seja altamente plausível, como investigar interpretação, alguns pesquisadores evitam investigá-lo por falta de literatura. Se não ajustarmos o método ao objeto, deixa de ser ciência — o que é epistemologicamente fraco.
              </p>
              <p className="font-fraunces italic text-[16px]" style={{ color: "rgba(253,251,247,0.4)" }}>
                A ciência consiste em criar métodos inovadores para solucionar problemas, medindo-os corretamente. Respeitar o objeto e encontrar maneiras de abordá-lo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── SEÇÃO 7 — AVALIALLOS ─── */}
      <section className="relative py-20 md:py-28 bg-[#141414] overflow-hidden">
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Reveal>
            <SectionBadge>Capítulo 07</SectionBadge>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em" }}>
              O Sistema <span className="italic text-[#C84B31]">AvaliAllos</span>
            </h2>
            <p className="max-w-[720px] mb-12" style={{ color: "rgba(253,251,247,0.5)" }}>
              A materialização prática de toda essa filosofia: um sistema rigoroso de avaliação de competências clínicas que traduz os princípios da prática deliberada em métricas concretas.
            </p>
          </Reveal>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-6 mb-16">
            {[
              { num: "200+", label: "pacientes atendidos", w: "100%" },
              { num: "80+", label: "terapeutas formados", w: "85%" },
              { num: "~5%", label: "aprovação na 1ª tentativa", w: "30%" },
            ].map((m, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center py-6">
                  <div className="w-full h-[3px] rounded-full mb-4" style={{ background: "rgba(253,251,247,.06)" }}>
                    <motion.div
                      className="h-full rounded-full bg-[#C84B31]"
                      initial={{ width: 0 }}
                      whileInView={{ width: m.w }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: SPRING }}
                    />
                  </div>
                  <p className="font-fraunces font-bold text-[#C84B31]" style={{ fontSize: "clamp(36px,5vw,60px)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {m.num}
                  </p>
                  <p className="font-dm text-[13px] mt-2" style={{ color: "rgba(253,251,247,0.45)" }}>{m.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Grade de Competências */}
          <Reveal>
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] mb-2" style={{ fontSize: "clamp(20px,2.5vw,28px)" }}>
              Grade de Competências
            </h3>
            <p className="font-dm text-sm mb-8" style={{ color: "rgba(253,251,247,0.45)" }}>
              Clique em qualquer competência para explorar em detalhes.
            </p>
          </Reveal>

          {COMPETENCIAS.map((group, gi) => (
            <Reveal key={gi} delay={gi * 0.08}>
              <div className="flex items-center gap-2.5 mt-8 mb-3">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: CAT_COLORS[group.cat] }} />
                <p className="font-dm font-semibold text-[10px] tracking-[.2em] uppercase" style={{ color: "rgba(253,251,247,0.3)" }}>
                  {group.cat}
                </p>
                <div className="flex-1 h-px" style={{ background: "rgba(253,251,247,0.05)" }} />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.items.map((item, ii) => (
                  <motion.a
                    key={ii}
                    href={COMP_LINKS[item] || "#"}
                    className="group rounded-[10px] py-4 px-5 block no-underline"
                    style={{
                      background: "rgba(253,251,247,0.022)",
                      border: "1px solid rgba(253,251,247,0.055)",
                      borderLeft: `3px solid ${CAT_COLORS[group.cat]}`,
                    }}
                    whileHover={{ y: -3, boxShadow: `0 8px 24px rgba(0,0,0,.2), 0 0 0 1px ${CAT_COLORS[group.cat]}30` }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="font-dm text-sm group-hover:text-[#FDFBF7] transition-colors" style={{ color: "rgba(253,251,247,0.55)" }}>
                      {item}
                    </p>
                    <p className="font-dm text-[11px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: CAT_COLORS[group.cat] }}>Explorar →</p>
                  </motion.a>
                ))}
              </div>
            </Reveal>
          ))}

          {/* Formação CTA */}
          <Reveal>
            <div className="mt-14 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.06)" }}>
              <div>
                <p className="font-dm text-[11px] tracking-[.2em] uppercase mb-2" style={{ color: "rgba(253,251,247,0.35)" }}>Quer ir além?</p>
                <p className="font-fraunces font-bold text-[#FDFBF7] text-lg">Conheça nossa formação contínua</p>
                <p className="font-dm text-sm mt-1" style={{ color: "rgba(253,251,247,0.4)" }}>Supervisão, grupos práticos e desenvolvimento clínico estruturado.</p>
              </div>
              <motion.a href={`${basePath}/formacao`}
                className="flex-shrink-0 inline-flex items-center gap-2 font-dm font-semibold text-sm text-white rounded-full"
                style={{ padding: "12px 28px", background: "#C84B31" }}
                whileHover={{ scale: 1.04, boxShadow: "0 6px 20px rgba(200,75,49,.3)" }}
                whileTap={{ scale: 0.97 }}>
                Conhecer a formação
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </motion.a>
            </div>
          </Reveal>

          {/* Conclusão */}
          <Reveal>
            <div className="rounded-xl p-7 mt-12 relative" style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.15)" }}>
              <span className="absolute top-2 left-4 font-fraunces text-[56px] leading-none text-[#C84B31] opacity-30">{'"'}</span>
              <p className="font-dm text-[15px] italic leading-relaxed pl-4" style={{ color: "rgba(253,251,247,0.6)" }}>
                O modelo Allos é, acima de tudo, um compromisso ético: acreditar que é possível medir, treinar e elevar continuamente a qualidade do cuidado psicológico — sem simplificar o que é, por natureza, complexo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="relative py-32 bg-[#0F0F0F] overflow-hidden text-center">
        <Grain />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none" style={{ background: "radial-gradient(ellipse at bottom,rgba(200,75,49,.12) 0%,transparent 70%)" }} />
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-fraunces italic whitespace-nowrap select-none pointer-events-none" style={{ fontSize: "clamp(36px,7vw,92px)", color: "#FDFBF7", opacity: 0.025, letterSpacing: "-0.03em" }}>
          {'"'}Cuidar com rigor é um ato ético{'"'}
        </p>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Ornament />
          <Reveal>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(28px,5vw,52px)", letterSpacing: "-0.02em" }}>
              Transformando Talentos <span className="italic text-[#C84B31]">em Legado</span>
            </h2>
            <p className="max-w-[560px] mx-auto mb-10" style={{ color: "rgba(253,251,247,0.45)" }}>
              A Allos está revolucionando a formação profissional ao combinar ciência, criatividade e engajamento — estabelecendo novos padrões de excelência no treinamento de terapeutas e difundindo mundialmente um modelo de aprendizagem que transforma a educação em saúde mental.
            </p>
            <motion.a
              href={`${basePath}/sobre`}
              className="inline-flex items-center gap-3 font-dm font-semibold text-white bg-[#C84B31] rounded-full"
              style={{ padding: "17px 52px", fontSize: "15px" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  "0 0 0 0px rgba(200,75,49,0.5)",
                  "0 0 0 14px rgba(200,75,49,0)",
                  "0 0 0 0px rgba(200,75,49,0)",
                ],
              }}
              transition={{ boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeOut" } }}
            >
              Conheça a Allos
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
            <p className="font-dm text-sm mt-12" style={{ color: "rgba(253,251,247,0.3)" }}>
              Rua Rio Negro, 1048, Barroca, BH – MG<br />
              suporte@allos.org.br · +55 31 98757-7892
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
