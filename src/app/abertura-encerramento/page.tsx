"use client";

import NavBar from "@/components/NavBar";
import DarkHero from "@/components/DarkHero";
import Footer from "@/components/Footer";
import AberturaEncerramentoContent from "@/components/abertura-encerramento/AberturaEncerramentoContent";

export default function AberturaEncerramentoPage() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen">
      <NavBar />
      <DarkHero
        badge="Competência · Estrutura"
        titleLine1="Abertura"
        titleLine2="& Encerramento"
        titleLine2Italic={true}
        subtitle="O primeiro e o último ato terapêutico revelam a assinatura clínica do terapeuta. Quando feitos com intencionalidade, criam campo, coerência e continuidade."
        meta="AvaliAllos · Estrutura"
      />
      <AberturaEncerramentoContent />
      <Footer />
    </main>
  );
}
