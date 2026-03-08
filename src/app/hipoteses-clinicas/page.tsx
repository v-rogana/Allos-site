import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import HipotesesContent from "@/components/hipoteses-clinicas/HipotesesContent";

export const metadata = {
  title: "Construção de Hipótese | AvaliAllos",
  description: "A construção de hipóteses é a capacidade de visualizar o todo, compreender a questão central do caso e planejar os próximos passos.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Construção de"
          titleLine2="Hipótese"
          titleLine2Italic={true}
          subtitle="Visualizar o todo, compreender a questão central do caso e formular hipóteses consistentes para o futuro do trabalho terapêutico."
          meta="Competência Avaliada · AvaliAllos"
        />
        <HipotesesContent />
      </main>
      <Footer />
    </>
  );
}
