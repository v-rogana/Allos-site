import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import AcolhimentoContent from "@/components/acolhimento/AcolhimentoContent";

export const metadata = {
  title: "Sensação de Acolhimento | AvaliAllos",
  description: "O acolhimento em psicoterapia vai além de gestos superficiais — é uma postura intencional que sustenta o vínculo.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          badge="Relação Terapêutica"
          titleLine1="Sensação de"
          titleLine2="Acolhimento"
          titleLine2Italic={true}
          subtitle="O acolhimento não é tom suave ou simpatia — é a capacidade de ajustar cada interação para sustentar o vínculo e promover o crescimento."
          meta="Competência Avaliada · AvaliAllos"
        />
        <AcolhimentoContent />
      </main>
      <Footer />
    </>
  );
}
