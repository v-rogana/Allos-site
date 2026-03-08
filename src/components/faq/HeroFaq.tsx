"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function HeroFaq() {
  const r = useReducedMotion();
  const up = (d: number) => ({
    initial: { opacity: 0, y: r ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section
      className="relative overflow-hidden pt-40 pb-24 px-6 md:px-10"
      style={{ background: "#1A1A1A" }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(200,75,49,.1) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom right, rgba(200,75,49,.06) 0%, transparent 60%)",
        }}
      />

      {/* Decorative circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-10 top-24 hidden lg:block pointer-events-none"
      >
        <svg width="260" height="260" viewBox="0 0 260 260" fill="none" opacity="0.08">
          <circle cx="130" cy="130" r="126" stroke="#C84B31" strokeWidth="0.8" strokeDasharray="8 5" />
          <circle cx="130" cy="130" r="88" stroke="#C84B31" strokeWidth="0.7" strokeDasharray="4 6" />
          <circle cx="130" cy="130" r="50" stroke="#C84B31" strokeWidth="0.8" />
          <circle cx="130" cy="130" r="15" stroke="#C84B31" strokeWidth="0.8" />
          <circle cx="130" cy="130" r="3.5" fill="#C84B31" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Título */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="font-fraunces font-bold text-[#FDFBF7] leading-none"
            style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Perguntas
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            className="font-fraunces italic font-bold text-[#C84B31] leading-none"
            style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ delay: 0.34, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            frequentes
          </motion.h1>
        </div>

        {/* Subtítulo + linha divisória */}
        <div
          className="flex flex-col md:flex-row gap-6 md:gap-16 items-start md:items-end pt-8"
          style={{ borderTop: "1px solid rgba(253,251,247,0.08)" }}
        >
          <motion.p
            {...up(0.55)}
            className="font-dm text-[rgba(253,251,247,0.5)] leading-relaxed max-w-[480px]"
            style={{ fontSize: "clamp(14px, 1.6vw, 16px)" }}
          >
            Bem-vindo ao nosso FAQ. Aqui você encontra respostas sobre a Associação Allos, nossa atuação clínica, estágios e funcionamento institucional.
          </motion.p>

          <motion.div {...up(0.65)} className="flex items-center gap-3 md:ml-auto flex-shrink-0">
            <div className="h-px w-6 bg-[#C84B31] opacity-40" />
            <span className="font-dm text-[10px] tracking-[.28em] text-[rgba(253,251,247,0.35)] uppercase">
              3 categorias · 14 perguntas
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
