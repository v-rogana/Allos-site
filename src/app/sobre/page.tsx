import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import SobreContent from "@/components/sobre/SobreContent";

export const metadata = {
  title: "Sobre a Associação Allos",
  description: "Somos uma associação sem fins lucrativos que integra aprendizado teórico e prático à prestação de serviços clínicos, divulgação científica e projetos sociais.",
};

export default function SobrePage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Associação"
          titleLine2="Allos"
          titleLine2Italic={true}
          subtitle="Somos uma associação sem fins lucrativos que propõe uma alternativa complementar às formações atuais, integrando aprendizado teórico e prático à prestação de serviços clínicos, divulgação científica e projetos sociais."
          meta="Fundada em 2023 · Belo Horizonte"
        />
        <SobreContent />
      </main>
      <Footer />
    </>
  );
}
