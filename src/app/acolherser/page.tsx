import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AcolherSerContent from "@/components/acolherser/AcolherSerContent";

export const metadata = {
  title: "AcolherSer | Programa de Saúde Mental para Servidores Públicos",
  description: "Programa AcolherSer — saúde mental preventiva para servidores públicos. Resultados reais, impacto mensurável, excelência comprovada.",
};

export default function AcolherSerPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <AcolherSerContent />
      </main>
      <Footer />
    </>
  );
}
