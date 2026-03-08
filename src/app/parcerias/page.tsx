import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import ParceriasContent from "@/components/parcerias/ParceriasContent";

export const metadata = {
  title: "Parcerias Institucionais — Associação Allos",
  description: "A Allos desenvolve parcerias com redes públicas, universidades e organizações para ampliar o acesso à saúde mental.",
};

export default function ParceriasPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Projetos construídos"
          titleLine2="em rede"
          titleLine2Italic={true}
          subtitle="Cooperação com prefeituras, universidades e organizações estratégicas para ampliar o acesso à saúde mental e fortalecer práticas baseadas em evidências."
          meta="Redes públicas · Universidades · Empresas"
        />
        <ParceriasContent />
      </main>
      <Footer />
    </>
  );
}
