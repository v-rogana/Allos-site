import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import FraseTimingContent from "@/components/frase-timing/FraseTimingContent";

export const metadata = {
  title: "Construção de Frase e Timing | AvaliAllos",
  description: "O modo como se fala transforma completamente o efeito de uma intervenção terapêutica.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          badge="Performance Clínica"
          titleLine1="Frase &"
          titleLine2="Timing"
          titleLine2Italic={true}
          subtitle="O principal problema nas intervenções não é a falta de vocabulário, mas a entonação — o modo como se fala transforma completamente o efeito."
          meta="Competência Avaliada · AvaliAllos"
        />
        <FraseTimingContent />
      </main>
      <Footer />
    </>
  );
}
