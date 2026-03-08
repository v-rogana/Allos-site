"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import basePath from "@/lib/basePath";

const req = [
  "Você precisa estar na graduação de Psicologia para poder entrar como estagiário na clínica escola (isso não te impede de participar da formação livremente)",
  "A Associação Allos está interessada em talentos que desejam uma experiência prática durante a graduação, preparando-se para o mundo real da clínica",
];

export default function RequisitosPS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.12});
  return (
    <section ref={ref} className="py-24 md:py-32" style={{background:"#FDFBF7"}}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.p initial={{opacity:0,x:-12}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:.5}}
            className="font-dm font-semibold text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-4">Requisitos</motion.p>
          <motion.h2 initial={{opacity:0,y:18}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.1,duration:.7,ease:[.22,1,.36,1]}}
            className="font-fraunces font-bold text-[#1A1A1A] leading-tight mb-10" style={{fontSize:"clamp(24px,3.2vw,40px)"}}>
            Quais são os <span className="italic text-[#C84B31]">requisitos</span> para participar?
          </motion.h2>
          <div className="space-y-6">
            {req.map((r,i) => (
              <motion.div key={i} initial={{opacity:0,x:-18}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.18+i*.1,duration:.6}}
                className="flex gap-4">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                  style={{background:"rgba(200,75,49,.08)",border:"1px solid rgba(200,75,49,.2)"}}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M5 8L7 10L11 6" stroke="#C84B31" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="font-dm text-[#5C5C5C] leading-relaxed text-[15px]">{r}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial={{opacity:0,scale:.96}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:.2,duration:.8,ease:[.22,1,.36,1]}}>
          <Image src={`${basePath}/allos-roda.jpg`} alt="Roda de conversa na Associação Allos" width={1024} height={768}
            className="w-full h-[420px] object-cover rounded-2xl" style={{objectPosition:"center 30%"}}/>
        </motion.div>
      </div>
    </section>
  );
}
