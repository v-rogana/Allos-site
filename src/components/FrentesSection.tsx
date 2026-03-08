"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

const cards = [
  {
    label: "INSTITUCIONAL",
    title: "O que é a Associação Allos",
    desc: "Uma organização dedicada à excelência clínica, formação profissional e cooperação institucional com impacto social.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M12 12l9-5M12 12v10M12 12L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    btns: [
      { t: "Saiba mais", solid: true, href: "/sobre" },
      { t: "Documentos", solid: false, href: "/documentos" },
    ],
  },
  {
    label: "SERVIÇOS",
    title: "Serviços para sua instituição",
    desc: "Soluções estruturadas em saúde mental e desenvolvimento clínico para organizações, redes públicas e parceiros estratégicos.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    btns: [{ t: "Ver serviços", solid: true, href: "/parcerias" }],
  },
  {
    label: "FORMAÇÃO",
    title: "Formação contínua Allos",
    desc: "Desenvolvimento clínico de alto nível com supervisão qualificada, conteúdos contínuos e comunidade profissional.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    btns: [
      { t: "Conhecer a formação", solid: true, href: "/formacao" },
      {
        t: "WhatsApp Allos",
        solid: false,
        href: "https://chat.whatsapp.com/KP2z0vFRaSVBSXRjIyvR3R",
      },
    ],
  },
  {
    label: "FAÇA PARTE",
    title: "Construa esse legado com a Allos",
    desc: "Faça parte de uma rede clínica comprometida com excelência, formação contínua e impacto social duradouro.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    btns: [
      { t: "Quero me associar", solid: true, href: "/processo-seletivo" },
    ],
  },
];

function Card({ c, index }: { c: (typeof cards)[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotate: isEven ? -0.5 : 0.5 }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.7, ease: EASE }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-default"
      style={{
        background: "#FDFBF7",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow:
          "0 4px 12px rgba(0,0,0,.08), 0 16px 48px rgba(0,0,0,.06)",
        minHeight: "300px",
      }}
    >
      {/* Shimmer gradient on hover — slides across */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(14,165,160,.04) 50%, transparent 60%)",
        }}
      />

      {/* Bottom glow on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(14,165,160,.06) 0%, transparent 70%)",
        }}
      />

      {/* Top accent line — gradient slides in */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-600"
        style={{
          background: "linear-gradient(to right, #2E9E8F, #2E9E8F, transparent)",
        }}
      />

      <div className="p-10 md:p-12 flex flex-col h-full relative z-10">
        {/* Icon + label row */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: "rgba(14,165,160,.07)",
              border: "1px solid rgba(14,165,160,.12)",
              color: "#2E9E8F",
            }}
            whileHover={{
              background: "rgba(14,165,160,.12)",
              scale: 1.05,
            }}
          >
            {c.icon}
          </motion.div>
          <p
            className="font-dm font-semibold text-[11px] tracking-[.24em] uppercase"
            style={{ color: "#2E9E8F" }}
          >
            {c.label}
          </p>
        </div>

        <h3
          className="font-fraunces font-bold text-[#1A1A1A] leading-snug mb-4"
          style={{ fontSize: "clamp(19px,2.3vw,26px)" }}
        >
          {c.title}
        </h3>

        <p className="font-dm text-[#5C5C5C] text-[15px] leading-relaxed flex-1">
          {c.desc}
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          {c.btns.map((b) =>
            b.solid ? (
              <motion.div
                key={b.t}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 4px 18px rgba(46,158,143,.3)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={b.href}
                  className="inline-flex items-center gap-2 font-dm font-semibold text-[13px] text-white px-5 py-2.5 rounded-full transition-colors bg-[#2E9E8F] hover:bg-[#1A7A6D]"
                >
                  {b.t}
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={b.t}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href={b.href}
                  className="inline-flex font-dm font-medium text-[13px] px-5 py-2.5 rounded-full transition-all text-[#2E9E8F] border border-[rgba(46,158,143,.3)] hover:bg-[rgba(46,158,143,.05)]"
                >
                  {b.t}
                </Link>
              </motion.div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FrentesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      id="frentes"
      className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden"
      style={{
        background:
          "linear-gradient(170deg, #0B4D49 0%, #093B38 30%, #082F2D 60%, #0A3D3A 85%, #0C4845 100%)",
      }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      {/* Terracotta glow — bottom-left */}
      <div
        className="absolute -bottom-20 -left-20 w-[600px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(46,158,143,.12) 0%, transparent 55%)",
        }}
      />

      {/* Bright teal glow — top-right */}
      <div
        className="absolute -top-10 -right-10 w-[500px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(27,186,176,.1) 0%, transparent 55%)",
        }}
      />

      {/* Floating light orb — center */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "40%",
          left: "50%",
          width: 600,
          height: 400,
          background:
            "radial-gradient(ellipse at center, rgba(14,165,160,.05) 0%, transparent 50%)",
        }}
        animate={{
          x: ["-50%", "-45%", "-55%", "-50%"],
          y: ["-50%", "-45%", "-55%", "-50%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Decorative diagonal line */}
      <div
        className="absolute top-0 left-[20%] w-px h-full pointer-events-none hidden lg:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent 10%, rgba(255,255,255,.03) 30%, rgba(255,255,255,.03) 70%, transparent 90%)",
        }}
      />
      <div
        className="absolute top-0 right-[20%] w-px h-full pointer-events-none hidden lg:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent 20%, rgba(255,255,255,.02) 40%, rgba(255,255,255,.02) 60%, transparent 80%)",
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div ref={ref} className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="font-fraunces font-bold mb-5"
            style={{
              fontSize: "clamp(28px,4.5vw,52px)",
              color: "#FDFBF7",
              lineHeight: 1.15,
            }}
          >
            Uma organização,
            <br className="hidden sm:block" />{" "}
            <span className="italic" style={{ color: "#2E9E8F" }}>
              múltiplos impactos
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-dm max-w-[500px] mx-auto"
            style={{ fontSize: "15px", color: "rgba(253,251,247,.45)" }}
          >
            Conheça as frentes que sustentam nossa missão de formar terapeutas
            excelentes e levar saúde mental acessível a quem precisa.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((c, i) => (
            <Card key={c.label} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
