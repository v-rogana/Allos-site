"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ═══════════════════════════════════════════════
   SHARED DIDATIC PAGE TEMPLATE
   Used by all AvaliAllos competency pages.
   ═══════════════════════════════════════════════ */

const EASE = [0.22, 1, 0.36, 1] as const;
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const CAT_COLORS: Record<string, string> = {
  Estrutura: "#C84B31",
  "Relação": "#D4854A",
  "Formulação": "#B84060",
  Performance: "#8B5CF6",
};

/* ── Types ── */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "example"; label: string; text: string }
  | { type: "quote"; text: string; author?: string }
  | { type: "insight"; text: string }
  | { type: "bullets"; heading?: string; items: string[] }
  | { type: "numbered"; heading?: string; items: string[] }
  | { type: "comparison"; left: { title: string; text: string }; right: { title: string; text: string } }
  | { type: "cards"; items: { title: string; text: string }[] }
  | { type: "divider" }
  | { type: "warning"; text: string }
  | { type: "question"; text: string };

export interface PageSection {
  id: string;
  label: string;
  title: string;
  titleAccent?: string;
  content: ContentBlock[];
}

export interface DidaticPageData {
  accentColor: string;
  category: string;
  activeCompetency: string;
  navItems: { href: string; label: string }[];
  sections: PageSection[];
  ctaTitle: string;
  ctaTitleAccent: string;
  ctaText: string;
}

/* ── Micro components ── */

function Grain({ opacity = 0.025 }: { opacity?: number }) {
  return <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: GRAIN, opacity }} />;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Block Renderers ── */

function RenderBlock({ block, accent, index }: { block: ContentBlock; accent: string; index: number }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="font-dm leading-relaxed mb-4" style={{ fontSize: "15px", color: "rgba(253,251,247,0.55)" }}>
          {block.text}
        </p>
      );

    case "heading":
      return (
        <h3 className="font-fraunces font-bold text-[#FDFBF7] mt-10 mb-4"
          style={{ fontSize: "clamp(22px,3vw,30px)", letterSpacing: "-0.02em" }}>
          {block.text}
        </h3>
      );

    case "subheading":
      return (
        <div className="flex items-center gap-3 mt-8 mb-4">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <p className="font-dm font-semibold text-sm" style={{ color: accent }}>{block.text}</p>
        </div>
      );

    case "example":
      return (
        <div className="rounded-xl p-6 mb-5" style={{
          background: `${accent}0A`,
          border: `1px solid ${accent}25`,
          borderLeft: `3px solid ${accent}80`,
        }}>
          <p className="font-dm text-[10px] font-semibold tracking-[.26em] uppercase mb-2" style={{ color: accent }}>
            {block.label}
          </p>
          <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.62)" }}>
            {block.text}
          </p>
        </div>
      );

    case "quote":
      return (
        <div className="relative pl-6 py-4 mb-5" style={{ borderLeft: `2px solid ${accent}60` }}>
          <span className="absolute -left-3 -top-2 font-fraunces text-4xl select-none" style={{ color: accent, opacity: 0.2 }}>
            &ldquo;
          </span>
          <p className="font-dm text-[15px] italic leading-relaxed" style={{ color: "rgba(253,251,247,0.65)" }}>
            {block.text}
          </p>
          {block.author && (
            <p className="font-dm text-xs mt-2" style={{ color: "rgba(253,251,247,0.3)" }}>— {block.author}</p>
          )}
        </div>
      );

    case "insight":
      return (
        <div className="rounded-2xl p-6 mb-5 relative overflow-hidden" style={{
          background: `${accent}0C`,
          border: `1px solid ${accent}30`,
        }}>
          <div className="absolute top-3 right-4 font-fraunces font-bold text-[40px] leading-none select-none"
            style={{ color: accent, opacity: 0.08 }}>✦</div>
          <p className="font-dm font-semibold text-[10px] tracking-[.26em] uppercase mb-3" style={{ color: accent }}>
            Insight Central
          </p>
          <p className="font-dm text-[15px] leading-relaxed italic" style={{ color: "rgba(253,251,247,0.65)" }}>
            {block.text}
          </p>
        </div>
      );

    case "bullets":
      return (
        <div className="mb-5">
          {block.heading && (
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6" style={{ background: `${accent}60` }} />
              <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase" style={{ color: accent }}>
                {block.heading}
              </p>
              <div className="h-px flex-1" style={{ background: "rgba(253,251,247,0.04)" }} />
            </div>
          )}
          <div className="space-y-3">
            {block.items.map((item, i) => {
              const colonIdx = item.indexOf(":");
              const bold = colonIdx > -1 ? item.slice(0, colonIdx) : "";
              const rest = colonIdx > -1 ? item.slice(colonIdx) : item;
              return (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[9px] opacity-60" style={{ background: accent }} />
                  <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                    {bold && <strong className="font-semibold" style={{ color: "rgba(253,251,247,0.82)" }}>{bold}</strong>}
                    {rest}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      );

    case "numbered":
      return (
        <div className="mb-5">
          {block.heading && (
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6" style={{ background: `${accent}60` }} />
              <p className="font-dm font-semibold text-xs tracking-[.2em] uppercase" style={{ color: accent }}>
                {block.heading}
              </p>
              <div className="h-px flex-1" style={{ background: "rgba(253,251,247,0.04)" }} />
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-3">
            {block.items.map((item, i) => {
              const colonIdx = item.indexOf(":");
              const bold = colonIdx > -1 ? item.slice(0, colonIdx) : "";
              const rest = colonIdx > -1 ? item.slice(colonIdx) : item;
              return (
                <motion.div key={i}
                  className="rounded-xl p-5 flex gap-4 items-start"
                  style={{ background: "rgba(253,251,247,0.02)", border: "1px solid rgba(253,251,247,0.05)" }}
                  whileHover={{ y: -2 }}>
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-dm text-[10px] font-bold"
                    style={{ background: `${accent}18`, color: accent }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.55)" }}>
                    {bold && <strong className="font-semibold" style={{ color: "rgba(253,251,247,0.82)" }}>{bold}</strong>}
                    {rest}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      );

    case "comparison":
      return (
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          {[block.left, block.right].map((side, i) => (
            <div key={i} className="rounded-xl p-6" style={{
              background: i === 0 ? `${accent}08` : "rgba(253,251,247,0.02)",
              border: `1px solid ${i === 0 ? accent + "25" : "rgba(253,251,247,0.06)"}`,
            }}>
              <p className="font-dm font-semibold text-sm mb-3" style={{ color: i === 0 ? accent : "rgba(253,251,247,0.7)" }}>
                {side.title}
              </p>
              <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.5)" }}>{side.text}</p>
            </div>
          ))}
        </div>
      );

    case "cards":
      return (
        <div className={`grid gap-4 mb-5 ${block.items.length <= 2 ? "md:grid-cols-2" : block.items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {block.items.map((card, i) => (
            <motion.div key={i} className="rounded-xl p-6 relative overflow-hidden"
              style={{ background: "rgba(253,251,247,0.02)", border: "1px solid rgba(253,251,247,0.06)" }}
              whileHover={{ y: -3, borderColor: `${accent}30` }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, ${accent}50, transparent)` }} />
              <p className="font-fraunces font-bold text-[15px] mb-2" style={{ color: "rgba(253,251,247,0.85)" }}>{card.title}</p>
              <p className="font-dm text-[13px] leading-relaxed" style={{ color: "rgba(253,251,247,0.45)" }}>{card.text}</p>
            </motion.div>
          ))}
        </div>
      );

    case "warning":
      return (
        <div className="rounded-xl p-5 mb-5 flex gap-4 items-start" style={{
          background: "rgba(220,80,60,0.06)",
          border: "1px solid rgba(220,80,60,0.18)",
        }}>
          <span className="text-lg flex-shrink-0 mt-0.5">⚠</span>
          <p className="font-dm text-sm leading-relaxed" style={{ color: "rgba(253,251,247,0.6)" }}>{block.text}</p>
        </div>
      );

    case "question":
      return (
        <div className="rounded-xl p-5 mb-5" style={{
          background: `${accent}08`,
          border: `1px solid ${accent}20`,
        }}>
          <p className="font-dm text-[15px] leading-relaxed italic" style={{ color: "rgba(253,251,247,0.65)" }}>
            {block.text}
          </p>
        </div>
      );

    case "divider":
      return (
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: accent }} />
          <div className="h-px w-12 opacity-20" style={{ background: accent }} />
          <div className="w-2 h-2 rounded-full opacity-60" style={{ background: accent }} />
          <div className="h-px w-12 opacity-20" style={{ background: accent }} />
          <div className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: accent }} />
        </div>
      );

    default:
      return null;
  }
}

/* ── Section Renderer ── */

function SectionBlock({ section, accent }: { section: PageSection; accent: string }) {
  return (
    <section id={section.id} className="relative py-16 md:py-24" style={{ background: "#1A1A1A" }}>
      <Grain />
      <div className="max-w-[860px] mx-auto px-6 md:px-10 relative z-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: `linear-gradient(to right,transparent,${accent}60)` }} />
            <p className="font-dm font-semibold text-[11px] tracking-[.26em] uppercase" style={{ color: accent }}>
              {section.label}
            </p>
            <div className="h-px flex-1 max-w-[160px]" style={{ background: `linear-gradient(to right,${accent}60,transparent)` }} />
          </div>
          <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-8"
            style={{ fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            {section.title}{" "}
            {section.titleAccent && <span className="italic" style={{ color: accent }}>{section.titleAccent}</span>}
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          {section.content.map((block, i) => (
            <RenderBlock key={i} block={block} accent={accent} index={i} />
          ))}
        </Reveal>
      </div>
      {/* subtle separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "rgba(253,251,247,0.04)" }} />
    </section>
  );
}

/* ── Competency Grid ── */

const ALL_COMPS = [
  { cat: "Estrutura", items: ["Estágio de Mudança", "Estrutura do Atendimento", "Abertura & Encerramento"] },
  { cat: "Relação", items: ["Acolhimento", "Segurança no Terapeuta", "Segurança no Método"] },
  { cat: "Formulação", items: ["Aprofundar / Investigação", "Hipóteses Clínicas", "Interpretação"] },
  { cat: "Performance", items: ["Frase & Timing", "Corpo & Setting", "Insight & Potência"] },
];

function CompGrid({ activeComp, accent }: { activeComp: string; accent: string }) {
  return (
    <section className="relative py-20 md:py-28" style={{ background: "#141414" }}>
      <Grain />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${accent}0F, transparent 70%)` }} />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
        <Reveal>
          <div className="text-center mb-10">
            <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">AvaliAllos</p>
            <h2 className="font-fraunces font-bold text-[#FDFBF7]"
              style={{ fontSize: "clamp(24px,3.5vw,40px)", letterSpacing: "-0.02em" }}>
              Grade de <span className="italic text-[#C84B31]">Competências</span>
            </h2>
          </div>
        </Reveal>
        <Reveal>
          {ALL_COMPS.map(({ cat, items }) => {
            const color = CAT_COLORS[cat] || "#C84B31";
            return (
              <div key={cat} className="mb-6">
                <p className="font-dm font-semibold text-[10px] tracking-[.2em] uppercase mb-3" style={{ color }}>{cat}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((name) => {
                    const isActive = name === activeComp;
                    return (
                      <motion.div key={name} className="rounded-xl py-4 px-5 relative"
                        style={{
                          background: isActive ? `${color}22` : "rgba(253,251,247,0.022)",
                          border: isActive ? `1px solid ${color}70` : "1px solid rgba(253,251,247,0.055)",
                          borderLeft: `3px solid ${color}`,
                        }}
                        whileHover={{ y: -2, background: "rgba(253,251,247,0.04)" }}>
                        {isActive && (
                          <span className="absolute top-2 right-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-dm text-[9px] font-semibold tracking-wider uppercase"
                            style={{ background: `${color}28`, border: `1px solid ${color}50`, color }}>
                            <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: color }} />
                            Está aqui
                          </span>
                        )}
                        <p className="font-dm text-[10px] font-semibold tracking-[.2em] uppercase mb-1" style={{ color }}>{cat}</p>
                        <p className="font-dm text-sm" style={{ color: isActive ? "rgba(253,251,247,0.85)" : "rgba(253,251,247,0.55)" }}>{name}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* ── CTA Section ── */

function CtaSection({ title, titleAccent, text, accent }: { title: string; titleAccent: string; text: string; accent: string }) {
  return (
    <section className="relative py-32 text-center overflow-hidden" style={{ background: "#0F0F0F" }}>
      <Grain />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at bottom, ${accent}1A, transparent 70%)` }} />
      <p className="absolute font-fraunces italic text-[#FDFBF7] whitespace-nowrap select-none pointer-events-none"
        style={{ bottom: "40%", left: "50%", transform: "translateX(-50%)", fontSize: "clamp(36px,7vw,92px)", opacity: 0.025, letterSpacing: "-0.03em" }}
        aria-hidden>&ldquo;Transformando talentos em legado&rdquo;</p>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 relative z-10">
        <div className="flex items-center justify-center gap-3 py-6 mb-4">
          <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ background: accent }} />
          <div className="h-px w-12 opacity-20" style={{ background: accent }} />
          <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <div className="h-px w-12 opacity-20" style={{ background: accent }} />
          <div className="w-1.5 h-1.5 rounded-full opacity-50" style={{ background: accent }} />
        </div>
        <Reveal>
          <h2 className="font-fraunces font-bold text-[#FDFBF7] mb-4"
            style={{ fontSize: "clamp(28px,5vw,52px)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            {title} <span className="italic" style={{ color: accent }}>{titleAccent}</span>
          </h2>
          <p className="font-dm mx-auto mb-10" style={{ color: "rgba(253,251,247,0.45)", maxWidth: 560 }}>{text}</p>
          <motion.a href="https://wa.me/5531987577892" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-dm font-semibold text-white rounded-full"
            style={{ padding: "17px 52px", fontSize: "15px", background: accent }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            animate={{ boxShadow: [`0 0 0 0px ${accent}80`, `0 0 0 14px ${accent}00`, `0 0 0 0px ${accent}00`] }}
            transition={{ boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeOut" } }}>
            Agendar Sessão
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1 7.5h12M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
          <p className="font-dm text-sm mt-12" style={{ color: "rgba(253,251,247,0.3)" }}>
            R$200/mês · Rua Rio Negro, 1048, Barroca, BH – MG<br />
            suporte@allos.org.br · +55 31 98757-7892
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MAIN TEMPLATE EXPORT
   ═══════════════════════════════════════════════ */

export default function DidaticTemplate({ data }: { data: DidaticPageData }) {
  const { accentColor: accent, activeCompetency, navItems, sections, ctaTitle, ctaTitleAccent, ctaText } = data;

  return (
    <div className="relative">
      {/* ── TOC NAV ── */}
      <nav className="hidden lg:flex sticky top-[68px] z-50 items-center justify-center gap-6 py-3 px-6"
        style={{ background: "rgba(15,15,15,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(253,251,247,0.06)" }}>
        {navItems.map(({ href, label }) => (
          <a key={href} href={href}
            className="font-dm text-xs font-medium transition-colors hover:text-[#C84B31]"
            style={{ color: "rgba(253,251,247,0.45)", letterSpacing: ".02em" }}>
            {label}
          </a>
        ))}
      </nav>

      {/* ── Sections ── */}
      {sections.map((section) => (
        <SectionBlock key={section.id} section={section} accent={accent} />
      ))}

      {/* ── Competency Grid ── */}
      <CompGrid activeComp={activeCompetency} accent={accent} />

      {/* ── CTA ── */}
      <CtaSection title={ctaTitle} titleAccent={ctaTitleAccent} text={ctaText} accent={accent} />
    </div>
  );
}
