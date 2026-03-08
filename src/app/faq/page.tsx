import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import HeroFaq from "@/components/faq/HeroFaq";
import FaqAccordion from "@/components/faq/FaqAccordion";
import FaqCTA from "@/components/faq/FaqCTA";
import type { FaqGroup } from "@/components/faq/FaqAccordion";

const faqData: FaqGroup[] = [
  {
    label: "Institucional",
    items: [
      {
        q: "O que \u00e9 a Allos?",
        a: "A Associa\u00e7\u00e3o Allos \u00e9 uma ONG sem fins lucrativos fundada em 2023, sediada em Belo Horizonte (MG), com atua\u00e7\u00e3o em n\u00edvel nacional. Atua como institui\u00e7\u00e3o de ensino e impacto social, conectando estudantes e volunt\u00e1rios a comunidades em situa\u00e7\u00e3o de vulnerabilidade. Desenvolvemos forma\u00e7\u00e3o pr\u00e1tica supervisionada remunerada nas \u00e1reas da sa\u00fade, especialmente Psicologia e Nutri\u00e7\u00e3o, articulando projetos sociais, pesquisa, servi\u00e7os institucionais e produ\u00e7\u00e3o cient\u00edfica e cultural.",
      },
      {
        q: "Como a Allos \u00e9 financiada?",
        a: "A principal fonte de receita da Allos s\u00e3o parcerias institucionais, por meio das quais prestamos servi\u00e7os de psicologia para empresas, \u00f3rg\u00e3os p\u00fablicos e institui\u00e7\u00f5es, al\u00e9m da receita proveniente dos atendimentos cl\u00ednicos realizados pela Cl\u00ednica Social.",
      },
      {
        q: "Se a Allos n\u00e3o tem fins lucrativos, por que os servi\u00e7os s\u00e3o pagos?",
        a: "A Allos possui custos operacionais necess\u00e1rios para manter seus projetos. Os atendimentos s\u00e3o cobrados em valores inferiores aos praticados no mercado, respeitando nosso car\u00e1ter social. Toda a receita \u00e9 integralmente reinvestida na institui\u00e7\u00e3o.",
      },
    ],
  },
  {
    label: "Cl\u00ednica",
    items: [
      { q: "O que \u00e9 a Cl\u00ednica Social da Allos?", a: "A Cl\u00ednica Social da Allos oferece atendimentos psicol\u00f3gicos e avalia\u00e7\u00f5es neuropsicol\u00f3gicas a pre\u00e7os acess\u00edveis, realizados por estagi\u00e1rios em forma\u00e7\u00e3o supervisionada." },
      { q: "Como \u00e9 feito o pagamento dos atendimentos?", a: "Os atendimentos psicol\u00f3gicos s\u00e3o pagos mensalmente, em valor fixo, via PIX. Avalia\u00e7\u00f5es neuropsicol\u00f3gicas podem ser pagas por PIX ou cart\u00e3o de cr\u00e9dito." },
      { q: "Quais demandas voc\u00eas atendem?", a: "Aceitamos todo tipo de demanda cl\u00ednica." },
      { q: "O atendimento \u00e9 confidencial?", a: "Sim. Todos os atendimentos seguem rigorosamente o C\u00f3digo de \u00c9tica do Psic\u00f3logo, garantindo sigilo e prote\u00e7\u00e3o da intimidade das pessoas atendidas." },
      { q: "Qual abordagem psicoterape\u00fatica voc\u00eas utilizam?", a: "A Allos trabalha com m\u00faltiplas abordagens, como Psican\u00e1lise, Junguiana, Abordagem Centrada na Pessoa, Comportamental, Neuropsicologia, entre outras." },
      { q: "O atendimento \u00e9 online ou presencial?", a: "Oferecemos atendimento online para todo o Brasil e atendimento presencial em Belo Horizonte, na Rua Rio Negro, 1048 \u2013 Barroca." },
    ],
  },
  {
    label: "Est\u00e1gios",
    items: [
      {
        q: "Como fa\u00e7o para conseguir est\u00e1gio na Allos?",
        a: (
          <>
            O processo seletivo para est\u00e1gio em psicologia cl\u00ednica est\u00e1 detalhado em:{" "}
            <a href="/Allos-site/processo-seletivo" className="text-[#C84B31] font-semibold hover:underline">
              Processo Seletivo Allos
            </a>
          </>
        ),
      },
      { q: "A Allos pode permitir legalmente que estagi\u00e1rios atendam?", a: "Sim. A Allos e seus supervisores cl\u00ednicos possuem registro no Conselho Regional de Psicologia. O atendimento realizado por graduandos segue integralmente as normas legais e \u00e9ticas vigentes." },
      { q: "Como funciona a bolsa de est\u00e1gio?", a: "A bolsa base para estagi\u00e1rios de Psicologia e Nutri\u00e7\u00e3o Cl\u00ednica \u00e9 de R$ 500,00, com vale-transporte para atividades presenciais. O valor pode aumentar conforme amplia\u00e7\u00e3o da carga de pacientes ou atua\u00e7\u00e3o em fun\u00e7\u00f5es institucionais adicionais." },
      { q: "A supervis\u00e3o \u00e9 gratuita?", a: "Sim. A supervis\u00e3o cl\u00ednica \u00e9 obrigat\u00f3ria, exclusiva para estagi\u00e1rios da Allos e oferecida gratuitamente." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <HeroFaq />
        <section className="py-20 md:py-28 px-6 md:px-10"
          style={{ background: "radial-gradient(ellipse at 5% 0%, rgba(200,75,49,0.04) 0%, transparent 50%), #161616" }}>
          <div className="max-w-[860px] mx-auto">
            <FaqAccordion groups={faqData} />
          </div>
        </section>
        <FaqCTA />
      </main>
      <Footer />
    </>
  );
}
