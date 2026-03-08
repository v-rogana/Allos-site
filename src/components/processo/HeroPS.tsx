"use client";
import { motion, useReducedMotion } from "framer-motion";

export default function HeroPS() {
  const r = useReducedMotion();
  const up = (d:number) => ({initial:{opacity:0,y:r?0:24},animate:{opacity:1,y:0},transition:{delay:d,duration:.75,ease:[.22,1,.36,1]}});
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden"
      style={{background:"radial-gradient(ellipse at 20% 80%,rgba(200,75,49,.07) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(45,106,79,.04) 0%,transparent 50%),#FDFBF7"}}>
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-[.035] hidden lg:block"
        style={{backgroundImage:"radial-gradient(circle at 70% 50%,rgba(200,75,49,1) 0%,transparent 60%)"}}>
        <svg className="absolute right-16 top-1/2 -translate-y-1/2 w-80 h-80" viewBox="0 0 320 320" fill="none">
          <circle cx="160" cy="160" r="155" stroke="#C84B31" strokeWidth=".8" strokeDasharray="8 4" opacity=".6"/>
          <circle cx="160" cy="160" r="110" stroke="#C84B31" strokeWidth=".8" strokeDasharray="4 6" opacity=".5"/>
          <circle cx="160" cy="160" r="65" stroke="#C84B31" strokeWidth="1" opacity=".7"/>
          <circle cx="160" cy="160" r="20" stroke="#C84B31" strokeWidth="1"/>
          <circle cx="160" cy="160" r="4" fill="#C84B31"/>
        </svg>
      </div>
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 py-36 w-full">
        <div className="max-w-[680px]">
          <motion.h1 {...up(.2)} className="font-fraunces font-bold text-[#1A1A1A] leading-[.95] mb-8"
            style={{fontSize:"clamp(40px,7vw,80px)"}}>
            Processo Seletivo<br/>Para <span className="italic text-[#C84B31]">Atuar</span> em Nossa<br/>Clínica Escola
          </motion.h1>
          <motion.p {...up(.35)} className="font-dm text-[#5C5C5C] leading-relaxed mb-10 max-w-[520px]"
            style={{fontSize:"clamp(15px,1.7vw,17px)"}}>
            A Associação Allos está interessada em talentos da psicologia que desejam construir trajetória clínica junto à associação — online ou presencial, em todo o Brasil.
          </motion.p>
          <motion.div {...up(.48)}>
            <motion.a href="#agendar" whileHover={{scale:1.04,boxShadow:"0 8px 28px rgba(200,75,49,.3)"}} whileTap={{scale:.97}}
              className="inline-flex items-center gap-2.5 font-dm font-semibold text-white bg-[#C84B31] rounded-full hover:bg-[#A33D27] transition-colors"
              style={{padding:"15px 36px",fontSize:"15px"}}>
              Ir para a inscrição →
            </motion.a>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{background:"linear-gradient(to right,transparent,#E5DFD3 30%,#E5DFD3 70%,transparent)"}}/>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2,duration:.6}}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="font-dm text-[10px] tracking-[.25em] text-[#5C5C5C] uppercase">Role para explorar</p>
        <motion.div animate={{y:[0,5,0]}} transition={{duration:1.6,repeat:Infinity}}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 6L8 11L13 6" stroke="#5C5C5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
