import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import CoerenciaContent from "@/components/coerencia-consistencia/CoerenciaContent";

export const metadata = {
  title: "Coerência e Consistência | AvaliAllos",
  description: "A coerência e a consistência são competências que transcendem a preferência por uma teoria específica na prática clínica.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          badge="Estrutura Clínica"
          titleLine1="Coerência e"
          titleLine2="Consistência"
          titleLine2Italic={true}
          subtitle="Uma prática clínica onde hipóteses, intervenções e postura sigam uma lógica integrada — independente da base teórica declarada."
          meta="Competência Transversal · AvaliAllos"
        />
        <CoerenciaContent />
      </main>
      <Footer />
    </>
  );
}
