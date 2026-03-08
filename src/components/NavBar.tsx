"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import basePath from "@/lib/basePath";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "Sobre", href: "/sobre" },
    { label: "Clínica", href: "/clinica" },
    { label: "Formação", href: "/formacao" },
    { label: "Projetos", href: "/projetos" },
  ];

  return (
    <>
      <motion.nav initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }} transition={{ delay:.2,duration:.6 }}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          background: scrolled ? "rgba(253,251,247,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid #E5DFD3" : "1px solid transparent",
        }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={`${basePath}/Icone_Allos_Verde.png`} alt="Allos" width={32} height={32} />
            <div>
              <span className="font-fraunces font-bold text-[17px] text-[#1A1A1A] tracking-wide">Allos</span>
              <span className="block font-dm text-[9px] tracking-[.28em] text-[#5C5C5C] uppercase -mt-0.5">Associação</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.label} href={l.href} className="font-dm text-sm text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors duration-200">{l.label}</Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/parcerias" className="font-dm text-sm font-medium text-[#2E9E8F] border border-[#2E9E8F] px-5 py-2 rounded-full hover:bg-[rgba(46,158,143,.05)] transition-all">
              Parcerias
            </Link>
            <Link href="/processo-seletivo" className="font-dm text-sm font-medium text-[#2E9E8F] border border-[#2E9E8F] px-5 py-2 rounded-full hover:bg-[rgba(46,158,143,.05)] transition-all">
              Quero me associar
            </Link>
            <motion.a href="https://bit.ly/terapiasite" target="_blank" rel="noopener noreferrer" whileHover={{ scale:1.03,boxShadow:"0 4px 20px rgba(46,158,143,.28)" }} whileTap={{ scale:.97 }}
              className="font-dm text-sm font-semibold text-white bg-[#2E9E8F] px-5 py-2 rounded-full hover:bg-[#1A7A6D] transition-colors">
              Agendar sessão
            </motion.a>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-[5px] p-2" aria-label="Menu">
            <span className={`block w-6 h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${open?"rotate-45 translate-y-[6.5px]":""}`}/>
            <span className={`block w-6 h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${open?"opacity-0":""}`}/>
            <span className={`block w-6 h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${open?"-rotate-45 -translate-y-[6.5px]":""}`}/>
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] bg-black/20"
            />
            <motion.div
              key="drawer"
              initial={{ opacity:0,x:"100%" }}
              animate={{ opacity:1,x:0 }}
              exit={{ opacity:0,x:"100%" }}
              transition={{ duration:.3,ease:"easeOut" }}
              className="fixed inset-y-0 right-0 w-[80vw] max-w-[320px] z-[101]"
              style={{ background:"#FDFBF7",borderLeft:"1px solid #E5DFD3" }}>
              <div className="flex flex-col gap-6 px-8 py-10 pt-24">
                {[...links, { label: "Parcerias", href: "/parcerias" }, { label: "Quero me associar", href: "/processo-seletivo" }].map(l => (
                  <Link key={l.label} href={l.href} onClick={() => setOpen(false)}
                    className="font-fraunces font-bold text-xl text-[#1A1A1A] hover:text-[#2E9E8F] transition-colors">{l.label}</Link>
                ))}
                <a href="https://bit.ly/terapiasite" target="_blank" rel="noopener noreferrer"
                  className="mt-4 font-dm text-sm font-semibold text-white bg-[#2E9E8F] px-6 py-3 rounded-full text-center">
                  Agendar sessão
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
