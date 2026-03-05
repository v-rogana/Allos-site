import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import SegurancaMetodoContent from "@/components/seguranca-metodo/SegurancaMetodoContent";

export const metadata = {
  title: "Segurança do Método | AvaliAllos",
  description: "A segurança do método é a capacidade de transmitir confiança na abordagem utilizada, convencendo o paciente de que o processo é adequado.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          badge="Relação Terapêutica"
          titleLine1="Segurança do"
          titleLine2="Método"
          titleLine2Italic={true}
          subtitle="Transmitir confiança na abordagem utilizada — mostrando ao paciente o que está sendo feito, como funciona e como se conecta à sua questão."
          meta="Competência Avaliada · AvaliAllos"
        />
        <SegurancaMetodoContent />
      </main>
      <Footer />
    </>
  );
}
