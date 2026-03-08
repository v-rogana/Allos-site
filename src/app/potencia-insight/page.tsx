import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import PotenciaInsightContent from "@/components/potencia-insight/PotenciaInsightContent";

export const metadata = {
  title: "Potência e Insight | AvaliAllos",
  description: "Se o seu atendimento foi potente ou gerou algum insight, é possível perceber — coloque-se no lugar do paciente.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Potência &"
          titleLine2="Insight"
          titleLine2Italic={true}
          subtitle="Se você se colocar no lugar do paciente e perguntar: eu sairia dessa sessão com algo novo? — a resposta revela a potência do seu trabalho."
          meta="Competência Avaliada · AvaliAllos"
        />
        <PotenciaInsightContent />
      </main>
      <Footer />
    </>
  );
}
