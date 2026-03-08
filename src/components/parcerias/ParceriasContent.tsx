"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import basePath from "@/lib/basePath";

const tiposParcerias = [
  {
    icon: "🏛️",
    title: "Redes Públicas",
    desc: "Implementação de projetos clínicos e apoio técnico em serviços públicos, promovendo cuidado psicológico qualificado e estruturado.",
  },
  {
    icon: "🎓",
    title: "Universidades",
    desc: "Cooperação acadêmica e científica, integrando formação, supervisão clínica e desenvolvimento institucional.",
  },
  {
    icon: "🏢",
    title: "Organizações e Empresas",
    desc: "Programas personalizados em saúde mental, desenvolvimento humano e construção de ambientes institucionais saudáveis.",
  },
];

function TipoCard({ item, index }: { item: typeof tiposParcerias[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="group relative rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.07)" }}>
      <div className="h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: "linear-gradient(to right,#C84B31,rgba(200,75,49,0))" }} />
      <div className="p-8 flex flex-col flex-1">
        <span className="text-3xl mb-5">{item.icon}</span>
        <h3 className="font-fraunces font-bold text-[#FDFBF7] mb-4 leading-snug"
          style={{ fontSize: "clamp(17px,1.8vw,20px)" }}>
          {item.title}
        </h3>
        <p className="font-dm leading-relaxed flex-1"
          style={{ fontSize: "15px", color: "rgba(253,251,247,0.5)" }}>
          {item.desc}
        </p>
      </div>
    </motion.div>
  );
}

function CtaParceria() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 rounded-2xl overflow-hidden"
      style={{ background: "rgba(200,75,49,0.06)", border: "1px solid rgba(200,75,49,0.18)" }}>
      <div className="p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
        <div className="flex-1">
          <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-3">
            Vamos conversar
          </p>
          <h3 className="font-fraunces font-bold text-[#FDFBF7] leading-snug mb-3"
            style={{ fontSize: "clamp(20px,2.5vw,28px)" }}>
            Deseja construir uma parceria com a Allos?
          </h3>
          <p className="font-dm leading-relaxed"
            style={{ fontSize: "15px", color: "rgba(253,251,247,0.5)" }}>
            Entre em contato com nossa equipe e desenvolva iniciativas clínicas, acadêmicas ou institucionais em conjunto.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <motion.a href="mailto:suporte@allos.org.br"
            whileHover={{ scale: 1.04, boxShadow: "0 8px 28px rgba(200,75,49,.3)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#C84B31] rounded-full hover:bg-[#A33D27] transition-colors"
            style={{ padding: "13px 26px", fontSize: "14px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Enviar proposta
          </motion.a>
          <motion.a href={`${basePath}/projetos`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 font-dm font-medium rounded-full transition-all"
            style={{ color: "#C84B31", border: "1px solid rgba(200,75,49,0.35)", padding: "13px 26px", fontSize: "14px" }}>
            Ver iniciativas
          </motion.a>
        </div>
      </div>
      <div className="px-10 md:px-12 pb-8">
        <p className="font-dm" style={{ fontSize: "13px", color: "rgba(253,251,247,0.3)" }}>
          Envie uma proposta com o escopo e público-alvo. Nossa equipe retorna com orientações técnico-clínicas e possibilidades de cooperação.
        </p>
      </div>
    </motion.div>
  );
}

export default function ParceriasContent() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section className="py-20 md:py-28 px-6 md:px-10"
      style={{ background: "radial-gradient(ellipse at 95% 0%,rgba(200,75,49,.04) 0%,transparent 50%),#161616" }}>
      <div className="max-w-[1200px] mx-auto">
        <div ref={ref} className="max-w-[720px] mb-16">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">
            Como atuamos
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-dm leading-relaxed mb-5"
            style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "rgba(253,251,247,0.75)" }}>
            A Allos desenvolve parcerias institucionais voltadas à saúde mental, inovação clínica e impacto social sustentável.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.14, duration: 0.6 }}
            className="font-dm leading-relaxed"
            style={{ fontSize: "15px", color: "rgba(253,251,247,0.45)" }}>
            Atuamos em cooperação com prefeituras, universidades, instituições públicas e organizações estratégicas, estruturando iniciativas que ampliam o acesso e fortalecem práticas baseadas em evidências.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-6 mb-12 origin-left">
          <div className="h-px flex-1" style={{ background: "rgba(253,251,247,0.07)" }} />
          <span className="font-dm text-[10px] tracking-[.28em] uppercase flex-shrink-0" style={{ color: "rgba(253,251,247,0.25)" }}>
            Tipos de parceria
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(253,251,247,0.07)" }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {tiposParcerias.map((item, i) => (
            <TipoCard key={item.title} item={item} index={i} />
          ))}
        </div>

        <CtaParceria />
      </div>
    </section>
  );
}
