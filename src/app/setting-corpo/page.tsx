import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DarkHero from "@/components/DarkHero";
import SettingCorpoContent from "@/components/setting-corpo/SettingCorpoContent";

export const metadata = {
  title: "Setting e Corpo | AvaliAllos",
  description: "O setting e o corpo do terapeuta são intervenções em si mesmos — cada detalhe comunica algo ao paciente.",
};

export default function Page() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <DarkHero
          titleLine1="Setting &"
          titleLine2="Corpo"
          titleLine2Italic={true}
          subtitle="Cada detalhe do ambiente e da presença corporal do terapeuta comunica algo — vestuário, posição, iluminação, voz, gestos são intervenções em si."
          meta="Competência Avaliada · AvaliAllos"
        />
        <SettingCorpoContent />
      </main>
      <Footer />
    </>
  );
}
