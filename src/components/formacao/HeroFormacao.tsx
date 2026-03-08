"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

function MovingGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const orbs = [
      { x: 0.15, y: 0.3,  r: 0.55, speed: 0.0004, phase: 0,    color: "rgba(200,75,49," },
      { x: 0.75, y: 0.6,  r: 0.45, speed: 0.0003, phase: 2.1,  color: "rgba(200,75,49," },
      { x: 0.5,  y: 0.1,  r: 0.35, speed: 0.0005, phase: 1.2,  color: "rgba(163,61,39," },
    ];

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        const px = (orb.x + Math.sin(t * orb.speed + orb.phase) * 0.18) * canvas.width;
        const py = (orb.y + Math.cos(t * orb.speed * 1.3 + orb.phase) * 0.14) * canvas.height;
        const rad = orb.r * Math.min(canvas.width, canvas.height);

        const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
        g.addColorStop(0,   orb.color + "0.12)");
        g.addColorStop(0.4, orb.color + "0.06)");
        g.addColorStop(1,   orb.color + "0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}

const words1 = ["Formações", "e"];
const words2 = ["Cursos"];

function WordReveal({ words, italic = false, delay = 0 }: { words: string[]; italic?: boolean; delay?: number }) {
  const r = useReducedMotion();
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-0">
      {words.map((w, i) => (
        <div key={w} style={{ overflow: "hidden", paddingBottom: ".08em", marginBottom: "-.08em" }}>
          <motion.span
            className={`block font-fraunces font-bold ${italic ? "italic" : ""}`}
            style={{ color: italic ? "#C84B31" : "#FDFBF7" }}
            initial={r ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            animate={r ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{ delay: delay + i * 0.14, duration: r ? 0.3 : 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

export default function HeroFormacao() {
  const r = useReducedMotion();
  const up = (d: number) => ({
    initial: { opacity: 0, y: r ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: d, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section
      className="relative overflow-hidden min-h-[100dvh] flex items-center"
      style={{ background: "#111111" }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[.04] z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Moving gradient orbs */}
      <MovingGradient />

      {/* Horizontal scan line decorativa */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none z-0"
        style={{ top: "38%", background: "linear-gradient(to right,transparent,rgba(200,75,49,.15) 30%,rgba(200,75,49,.15) 70%,transparent)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 py-40">
        {/* Título */}
        <div className="mb-8" style={{ fontSize: "clamp(56px,10vw,112px)", lineHeight: 0.95 }}>
          <WordReveal words={words1} delay={0.25} />
          <WordReveal words={words2} italic delay={0.42} />
        </div>

        {/* Subtítulo */}
        <motion.p
          {...up(0.75)}
          className="font-dm leading-relaxed max-w-[560px] mb-12"
          style={{ fontSize: "clamp(15px,1.7vw,18px)", color: "rgba(253,251,247,0.5)" }}
        >
          Conteúdos críticos e existenciais para a prática clínica — do iniciante ao terapeuta experiente.
        </motion.p>

        {/* CTAs */}
        <motion.div {...up(0.9)} className="flex flex-wrap gap-4">
          <motion.a
            href="#formacao-sincrona"
            whileHover={{ scale: 1.04, boxShadow: "0 10px 36px rgba(200,75,49,.35)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#C84B31] rounded-full hover:bg-[#A33D27] transition-colors"
            style={{ padding: "14px 32px", fontSize: "15px", boxShadow: "0 4px 20px rgba(200,75,49,.25)" }}
          >
            Ver formação síncrona →
          </motion.a>
          <motion.a
            href="#cursos"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 font-dm font-medium rounded-full transition-all"
            style={{ color: "rgba(253,251,247,0.7)", border: "1px solid rgba(253,251,247,0.12)", padding: "14px 32px", fontSize: "15px" }}
          >
            Ver todos os cursos
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="font-dm text-[10px] tracking-[.28em] uppercase" style={{ color: "rgba(253,251,247,0.25)" }}>
            Role para explorar
          </p>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M3 5.5L7 9.5L11 5.5" stroke="rgba(253,251,247,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom,transparent,#111111)" }}
      />
    </section>
  );
}
