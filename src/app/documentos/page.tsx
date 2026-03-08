import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import DocumentosGrid from "@/components/documentos/DocumentosGrid";

export const metadata = {
  title: "Documentos Institucionais — Associação Allos",
  description: "Acesse os documentos institucionais da Associação Allos: estatuto, certidões, atas e registros de transparência.",
};

export default function DocumentosPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Documentos"
          titleLine2="Institucionais"
          titleLine2Italic={true}
          subtitle="Centralizamos aqui todos os documentos formais da Associação Allos, reforçando nosso compromisso com a transparência, a boa governança e a integração com a comunidade."
          meta="10 documentos disponíveis"
        />
        <DocumentosGrid />
      </main>
      <Footer />
    </>
  );
}
