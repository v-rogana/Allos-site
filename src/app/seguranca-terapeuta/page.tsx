import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import SegurancaTerapeutaContent from "@/components/seguranca-terapeuta/SegurancaTerapeutaContent";

export const metadata = {
  title: "Segurança do Terapeuta | AvaliAllos",
  description: "A segurança do terapeuta é a capacidade de transmitir confiança e domínio sobre o processo terapêutico de forma consistente.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          badge="Relação Terapêutica"
          titleLine1="Segurança do"
          titleLine2="Terapeuta"
          titleLine2Italic={true}
          subtitle="Transmitir ao paciente, de forma consistente, confiança e domínio sobre o processo — gerando a sensação de que está em mãos competentes."
          meta="Competência Avaliada · AvaliAllos"
        />
        <SegurancaTerapeutaContent />
      </main>
      <Footer />
    </>
  );
}
