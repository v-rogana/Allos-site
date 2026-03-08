import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import EstagiosContent from "@/components/estagios-mudanca/EstagiosContent";

export const metadata = {
  title: "Estágios de Mudança | AvaliAllos",
  description:
    "Compreender os estágios de mudança melhora a sensibilidade clínica e a efetividade do atendimento psicológico.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Estágios de"
          titleLine2="Mudança"
          titleLine2Italic={true}
          subtitle="Saber reconhecer o momento em que o paciente se encontra em seu processo de transformação é o que permite intervir com precisão — sem precipitação nem omissão."
          meta="Competência Avaliada · AvaliAllos"
        />
        <EstagiosContent />
      </main>
      <Footer />
    </>
  );
}
