import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import InterpretacaoContent from "@/components/interpretacao/InterpretacaoContent";

export const metadata = {
  title: "Capacidade Interpretativa | AvaliAllos",
  description: "A capacidade interpretativa é a habilidade de identificar ganchos e escolher em qual deles aprofundar com precisão.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Capacidade"
          titleLine2="Interpretativa"
          titleLine2Italic={true}
          subtitle="Interpretar com precisão o que é dito na fala, no texto e no corpo do paciente — identificando ganchos e sabendo em qual deles aprofundar."
          meta="Competência Avaliada · AvaliAllos"
        />
        <InterpretacaoContent />
      </main>
      <Footer />
    </>
  );
}
