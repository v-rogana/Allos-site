"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import basePath from "@/lib/basePath";

export default function EstruturaPS() {
  const {ref,inView} = useInView({triggerOnce:true,threshold:.1});
  return (
    <section ref={ref} className="py-24 md:py-32" style={{background:"#FDFBF7"}}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          {[
            {label:"Sobre a avaliação",titulo:"Qual a estrutura da avaliação?",
              textos:["O AvaliAllos é uma simulação de atendimento clínico via Google Meet. O candidato assume o papel de terapeuta e conduz um atendimento de aproximadamente 20 minutos com um 'paciente' interpretado por um associado.",
                "Ao longo da simulação, o desempenho é acompanhado em tempo real por uma banca avaliadora composta por dois observadores."]},
            {label:null,titulo:"A avaliação é FORMATIVA",
              textos:["Após a simulação, há espaço para feedback dos coordenadores e devolutiva da nota final ao candidato.",
                "Os critérios estão organizados em quatro áreas: estrutura clínica, relação terapêutica, interpretação/formulação e performance.",
                "Todas as avaliações são gravadas e ficam disponíveis para a equipe interna e, mediante solicitação, para o próprio candidato."]},
          ].map((b,bi) => (
            <motion.div key={bi} initial={{opacity:0,y:22}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:bi*.16,duration:.7,ease:[.22,1,.36,1]}}>
              {b.label && <p className="font-dm text-[11px] tracking-[.26em] text-[#C84B31] uppercase mb-3">{b.label}</p>}
              <h3 className="font-fraunces font-bold text-[#1A1A1A] leading-snug mb-5"
                style={{fontSize:"clamp(18px,2.4vw,26px)"}}>
                {bi===1?<>A avaliação é <span className="italic text-[#C84B31]">FORMATIVA</span></>:b.titulo}
              </h3>
              <div className="space-y-4 font-dm text-[#5C5C5C] leading-relaxed text-[14px]">
                {b.textos.map((t,ti) => <p key={ti}>{t}</p>)}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{opacity:0,x:22}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.2,duration:.8,ease:[.22,1,.36,1]}} className="sticky top-24">
          <Image src={`${basePath}/allos-grupo.jpg`} alt="Grupo formativo da Associação Allos" width={1280} height={960}
            className="w-full h-[520px] object-cover rounded-2xl" style={{objectPosition:"center 40%"}}/>
        </motion.div>
      </div>
    </section>
  );
}
