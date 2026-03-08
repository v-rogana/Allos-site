"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── constants ── */
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = [0.34, 1.56, 0.64, 1] as const;
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const COLORS = {
  estrutura: "#C84B31",
  relacao: "#D4854A",
  formulacao: "#B84060",
  performance: "#8B5CF6",
};

/* ── reusable components ── */

function Grain({ opacity = 0.025 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: GRAIN, opacity }}
    />
  );
}

function GlowTL() {
  return (
    <div
      className="absolute top-0 left-0 w-[600px] h-[500px] pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse at top left,rgba(200,75,49,.1) 0%,transparent 65%)",
      }}
    />
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      <div
        className="h-px w-12"
        style={{
          background:
            "linear-gradient(to right,transparent,rgba(200,75,49,0.4))",
        }}
      />
      <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase">
        {label}
      </p>
      <div
        className="h-px flex-1 max-w-[200px]"
        style={{
          background:
            "linear-gradient(to right,rgba(200,75,49,0.4),transparent)",
        }}
      />
    </div>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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

function QuoteBlock({
  children,
  author,
}: {
  children: React.ReactNode;
  author?: string;
}) {
  return (
    <div
      className="relative rounded-2xl p-8 pl-10"
      style={{
        background: "rgba(200,75,49,0.06)",
        border: "1px solid rgba(200,75,49,0.15)",
      }}
    >
      <span
        className="absolute top-2 left-4 font-fraunces text-[64px] text-[#C84B31] opacity-30 leading-none select-none"
        aria-hidden
      >
        &ldquo;
      </span>
      <p
        className="font-dm text-sm leading-relaxed italic"
        style={{ color: "rgba(253,251,247,0.65)" }}
      >
        {children}
      </p>
      {author && (
        <p className="font-dm text-[13px] font-semibold text-[#C84B31] mt-3 not-italic">
          {author}
        </p>
      )}
    </div>
  );
}

function Card({
  children,
  className = "",
  accent = false,
  terra = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  terra?: boolean;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = terra
    ? {
        background: "rgba(200,75,49,0.06)",
        border: "1px solid rgba(200,75,49,0.15)",
        borderLeft: "3px solid rgba(200,75,49,0.5)",
      }
    : {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        ...(accent ? { borderLeft: "3px solid #C84B31" } : {}),
      };
  return (
    <motion.div
      className={`rounded-xl p-7 ${className}`}
      style={{ ...base, ...style }}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-3">
      {children}
    </p>
  );
}

function CompCard({
  name,
  category,
  color,
  active = false,
}: {
  name: string;
  category: string;
  color: string;
  active?: boolean;
}) {
  return (
    <motion.div
      className="rounded-xl py-4 px-5 relative"
      style={{
        background: active ? "rgba(200,75,49,0.15)" : "rgba(253,251,247,0.022)",
        border: active
          ? "1px solid rgba(200,75,49,0.5)"
          : "1px solid rgba(253,251,247,0.055)",
        borderLeft: `3px solid ${color}`,
      }}
      whileHover={{ y: -2, background: "rgba(253,251,247,0.04)" }}
      transition={{ duration: 0.25 }}
    >
      {active && (
        <span
          className="absolute top-2 right-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-dm text-[9px] font-semibold tracking-wider uppercase"
          style={{
            background: "rgba(200,75,49,0.2)",
            border: "1px solid rgba(200,75,49,0.4)",
            color: "#C84B31",
          }}
        >
          <span className="w-1 h-1 rounded-full bg-[#C84B31] animate-pulse" />
          Está aqui
        </span>
      )}
      <p
        className="font-dm text-[10px] font-semibold tracking-[.2em] uppercase mb-1"
        style={{ color }}
      >
        {category}
      </p>
      <p
        className="font-dm text-sm"
        style={{ color: active ? "rgba(253,251,247,0.85)" : "rgba(253,251,247,0.55)" }}
      >
        {name}
      </p>
    </motion.div>
  );
}

/* ── Decorative SVG ── */
function ConcentricCircles({ className = "" }: { className?: string }) {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      style={{ opacity: 0.06 }}
    >
      <circle cx="100" cy="100" r="96" stroke="#C84B31" strokeWidth="0.8" strokeDasharray="8 5" />
      <circle cx="100" cy="100" r="65" stroke="#C84B31" strokeWidth="0.7" strokeDasharray="4 6" />
      <circle cx="100" cy="100" r="35" stroke="#C84B31" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="10" stroke="#C84B31" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="3" fill="#C84B31" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */

export default function AberturaEncerramentoContent() {
  return (
    <div className="relative">

      {/* ─── TOC NAV (sticky) ─── */}
      <nav
        className="hidden lg:flex sticky top-[68px] z-50 items-center justify-center gap-6 py-3 px-6"
        style={{
          background: "rgba(26,26,26,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(253,251,247,0.06)",
        }}
      >
        {[
          ["#assinatura", "A Assinatura Clínica"],
          ["#intencionalidade", "Intencionalidade"],
          ["#coerencia", "Coerência"],
          ["#contrato", "O Contrato"],
          ["#encerramento", "Encerramento"],
          ["#ferramenta", "Ferramenta Terapêutica"],
          ["#competencias", "Competências"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="font-dm text-xs font-medium transition-colors hover:text-[#C84B31]"
            style={{ color: "rgba(253,251,247,0.45)", letterSpacing: ".02em" }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* ═══════════════════════════════════════
          SEÇÃO 1 — A ASSINATURA CLÍNICA
          ═══════════════════════════════════════ */}
      <section
        id="assinatura"
        className="relative py-20 md:py-28"
        style={{ background: "#1A1A1A" }}
      >
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="Abertura" />

          <Reveal>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {/* left */}
              <div>
                <h2
                  className="font-fraunces font-bold text-[#FDFBF7] mb-6"
                  style={{
                    fontSize: "clamp(28px,4vw,48px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  A Abertura como{" "}
                  <span className="italic text-[#C84B31]">
                    Assinatura Clínica
                  </span>
                </h2>
                <p
                  className="font-dm leading-relaxed"
                  style={{ color: "rgba(253,251,247,0.55)" }}
                >
                  A abertura é o primeiro ato terapêutico. Ela revela, mesmo que
                  implicitamente, a &ldquo;assinatura clínica&rdquo; do
                  terapeuta. Quando feita com intencionalidade, cria um campo
                  para o paciente e um caminho claro para o trabalho.
                </p>
                <p
                  className="font-dm leading-relaxed"
                  style={{ color: "rgba(253,251,247,0.55)" }}
                >
                  A primeira frase ou forma do psicoterapeuta na abertura não é
                  um mero cumprimento ou ritual vazio. Ela funciona como um{" "}
                  <strong className="text-[#FDFBF7]">
                    microcosmo da abordagem teórica
                  </strong>{" "}
                  e da postura clínica que guiará todo o processo terapêutico.
                </p>
                <p
                  className="font-dm leading-relaxed"
                  style={{ color: "rgba(253,251,247,0.45)" }}
                >
                  Em abordagens distintas pode haver formas distintas de começar
                  uma sessão. Isso depende tanto do contexto quanto da
                  perspectiva adotada.
                </p>
              </div>

              {/* right — highlight box */}
              <div>
                <div
                  className="rounded-2xl p-8 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(200,75,49,0.06),rgba(200,75,49,0.02))",
                    border: "1px solid rgba(200,75,49,0.25)",
                  }}
                >
                  <span
                    className="absolute -right-3 -bottom-3 font-fraunces font-bold text-[#FDFBF7] pointer-events-none select-none"
                    style={{
                      fontSize: "clamp(60px,10vw,120px)",
                      opacity: 0.025,
                      lineHeight: 1,
                    }}
                    aria-hidden
                  >
                    01
                  </span>
                  <ConcentricCircles className="absolute -right-6 -top-6 pointer-events-none" />

                  <Label>Princípio Fundamental</Label>
                  <p
                    className="font-dm text-[15px] leading-relaxed"
                    style={{ color: "rgba(253,251,247,0.65)" }}
                  >
                    A abertura não é ritual — é{" "}
                    <strong className="text-[#FDFBF7]">revelação</strong>. O modo
                    como o terapeuta inicia a sessão comunica sua abordagem
                    teórica, sua postura relacional e sua leitura daquele
                    paciente específico.
                  </p>
                </div>

                <QuoteBlock>
                  Muitas vezes a dificuldade de o psicoterapeuta aprofundar-se na
                  sessão inicia da forma como conduziu a abertura.
                </QuoteBlock>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEÇÃO 2 — INTENCIONALIDADE
          ═══════════════════════════════════════ */}
      <section
        id="intencionalidade"
        className="relative py-20 md:py-28"
        style={{ background: "#141414" }}
      >
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="Intencionalidade" />

          <Reveal>
            <h2
              className="font-fraunces font-bold text-[#FDFBF7] mb-6"
              style={{
                fontSize: "clamp(28px,4vw,48px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              A Abertura Genérica{" "}
              <span className="italic text-[#C84B31]">é um Risco</span>
            </h2>
            <p
              className="font-dm mb-12"
              style={{
                color: "rgba(253,251,247,0.45)",
                maxWidth: 720,
              }}
            >
              Uma abertura genérica só ganha significado se estiver
              intencionalmente vinculada à forma como o terapeuta trabalha. Caso
              contrário, passa a impressão de desconexão com o método.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Sem intencionalidade */}
              <Card>
                <Label>Sem Intencionalidade</Label>
                <div className="space-y-4">
                  <div
                    className="rounded-lg p-4"
                    style={{
                      background: "rgba(253,251,247,0.025)",
                      border: "1px solid rgba(253,251,247,0.06)",
                    }}
                  >
                    <p
                      className="font-dm text-sm italic"
                      style={{ color: "rgba(253,251,247,0.4)" }}
                    >
                      &ldquo;Como foi sua semana?&rdquo;
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-4"
                    style={{
                      background: "rgba(253,251,247,0.025)",
                      border: "1px solid rgba(253,251,247,0.06)",
                    }}
                  >
                    <p
                      className="font-dm text-sm italic"
                      style={{ color: "rgba(253,251,247,0.4)" }}
                    >
                      &ldquo;O que te traz aqui hoje?&rdquo;
                    </p>
                  </div>
                  <p
                    className="font-dm text-[13px]"
                    style={{ color: "rgba(253,251,247,0.4)" }}
                  >
                    Essas perguntas{" "}
                    <strong className="text-[#FDFBF7]">
                      podem funcionar perfeitamente
                    </strong>{" "}
                    — mas apenas se o terapeuta sabe por que as escolheu e como
                    elas se vinculam ao restante da condução. Desconectadas do
                    método, são rituais vazios.
                  </p>
                </div>
              </Card>

              {/* Analogia */}
              <Card terra>
                <Label>A Analogia da Viagem</Label>
                <p
                  className="font-dm text-sm leading-relaxed"
                  style={{ color: "rgba(253,251,247,0.6)" }}
                >
                  Iniciar de um jeito e agir de outro durante a sessão é como
                  começar uma viagem anunciando um destino e, no meio do
                  caminho,{" "}
                  <strong className="text-[#FDFBF7]">
                    mudar a rota sem explicação
                  </strong>
                  .
                </p>
                <div
                  className="mt-5 pt-5"
                  style={{
                    borderTop: "1px solid rgba(200,75,49,0.15)",
                  }}
                >
                  <p
                    className="font-dm text-sm"
                    style={{ color: "rgba(253,251,247,0.5)" }}
                  >
                    Se o terapeuta pergunta o que trouxe o paciente à sessão, mas
                    rapidamente deixa de lado essa questão para focar em outros
                    aspectos, a mensagem inicial perde credibilidade. A abertura
                    precisa ser um{" "}
                    <strong className="text-[#FDFBF7]">
                      compromisso implícito
                    </strong>{" "}
                    com o que virá a seguir.
                  </p>
                </div>
              </Card>
            </div>
          </Reveal>

          {/* Insight box */}
          <Reveal>
            <div
              className="rounded-2xl p-8 relative"
              style={{
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.2)",
                borderLeft: "4px solid #8B5CF6",
              }}
            >
              <p
                className="font-dm font-semibold text-[11px] tracking-[.26em] uppercase mb-3"
                style={{ color: "#8B5CF6" }}
              >
                Insight Clínico
              </p>
              <p
                className="font-dm text-sm"
                style={{ color: "rgba(253,251,247,0.65)" }}
              >
                A intencionalidade não exige complexidade. Um simples
                &ldquo;Como foi sua semana?&rdquo; pode ser uma abertura
                brilhante — desde que o terapeuta saiba{" "}
                <strong className="text-[#FDFBF7]">
                  por que escolheu essa pergunta
                </strong>{" "}
                para esse paciente, nesse momento, e como ela se conecta com o
                método de trabalho.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEÇÃO 3 — COERÊNCIA
          ═══════════════════════════════════════ */}
      <section
        id="coerencia"
        className="relative py-20 md:py-28"
        style={{ background: "#1A1A1A" }}
      >
        <Grain />
        <GlowTL />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <SectionDivider label="Coerência" />

          <Reveal>
            <h2
              className="font-fraunces font-bold text-[#FDFBF7] mb-6"
              style={{
                fontSize: "clamp(28px,4vw,48px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              A Coerência{" "}
              <span className="italic text-[#C84B31]">
                entre Abertura e Condução
              </span>
            </h2>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <p
                  className="font-dm leading-relaxed mb-4"
                  style={{ color: "rgba(253,251,247,0.55)" }}
                >
                  O ponto central da abertura não é{" "}
                  <em>o que</em> o terapeuta diz, mas se existe{" "}
                  <strong className="text-[#FDFBF7]">
                    coerência entre o que diz na abertura e como conduz o
                    restante da sessão
                  </strong>
                  .
                </p>
                <p
                  className="font-dm leading-relaxed mb-4"
                  style={{ color: "rgba(253,251,247,0.55)" }}
                >
                  Se inicia afirmando que &ldquo;a terapia é um espaço para
                  você falar livremente&rdquo;, mas interrompe o paciente
                  constantemente com conselhos ou redirecionamentos bruscos, a
                  mensagem inicial perde credibilidade.
                </p>

                {/* contradiction examples */}
                <div className="space-y-4 mt-8">
                  <h4 className="font-fraunces font-semibold text-[#FDFBF7] text-lg">
                    Exemplos de Incoerência
                  </h4>

                  {[
                    {
                      abertura: "A terapia é um espaço para você falar livremente.",
                      conduta: "Interrompe o paciente constantemente com conselhos e redirecionamentos bruscos.",
                    },
                    {
                      abertura: "O que te traz à sessão hoje?",
                      conduta: "Rapidamente deixa de lado a questão trazida para focar em outros aspectos sem retornar.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-5"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div className="flex gap-3 mb-3">
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-dm text-[10px] font-bold"
                          style={{
                            background: "rgba(200,75,49,0.15)",
                            color: "#C84B31",
                          }}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <p
                            className="font-dm text-xs font-semibold uppercase tracking-wider mb-1"
                            style={{ color: "rgba(253,251,247,0.35)" }}
                          >
                            Abertura
                          </p>
                          <p
                            className="font-dm text-sm italic"
                            style={{ color: "rgba(253,251,247,0.55)" }}
                          >
                            &ldquo;{item.abertura}&rdquo;
                          </p>
                        </div>
                      </div>
                      <div className="ml-9">
                        <p
                          className="font-dm text-xs font-semibold uppercase tracking-wider mb-1"
                          style={{ color: "rgba(200,75,49,0.6)" }}
                        >
                          Condução incoerente
                        </p>
                        <p
                          className="font-dm text-sm"
                          style={{ color: "rgba(253,251,247,0.4)" }}
                        >
                          {item.conduta}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* right */}
              <div>
                <div
                  className="rounded-2xl p-8 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(200,75,49,0.06),rgba(200,75,49,0.02))",
                    border: "1px solid rgba(200,75,49,0.25)",
                  }}
                >
                  <span
                    className="absolute -right-3 -bottom-3 font-fraunces font-bold text-[#FDFBF7] pointer-events-none select-none"
                    style={{
                      fontSize: "clamp(60px,10vw,120px)",
                      opacity: 0.025,
                      lineHeight: 1,
                    }}
                    aria-hidden
                  >
                    ≡
                  </span>

                  <Label>Princípio da Coerência</Label>
                  <p
                    className="font-dm text-[15px] leading-relaxed mb-5"
                    style={{ color: "rgba(253,251,247,0.65)" }}
                  >
                    A abertura é um{" "}
                    <strong className="text-[#FDFBF7]">
                      contrato implícito
                    </strong>
                    . Cada palavra nela define uma expectativa. Quando o
                    terapeuta quebra esse contrato durante a sessão, o paciente
                    pode perder confiança — mesmo sem saber articular o porquê.
                  </p>

                  <div
                    className="h-px w-full mb-5"
                    style={{
                      background:
                        "linear-gradient(to right,rgba(200,75,49,0.3),transparent)",
                    }}
                  />

                  <p
                    className="font-dm text-sm"
                    style={{ color: "rgba(253,251,247,0.5)" }}
                  >
                    Verificar a coerência entre abertura e condução é uma das
                    competências mais sutis — e mais impactantes — que um
                    terapeuta pode desenvolver.
                  </p>
                </div>

                {/* Diagram: Abertura → Condução → Encerramento */}
                <div className="mt-8">
                  <div className="flex items-center gap-4">
                    {["Abertura", "Condução", "Encerramento"].map(
                      (step, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <motion.div
                            className="rounded-xl px-5 py-3 text-center"
                            style={{
                              background:
                                i === 0
                                  ? "rgba(200,75,49,0.15)"
                                  : i === 2
                                  ? "rgba(200,75,49,0.15)"
                                  : "rgba(255,255,255,0.04)",
                              border:
                                i === 0 || i === 2
                                  ? "1px solid rgba(200,75,49,0.35)"
                                  : "1px solid rgba(255,255,255,0.08)",
                            }}
                            whileHover={{ y: -2 }}
                          >
                            <p
                              className="font-dm text-xs font-semibold"
                              style={{
                                color:
                                  i === 0 || i === 2
                                    ? "#C84B31"
                                    : "rgba(253,251,247,0.5)",
                              }}
                            >
                              {step}
                            </p>
                          </motion.div>
                          {i < 2 && (
                            <svg
                              width="24"
                              height="12"
                              viewBox="0 0 24 12"
                              fill="none"
                              style={{ flexShrink: 0 }}
                            >
                              <path
                                d="M0 6h20M16 1l5 5-5 5"
                                stroke="rgba(200,75,49,0.4)"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      )
                    )}
                  </div>
                  <p
                    className="font-dm text-xs mt-4"
                    style={{ color: "rgba(253,251,247,0.3)" }}
                  >
                    A coerência entre os três momentos define a credibilidade do
                    processo.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEÇÃO 4 — O CONTRATO TERAPÊUTICO
          ═══════════════════════════════════════ */}
      <section
        id="contrato"
        className="relative py-20 md:py-28"
        style={{ background: "#141414" }}
      >
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="O Contrato" />

          <Reveal>
            <h2
              className="font-fraunces font-bold text-[#FDFBF7] mb-4"
              style={{
                fontSize: "clamp(28px,4vw,48px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              O Geral vs.{" "}
              <span className="italic text-[#C84B31]">O Seu</span>
            </h2>
            <p
              className="font-dm mb-12"
              style={{
                color: "rgba(253,251,247,0.45)",
                maxWidth: 720,
              }}
            >
              A escolha entre pontuar &ldquo;como a terapia funciona no
              geral&rdquo; ou &ldquo;como a SUA terapia funciona&rdquo; é uma
              decisão clínica estratégica.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card>
                <Label>A Terapia no Geral</Label>
                <p
                  className="font-dm text-sm mb-4"
                  style={{ color: "rgba(253,251,247,0.5)" }}
                >
                  Não há equívoco em mencionar aspectos gerais: o caráter
                  sigiloso, o espaço de escuta, a proposta de acolhimento. Pode
                  ser útil quando o paciente demonstra insegurança sobre o que
                  esperar.
                </p>
                <div
                  className="rounded-lg p-4"
                  style={{
                    background: "rgba(253,251,247,0.025)",
                    border: "1px solid rgba(253,251,247,0.06)",
                  }}
                >
                  <p
                    className="font-dm text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "rgba(253,251,247,0.35)" }}
                  >
                    Risco
                  </p>
                  <p
                    className="font-dm text-sm"
                    style={{ color: "rgba(253,251,247,0.4)" }}
                  >
                    Pacientes com experiência prévia já pressupõem
                    confidencialidade e escuta. Repetir pode soar mecânico, como
                    se o terapeuta seguisse um roteiro pré-definido sem
                    adaptação. Em alguns contextos, pode até soar ameaçador.
                  </p>
                </div>
              </Card>

              <Card terra>
                <Label>A SUA Terapia</Label>
                <p
                  className="font-dm text-sm mb-4"
                  style={{ color: "rgba(253,251,247,0.6)" }}
                >
                  Introduzir elementos do contrato e da metodologia de forma{" "}
                  <strong className="text-[#FDFBF7]">orgânica</strong>, à medida
                  que surgem questões relevantes, torna a explicação
                  contextualizada e significativa na vida do paciente.
                </p>
                <div
                  className="rounded-lg p-4"
                  style={{
                    background: "rgba(200,75,49,0.06)",
                    border: "1px solid rgba(200,75,49,0.15)",
                    borderLeft: "3px solid rgba(200,75,49,0.5)",
                  }}
                >
                  <p
                    className="font-dm text-xs font-semibold uppercase tracking-wider text-[#C84B31] mb-2"
                  >
                    Exemplo
                  </p>
                  <p
                    className="font-dm text-sm italic leading-relaxed"
                    style={{ color: "rgba(253,251,247,0.65)" }}
                  >
                    Se um paciente menciona medo de ser julgado, o terapeuta pode
                    aproveitar: &ldquo;Aqui, minha prioridade é compreender sua
                    experiência, não avaliar certo ou errado.&rdquo;
                  </p>
                </div>
              </Card>
            </div>
          </Reveal>

          {/* Fatores contextuais */}
          <Reveal>
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] text-xl mb-6">
              Fatores que Influenciam a Decisão
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  title: "Demanda do Paciente",
                  text: "O momento emocional e as expectativas do paciente determinam a profundidade necessária da contextualização inicial.",
                },
                {
                  title: "Momento do Tratamento",
                  text: "Primeira sessão vs. retorno. O contrato terapêutico pode ser construído gradualmente ao longo das primeiras sessões.",
                },
                {
                  title: "Aspectos Culturais",
                  text: "Pacientes em contextos onde a terapia é estigmatizada podem precisar de mais garantias iniciais sobre sigilo. Outros, mais informados, beneficiam-se de imersão imediata.",
                },
              ].map((item, i) => (
                <Card accent key={i}>
                  <h4 className="font-fraunces font-semibold text-[#FDFBF7] text-base mb-2">
                    {item.title}
                  </h4>
                  <p
                    className="font-dm text-sm"
                    style={{ color: "rgba(253,251,247,0.5)" }}
                  >
                    {item.text}
                  </p>
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <QuoteBlock>
              O essencial é que o terapeuta não automatize discursos, mas use cada
              intervenção — inclusive as aparentemente genéricas — com consciência
              de seu propósito dentro da estrutura teórica e relacional que
              sustenta seu trabalho.
            </QuoteBlock>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEÇÃO 5 — ENCERRAMENTO
          ═══════════════════════════════════════ */}
      <section
        id="encerramento"
        className="relative py-20 md:py-28"
        style={{ background: "#1A1A1A" }}
      >
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <Ornament />
          <SectionDivider label="Encerramento" />

          <Reveal>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <h2
                  className="font-fraunces font-bold text-[#FDFBF7] mb-6"
                  style={{
                    fontSize: "clamp(28px,4vw,48px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  O Encerramento{" "}
                  <span className="italic text-[#C84B31]">
                    Começa no Início
                  </span>
                </h2>
                <p
                  className="font-dm leading-relaxed mb-4"
                  style={{ color: "rgba(253,251,247,0.55)" }}
                >
                  O encerramento de uma sessão psicoterapêutica é tão crucial
                  quanto a abertura, pois define a impressão que permanece no
                  paciente e influencia sua motivação para continuar o processo.
                </p>
                <p
                  className="font-dm leading-relaxed mb-4"
                  style={{ color: "rgba(253,251,247,0.55)" }}
                >
                  Ao contrário do que parece, o encerramento{" "}
                  <strong className="text-[#FDFBF7]">
                    não começa nos minutos finais
                  </strong>
                  , mas sim desde o primeiro momento em que terapeuta e paciente
                  se conectam. Cada intervenção, cada silêncio, cada pergunta
                  constrói um caminho que deve convergir para um fechamento
                  intencional.
                </p>
              </div>

              <div>
                <div
                  className="rounded-2xl p-8 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(200,75,49,0.06),rgba(200,75,49,0.02))",
                    border: "1px solid rgba(200,75,49,0.25)",
                  }}
                >
                  <span
                    className="absolute -right-3 -bottom-3 font-fraunces font-bold text-[#FDFBF7] pointer-events-none select-none"
                    style={{
                      fontSize: "clamp(60px,10vw,120px)",
                      opacity: 0.025,
                      lineHeight: 1,
                    }}
                    aria-hidden
                  >
                    02
                  </span>

                  <Label>Princípio do Encerramento</Label>
                  <p
                    className="font-dm text-[15px] leading-relaxed"
                    style={{ color: "rgba(253,251,247,0.65)" }}
                  >
                    Um encerramento eficaz{" "}
                    <strong className="text-[#FDFBF7]">
                      não é só uma despedida
                    </strong>
                    , mas uma ferramenta terapêutica. Ele pode ser uma síntese
                    clara, uma provocação reflexiva, um gancho para a próxima
                    sessão — ou algo além que o terapeuta decida.
                  </p>
                </div>

                <div
                  className="mt-6 rounded-xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    className="font-dm text-sm"
                    style={{ color: "rgba(253,251,247,0.5)" }}
                  >
                    O momento final é uma oportunidade para criar{" "}
                    <strong className="text-[#FDFBF7]">impacto</strong>. Seja
                    fechando um raciocínio ou deixando uma pergunta em aberto que
                    ecoe até o próximo encontro. O encerramento possui um aspecto
                    de{" "}
                    <strong className="text-[#FDFBF7]">expectativa</strong> para
                    o paciente — mais direcionada (como nas comportamentais) ou
                    mais flexível.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEÇÃO 6 — FERRAMENTA TERAPÊUTICA
          ═══════════════════════════════════════ */}
      <section
        id="ferramenta"
        className="relative py-20 md:py-28"
        style={{
          background: "#141414",
          backgroundImage:
            "radial-gradient(circle, rgba(200,75,49,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        <Grain />
        <GlowTL />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <SectionDivider label="Na Prática" />

          <Reveal>
            <h2
              className="font-fraunces font-bold text-[#FDFBF7] mb-4"
              style={{
                fontSize: "clamp(28px,4vw,48px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              O Encerramento como{" "}
              <span className="italic text-[#C84B31]">
                Ferramenta Terapêutica
              </span>
            </h2>
            <p
              className="font-dm mb-12"
              style={{
                color: "rgba(253,251,247,0.45)",
                maxWidth: 720,
              }}
            >
              Uma das estratégias possíveis é conectar elementos aparentemente
              desconexos que surgiram durante a sessão — transformando o
              encerramento em um convite à continuidade.
            </p>
          </Reveal>

          {/* EXEMPLO CLÍNICO */}
          <Reveal>
            <div
              className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
              style={{
                background: "rgba(200,75,49,0.06)",
                border: "1px solid rgba(200,75,49,0.15)",
                borderLeft: "3px solid rgba(200,75,49,0.5)",
              }}
            >
              <p className="font-dm text-xs font-semibold tracking-widest uppercase text-[#C84B31] mb-4">
                Exemplo Clínico
              </p>
              <div className="space-y-5">
                <div>
                  <p
                    className="font-dm text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "rgba(253,251,247,0.35)" }}
                  >
                    Durante a sessão
                  </p>
                  <p
                    className="font-dm text-sm"
                    style={{ color: "rgba(253,251,247,0.55)" }}
                  >
                    O paciente menciona estresse no trabalho e, casualmente, cita
                    um anime que assistiu.
                  </p>
                </div>
                <div
                  className="h-px"
                  style={{ background: "rgba(200,75,49,0.15)" }}
                />
                <div>
                  <p
                    className="font-dm text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "#C84B31" }}
                  >
                    No encerramento
                  </p>
                  <p
                    className="font-dm text-[15px] italic leading-relaxed"
                    style={{ color: "rgba(253,251,247,0.7)" }}
                  >
                    &ldquo;Percebi que, assim como o personagem do anime se
                    recusava a enfrentar um dilema entre dever e desejo, você
                    descreveu um conflito parecido em relação ao seu chefe. Você
                    percebe que essa questão tem permeado e paralisado toda sua
                    vida? Podemos nos desenvolver mais sobre essas
                    questões.&rdquo;
                  </p>
                </div>
                <div
                  className="h-px"
                  style={{ background: "rgba(200,75,49,0.15)" }}
                />
                <div>
                  <p
                    className="font-dm text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "rgba(253,251,247,0.35)" }}
                  >
                    O que isso demonstra
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Atenção ativa",
                      "Capacidade de síntese",
                      "Construção de sentido",
                      "Convite à continuidade",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full font-dm text-[11px] font-medium"
                        style={{
                          background: "rgba(200,75,49,0.1)",
                          border: "1px solid rgba(200,75,49,0.25)",
                          color: "rgba(253,251,247,0.6)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Possibilidades de encerramento */}
          <Reveal className="mt-12">
            <h3 className="font-fraunces font-semibold text-[#FDFBF7] text-xl mb-6">
              Possibilidades de Encerramento
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Síntese Clara",
                  desc: "Reunir os principais pontos da sessão em uma narrativa coesa que dê ao paciente uma visão integrada.",
                },
                {
                  title: "Provocação Reflexiva",
                  desc: "Deixar uma pergunta em aberto que ecoe até o próximo encontro, mantendo o trabalho ativo entre sessões.",
                },
                {
                  title: "Gancho de Continuidade",
                  desc: "Conectar o que surgiu hoje com o que pode ser explorado na próxima sessão, criando expectativa direcionada.",
                },
                {
                  title: "Algo Além",
                  desc: "Qualquer intervenção que o terapeuta decida, com base no momento clínico. Não há fórmula fixa — há intencionalidade.",
                },
              ].map((item, i) => (
                <Card accent key={i}>
                  <h4 className="font-fraunces font-semibold text-[#FDFBF7] text-base mb-2">
                    {item.title}
                  </h4>
                  <p
                    className="font-dm text-sm"
                    style={{ color: "rgba(253,251,247,0.45)" }}
                  >
                    {item.desc}
                  </p>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEÇÃO 7 — COMPETÊNCIAS GRID
          ═══════════════════════════════════════ */}
      <section
        id="competencias"
        className="relative py-20 md:py-28"
        style={{ background: "#1A1A1A" }}
      >
        <Grain />
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <SectionDivider label="AvaliAllos" />

          <Reveal>
            <h2
              className="font-fraunces font-bold text-[#FDFBF7] mb-3"
              style={{ fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              Grade de <span className="italic text-[#C84B31]">Competências</span>
            </h2>
            <p className="font-dm text-sm mb-8" style={{ color: "rgba(253,251,247,0.45)" }}>
              Clique em qualquer competência para explorar em detalhes.
            </p>
          </Reveal>

          <Reveal>
            {([
              { cat: "Estrutura", color: COLORS.estrutura, items: [
                { name: "Estágio de Mudança", href: "/estagios-mudanca" },
                { name: "Estrutura do Atendimento", href: "/coerencia-consistencia" },
                { name: "Abertura & Encerramento", href: "/abertura-encerramento", active: true },
              ]},
              { cat: "Relação", color: COLORS.relacao, items: [
                { name: "Acolhimento", href: "/acolhimento" },
                { name: "Segurança no Terapeuta", href: "/seguranca-terapeuta" },
                { name: "Segurança no Método", href: "/seguranca-metodo" },
              ]},
              { cat: "Formulação", color: COLORS.formulacao, items: [
                { name: "Aprofundar / Investigação", href: "/aprofundamento" },
                { name: "Hipóteses Clínicas", href: "/hipoteses-clinicas" },
                { name: "Interpretação", href: "/interpretacao" },
              ]},
              { cat: "Performance", color: COLORS.performance, items: [
                { name: "Frase & Timing", href: "/frase-timing" },
                { name: "Corpo & Setting", href: "/setting-corpo" },
                { name: "Insight & Potência", href: "/potencia-insight" },
              ]},
            ]).map(({ cat, color, items }: any) => (
              <div key={cat}>
                <div className="flex items-center gap-2.5 mt-8 mb-3">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                  <p className="font-dm font-semibold text-[10px] tracking-[.2em] uppercase" style={{ color: "rgba(253,251,247,0.3)" }}>{cat}</p>
                  <div className="flex-1 h-px" style={{ background: "rgba(253,251,247,0.05)" }} />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((c: any) => (
                    <motion.a key={c.name} href={c.href}
                      className="group rounded-xl py-4 px-5 relative block no-underline"
                      style={{
                        background: c.active ? `${color}22` : "rgba(253,251,247,0.022)",
                        border: c.active ? `1px solid ${color}70` : "1px solid rgba(253,251,247,0.055)",
                        borderLeft: `3px solid ${color}`,
                      }}
                      whileHover={{ y: -3, boxShadow: `0 8px 24px rgba(0,0,0,.2), 0 0 0 1px ${color}30` }}>
                      {c.active && (
                        <span className="absolute top-2 right-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-dm text-[9px] font-semibold tracking-wider uppercase"
                          style={{ background: `${color}28`, border: `1px solid ${color}50`, color }}>
                          <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: color }} />
                          Está aqui
                        </span>
                      )}
                      <p className="font-dm text-sm group-hover:text-[#FDFBF7] transition-colors"
                        style={{ color: c.active ? "rgba(253,251,247,0.85)" : "rgba(253,251,247,0.55)" }}>{c.name}</p>
                      <p className="font-dm text-[11px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}>Explorar →</p>
                    </motion.a>
                  ))}
                </div>
              </div>
            ))}
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

      {/* ═══════════════════════════════════════
          CTA FINAL
          ═══════════════════════════════════════ */}
      <section
        className="relative py-32 text-center overflow-hidden"
        style={{ background: "#0F0F0F" }}
      >
        <Grain />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at bottom,rgba(200,75,49,.12) 0%,transparent 70%)",
          }}
        />
        <p
          className="absolute font-fraunces italic text-[#FDFBF7] whitespace-nowrap select-none pointer-events-none"
          style={{
            bottom: "40%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "clamp(36px,7vw,92px)",
            opacity: 0.025,
            letterSpacing: "-0.03em",
          }}
          aria-hidden
        >
          &ldquo;Transformando talentos em legado&rdquo;
        </p>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
          <Ornament />
          <Reveal>
            <h2
              className="font-fraunces font-bold text-[#FDFBF7] mb-4"
              style={{
                fontSize: "clamp(28px,5vw,52px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
              }}
            >
              Cada sessão começa{" "}
              <span className="italic text-[#C84B31]">com intenção</span>
            </h2>
            <p
              className="font-dm mx-auto mb-10"
              style={{
                color: "rgba(253,251,247,0.45)",
                maxWidth: 560,
              }}
            >
              Na Allos, a abertura e o encerramento não são rituais. São atos
              clínicos que revelam, constroem e transformam — do primeiro
              segundo ao último.
            </p>
            <motion.a
              href="https://bit.ly/terapiasite"
              target="_blank"
              rel="noopener noreferrer"
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
              transition={{
                boxShadow: {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                },
              }}
            >
              Agendar Sessão
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path
                  d="M1 7.5h12M8 2.5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
            <p
              className="font-dm text-sm mt-12"
              style={{ color: "rgba(253,251,247,0.3)" }}
            >
              Rua Rio Negro, 1048, Barroca, BH – MG
              <br />
              suporte@allos.org.br · +55 31 98757-7892
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
