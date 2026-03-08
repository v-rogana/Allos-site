"use client";

import NavBar from "@/components/NavBar";
import DarkHero from "@/components/DarkHero";
import Footer from "@/components/Footer";
import PbeContent from "@/components/pbe/PbeContent";

export default function PbePage() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen">
      <NavBar />
      <DarkHero
        titleLine1="Psicologia Baseada em Evidências"
        titleLine2="& Prática Deliberada"
        titleLine2Italic={true}
        subtitle="Como a ciência sobre eficácia terapêutica levou à descoberta de que terapeutas não melhoram com experiência — e como a Allos criou um modelo inovador para mudar esse cenário."
        meta="Conteúdo didático · Fundamentação científica"
      />
      <PbeContent />
      <Footer />
    </main>
  );
}
