"use client";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import basePath from "@/lib/basePath";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

/* ── Word reveal ── */
function WordReveal({
  words,
  italic = false,
  delay = 0,
}: {
  words: string[];
  italic?: boolean;
  delay?: number;
}) {
  const r = useReducedMotion();
  return (
    <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-5 gap-y-0">
      {words.map((w, i) => (
        <div
          key={w}
          style={{
            overflow: "hidden",
            paddingBottom: ".1em",
            marginBottom: "-.1em",
          }}
        >
          <motion.span
            className={`block font-fraunces font-bold ${italic ? "italic" : ""}`}
            style={{ color: italic ? "#2E9E8F" : "#1A1A1A" }}
            initial={
              r
                ? { opacity: 0 }
                : { clipPath: "inset(0 100% 0 0)", opacity: 0 }
            }
            animate={
              r
                ? { opacity: 1 }
                : { clipPath: "inset(0 0% 0 0)", opacity: 1 }
            }
            transition={{
              delay: delay + i * 0.12,
              duration: r ? 0.3 : 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

export default function HeroSection() {
  const r = useReducedMotion();
  const up = (d: number) => ({
    initial: { opacity: 0, y: r ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 15% 75%, rgba(46,158,143,.08) 0%, transparent 50%),
          radial-gradient(ellipse at 85% 15%, rgba(46,158,143,.05) 0%, transparent 45%),
          radial-gradient(ellipse at 50% 50%, rgba(46,158,143,.03) 0%, transparent 60%),
          #FDFBF7
        `,
      }}
    >
      <HeroCanvas />

      {/* Decorative teal line — left side */}
      <div
        className="absolute left-0 top-[15%] w-[3px] h-[200px] hidden lg:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #2E9E8F, transparent)",
          opacity: 0.15,
        }}
      />
      {/* Decorative teal line — right side */}
      <div
        className="absolute right-0 bottom-[20%] w-[3px] h-[160px] hidden lg:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #2E9E8F, transparent)",
          opacity: 0.1,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Title */}
        <div
          className="mb-5 sm:mb-6 leading-none"
          style={{ fontSize: "clamp(2.2rem, 7vw, 5.5rem)" }}
        >
          <WordReveal words={["TRANSFORMANDO", "TALENTOS"]} delay={0.3} />
          <WordReveal words={["EM", "LEGADO"]} italic delay={0.52} />
        </div>

        {/* Subtitle */}
        <motion.p
          {...up(0.85)}
          className="font-dm text-[#5C5C5C] max-w-[560px] leading-relaxed mb-8 sm:mb-10 px-2 sm:px-0"
          style={{ fontSize: "clamp(14px,1.8vw,18px)" }}
        >
          Uma associação que integra aprendizado teórico e prático à prestação
          de serviços clínicos, formação profissional e projetos sociais de
          impacto.
        </motion.p>

        {/* CTAs */}
        <motion.div {...up(1.05)} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-2 sm:px-0">
          {/* Primary CTA — teal */}
          <motion.a
            href="https://bit.ly/terapiasite" target="_blank" rel="noopener noreferrer"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 8px 28px rgba(46,158,143,.3)",
            }}
            whileTap={{ scale: 0.97 }}
            className="font-dm font-semibold text-white bg-[#2E9E8F] px-8 py-3.5 rounded-full hover:bg-[#1A7A6D] transition-colors text-center"
          >
            Agendar sessão →
          </motion.a>
          {/* Secondary CTA — teal (navigation) */}
          <motion.a
            href={`${basePath}/sobre`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="font-dm font-medium px-8 py-3.5 rounded-full transition-all text-center"
            style={{
              color: "#1A7A6D",
              border: "1px solid rgba(46,158,143,.35)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background =
                "rgba(46,158,143,.06)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = "transparent";
            }}
          >
            Conheça a Allos
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <p className="font-dm text-[10px] tracking-[.25em] text-[#5C5C5C] uppercase hidden sm:block">
          Role para explorar
        </p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 6L8 11L13 6"
              stroke="#2E9E8F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Bottom border — teal */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(46,158,143,.2) 30%, rgba(46,158,143,.2) 70%, transparent)",
        }}
      />
    </section>
  );
}
