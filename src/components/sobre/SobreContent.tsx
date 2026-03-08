"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

/* ── Bloco de texto com scroll reveal ── */
function SectionBlock({ label, title, body, link, index = 0 }: {
  label?: string; title: string; body: string; link?: { href: string; text: string }; index?: number;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-7"
      style={{ borderLeft: "2px solid rgba(200,75,49,0.2)" }}>
      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#C84B31] opacity-60" />
      {label && (
        <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-2">{label}</p>
      )}
      <h2 className="font-fraunces font-bold text-[#FDFBF7] leading-snug mb-4"
        style={{ fontSize: "clamp(20px,2.5vw,28px)" }}>
        {title}
      </h2>
      <p className="font-dm leading-relaxed"
        style={{ fontSize: "15px", color: "rgba(253,251,247,0.55)" }}>
        {body}
      </p>
      {link && (
        <Link href={link.href} className="inline-flex items-center gap-1.5 font-dm text-[13px] font-medium text-[#C84B31] mt-3 hover:underline" style={{ textUnderlineOffset: "3px" }}>
          {link.text} →
        </Link>
      )}
    </motion.div>
  );
}

/* ── Highlight box — Formação ── */
function HighlightFormacao() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden"
      style={{ background: "rgba(200,75,49,0.07)", border: "1px solid rgba(200,75,49,0.2)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%,rgba(200,75,49,.1) 0%,transparent 70%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <div className="relative z-10 p-10 md:p-14">
        <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-5">Nossa Formação</p>
        <h2 className="font-fraunces font-bold text-[#FDFBF7] leading-snug mb-8"
          style={{ fontSize: "clamp(24px,3vw,36px)" }}>
          Lideramos o estado da arte
        </h2>
        <div className="space-y-5 font-dm leading-relaxed"
          style={{ fontSize: "clamp(14px,1.5vw,16px)", color: "rgba(253,251,247,0.65)" }}>
          <p>
            Oferecemos uma formação que lidera o estado da arte, não apenas de forma gratuita, mas também <strong className="text-[#FDFBF7]">remunerando os alunos</strong>. Ao ofertar as melhores condições, selecionamos os melhores talentos.
          </p>
          <p>
            Mais de <strong className="text-[#C84B31]">80% dos psicólogos já formados</strong> não atingem a pontuação mínima no teste clínico para ingresso na Clínica Allos. Nosso objetivo é tornar os melhores ainda melhores.
          </p>
        </div>
        <div className="mt-10 pt-8 grid grid-cols-2 gap-6"
          style={{ borderTop: "1px solid rgba(200,75,49,0.15)" }}>
          {[
            { n: "80%+", l: "não atingem a nota mínima" },
            { n: "R$500", l: "bolsa base para estagiários" },
          ].map((s) => (
            <div key={s.n}>
              <p className="font-fraunces font-bold text-[#C84B31]" style={{ fontSize: "clamp(28px,4vw,40px)", lineHeight: 1 }}>{s.n}</p>
              <p className="font-dm mt-2" style={{ fontSize: "13px", color: "rgba(253,251,247,0.4)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Cards Visão / Missão / Valores ── */
const vmv = [
  { title: "Nossa Visão", body: "Ofertar, para o mundo todo, o melhor ensino de forma privada, gratuita e com altíssimo impacto social." },
  { title: "Nossa Missão", body: "Conectar grandes talentos a um ambiente de formação e supervisão que os permita florescer, unindo quem pode investir com quem mais precisa de cuidado psicológico." },
  { title: "Nossos Valores", values: ["Comunidade", "Excelência", "Escalabilidade"] },
];

function VMVCard({ item, index }: { item: typeof vmv[0]; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="group rounded-2xl p-8 flex flex-col"
      style={{ background: "rgba(253,251,247,0.03)", border: "1px solid rgba(253,251,247,0.07)" }}>
      <div className="w-8 h-[2px] mb-6 transition-all duration-500 group-hover:w-14" style={{ background: "#C84B31" }} />
      <h3 className="font-fraunces font-bold text-[#FDFBF7] mb-4" style={{ fontSize: "clamp(17px,1.8vw,20px)" }}>
        {item.title}
      </h3>
      {item.body ? (
        <p className="font-dm leading-relaxed" style={{ fontSize: "14px", color: "rgba(253,251,247,0.5)" }}>{item.body}</p>
      ) : (
        <div className="flex flex-col gap-3 mt-1">
          {item.values!.map((v) => (
            <div key={v} className="flex items-center gap-3">
              <span className="text-[#C84B31] text-xs">◆</span>
              <span className="font-dm text-[14px]" style={{ color: "rgba(253,251,247,0.6)" }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ── CTA final ── */
function SobreCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-20 py-16 text-center relative overflow-hidden rounded-2xl"
      style={{ background: "rgba(253,251,247,0.02)", border: "1px solid rgba(253,251,247,0.06)" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%,rgba(200,75,49,.08) 0%,transparent 70%)" }} />
      <div className="relative z-10">
        <h3 className="font-fraunces font-bold text-[#FDFBF7] mb-4 leading-tight" style={{ fontSize: "clamp(22px,3vw,34px)" }}>
          Quer saber mais sobre a formação?
        </h3>
        <p className="font-dm mb-8 max-w-[400px] mx-auto" style={{ fontSize: "15px", color: "rgba(253,251,247,0.45)" }}>
          Conheça nosso programa de formação clínica e entenda como transformamos talentos em legado.
        </p>
        <motion.a href="/Allos-site/formacao"
          whileHover={{ scale: 1.04, boxShadow: "0 8px 28px rgba(200,75,49,.3)" }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#C84B31] rounded-full hover:bg-[#A33D27] transition-colors"
          style={{ padding: "14px 36px", fontSize: "14px" }}>
          Conhecer a formação →
        </motion.a>
      </div>
    </motion.div>
  );
}

/* ── Componente principal ── */
export default function SobreContent() {
  return (
    <section className="py-20 md:py-28 px-6 md:px-10"
      style={{ background: "radial-gradient(ellipse at 10% 0%,rgba(200,75,49,.04) 0%,transparent 50%),#161616" }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          <div className="space-y-10">
            <SectionBlock index={0}
              label="O que fazemos"
              title="Divulgação Científica"
              body="Buscamos democratizar o acesso ao conhecimento, ofertando a melhor formação de forma gratuita para profissionais e criando espaços acessíveis de tradução do conhecimento científico para o público leigo."
            />
            <SectionBlock index={1}
              title="Atendimento Clínico"
              body="A experiência do paciente, desde antes do primeiro contato até depois do encerramento do tratamento, é o nosso norte. Atuamos sem burocracias desnecessárias, conectando cada pessoa ao terapeuta e ao modelo de cuidado mais adequado à sua demanda."
              link={{ href: "/clinica", text: "Conheça nossa clínica" }}
            />
            <SectionBlock index={2}
              title="Pesquisa"
              body="A pesquisa é o fio condutor de nossos projetos. Atualmente, a Associação Allos lidera a maior pesquisa em psicologia baseada em evidências da América Latina e conduz um estudo inovador sobre mensuração de aptidão clínica."
              link={{ href: "/pbe", text: "Conheça a pesquisa em PBE" }}
            />
          </div>
          <div className="lg:sticky lg:top-28 h-fit">
            <HighlightFormacao />
          </div>
        </div>

        {/* E quem não passa */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 rounded-2xl p-10 md:p-14"
          style={{ background: "rgba(253,251,247,0.02)", border: "1px solid rgba(253,251,247,0.06)" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">Formação aberta</p>
              <h2 className="font-fraunces font-bold text-[#FDFBF7] leading-snug mb-6"
                style={{ fontSize: "clamp(22px,2.8vw,32px)" }}>
                E quem não passa?
              </h2>
              <p className="font-dm leading-relaxed mb-4"
                style={{ fontSize: "15px", color: "rgba(253,251,247,0.55)" }}>
                Aqueles que não ingressam no processo seletivo têm acesso gratuito à formação, com supervisão em diversas modalidades e abordagens, metodologia centrada na prática e possibilidade de atendimento na Clínica Escola.
              </p>
              <Link href="/processo-seletivo" className="inline-flex items-center gap-1.5 font-dm text-[13px] font-medium text-[#C84B31] hover:underline" style={{ textUnderlineOffset: "3px" }}>
                Saiba mais sobre o processo seletivo →
              </Link>
            </div>
            <div className="hidden md:block h-full">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="font-fraunces font-bold italic text-[#C84B31] opacity-20 select-none"
                    style={{ fontSize: "120px", lineHeight: 1 }}>∞</div>
                  <p className="font-dm text-[11px] tracking-[.28em] uppercase mt-2"
                    style={{ color: "rgba(253,251,247,0.2)" }}>Aprendizado contínuo</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Por que escolher */}
        <div className="mb-14">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-10">
            <p className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">Por que escolher</p>
            <h2 className="font-fraunces font-bold text-[#FDFBF7] max-w-[640px] leading-snug"
              style={{ fontSize: "clamp(24px,3vw,36px)" }}>
              Na Allos, os profissionais encontram <span className="italic text-[#C84B31]">mais do que excelência</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vmv.map((item, i) => <VMVCard key={item.title} item={item} index={i} />)}
          </div>
        </div>

        <SobreCTA />
      </div>
    </section>
  );
}
