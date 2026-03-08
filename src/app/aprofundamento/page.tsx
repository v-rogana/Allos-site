import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import AprofundamentoContent from "@/components/aprofundamento/AprofundamentoContent";

export const metadata = {
  title: "Capacidade de Aprofundar | AvaliAllos",
  description: "A capacidade de aprofundar é a estratégia clínica para ir além do conteúdo explícito, explorando a demanda real subjacente.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Capacidade de"
          titleLine2="Aprofundar"
          titleLine2Italic={true}
          subtitle="Ir além da demanda explícita para revelar as raízes do sofrimento — conectando o paciente a conflitos internos que ele ainda não reconhece."
          meta="Competência Avaliada · AvaliAllos"
        />
        <AprofundamentoContent />
      </main>
      <Footer />
    </>
  );
}
