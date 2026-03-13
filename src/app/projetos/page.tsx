import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Projetos — Associação Allos",
  description: "Projetos da Associação Allos.",
};

export default function ProjetosPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center" style={{ background: 'linear-gradient(180deg, #0B0C14 0%, #1A1A1A 100%)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚧</div>
          <h1 className="font-fraunces text-4xl md:text-5xl font-bold mb-4" style={{ color: '#FDFBF7' }}>
            Página em construção
          </h1>
          <p className="font-dm text-lg md:text-xl max-w-lg" style={{ color: 'rgba(253,251,247,0.5)' }}>
            Estamos preparando algo especial. Volte em breve!
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
