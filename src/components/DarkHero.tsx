"use client";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  titleLine1: string;
  titleLine2: string;
  titleLine2Italic?: boolean;
  subtitle: string;
  meta?: string;
  cta?: { href: string; label: string };
}

export default function DarkHero({
  titleLine1, titleLine2, titleLine2Italic = true, subtitle, meta, cta,
}: Props) {
  const r = useReducedMotion();
  const up = (d: number) => ({
    initial: { opacity: 0, y: r ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className="relative overflow-hidden pt-40 pb-24 px-6 md:px-10" style={{ background: "#1A1A1A" }}>
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top left,rgba(46,158,143,.1) 0%,transparent 65%)" }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom right,rgba(46,158,143,.05) 0%,transparent 60%)" }} />

      {/* Decorative SVG */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-10 top-24 hidden lg:block pointer-events-none">
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none" opacity="0.07">
          <circle cx="120" cy="120" r="116" stroke="#2E9E8F" strokeWidth="0.8" strokeDasharray="8 5" />
          <circle cx="120" cy="120" r="80" stroke="#2E9E8F" strokeWidth="0.7" strokeDasharray="4 6" />
          <circle cx="120" cy="120" r="45" stroke="#2E9E8F" strokeWidth="0.8" />
          <circle cx="120" cy="120" r="13" stroke="#2E9E8F" strokeWidth="0.8" />
          <circle cx="120" cy="120" r="3" fill="#2E9E8F" />
        </svg>
      </motion.div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="overflow-hidden mb-1">
          <motion.h1 className="font-fraunces font-bold text-[#FDFBF7] leading-none"
            style={{ fontSize: "clamp(44px,7.5vw,88px)" }}
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            {titleLine1}
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            className={`font-fraunces font-bold leading-none ${titleLine2Italic ? "italic text-[#2E9E8F]" : "text-[#FDFBF7]"}`}
            style={{ fontSize: "clamp(44px,7.5vw,88px)" }}
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ delay: 0.34, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            {titleLine2}
          </motion.h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-start md:items-end pt-8"
          style={{ borderTop: "1px solid rgba(253,251,247,0.08)" }}>
          <motion.p {...up(0.55)} className="font-dm leading-relaxed max-w-[500px]"
            style={{ fontSize: "clamp(14px,1.6vw,16px)", color: "rgba(253,251,247,0.5)" }}>
            {subtitle}
          </motion.p>
          <motion.div {...up(0.65)} className="flex items-center gap-4 md:ml-auto flex-shrink-0 flex-wrap">
            {meta && (
              <div className="flex items-center gap-3">
                <div className="h-px w-6 bg-[#2E9E8F] opacity-40" />
                <span className="font-dm text-[10px] tracking-[.28em] uppercase" style={{ color: "rgba(253,251,247,0.3)" }}>
                  {meta}
                </span>
              </div>
            )}
            {cta && (
              <motion.a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#2E9E8F] rounded-full"
                style={{ padding: "13px 28px", fontSize: "14px", boxShadow: "0 6px 22px rgba(46,158,143,.35), inset 0 1px 0 rgba(255,255,255,.1)" }}
                whileHover={{ scale: 1.04, boxShadow: "0 10px 32px rgba(46,158,143,.5)" }}
                whileTap={{ scale: 0.97 }}>
                {cta.label}
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
