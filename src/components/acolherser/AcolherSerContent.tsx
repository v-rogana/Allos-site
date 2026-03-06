"use client";
import "./acolherser.css";

export default function AcolherSerContent() {
  return (
    <div className="acolherser-page">
{/* ═══════ HERO ═══════ */}
  <section className="hero">
    <h1>Cuidar de quem cuida <em>da cidade</em></h1>
    <p className="hero-sub">
      Programa AcolherSer — saúde mental preventiva para servidores públicos. Resultados reais, impacto mensurável, excelência comprovada.
    </p>
    <div className="hero-stats">
      <div className="stat">
        <div className="stat-number">9,5<span style={{"fontSize":"0.45em","color":"var(--text-muted)","fontWeight":"400"}}>/10</span></div>
        <div className="stat-label">Nota de<br />satisfação</div>
      </div>
      <div className="stat">
        <div className="stat-number">1.230+</div>
        <div className="stat-label">Sessões<br />realizadas</div>
      </div>
      <div className="stat">
        <div className="stat-number">~940</div>
        <div className="stat-label">Vidas<br />impactadas</div>
      </div>
      <div className="stat">
        <div className="stat-number">+57%</div>
        <div className="stat-label">Crescimento<br />orgânico</div>
      </div>
    </div>
    <div className="scroll-indicator">
      <span>Conheça os resultados</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>

  {/* ═══════ CRISIS ═══════ */}
  <section className="crisis">
    <div className="container">
      <span className="section-label">O cenário nacional</span>
      <h2 className="section-title">O Brasil vive uma crise silenciosa de saúde mental no trabalho</h2>

      <div className="crisis-grid">
        <div className="crisis-card">
          <div className="big-num">546 mil</div>
          <div className="big-label">afastamentos por saúde mental em 2025 — recorde histórico pelo 2º ano consecutivo</div>
          <div className="source">INSS / Ministério da Previdência Social</div>
        </div>
        <div className="crisis-card">
          <div className="big-num">R$ 3,5 bi</div>
          <div className="big-label">pagos pelo INSS em benefícios por incapacidade relacionados a transtornos mentais</div>
          <div className="source">Data Cajuína / INSS 2025</div>
        </div>
        <div className="crisis-card">
          <div className="big-num">83 mil</div>
          <div className="big-label">afastamentos em Minas Gerais — o 2º estado mais afetado do país</div>
          <div className="source">INSS / G1</div>
        </div>
      </div>

      <div className="crisis-callout">
        <div className="icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8963E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <p>
          <strong>Antes dos afastamentos formais, existe um contingente enorme de trabalhadores em sofrimento psíquico</strong> — com queda de produtividade, conflitos e erros — que ainda não entrou nas estatísticas. É nessa janela que a prevenção é decisiva.
          <br /><em style={{"opacity":"0.55","fontSize":"0.82rem"}}>— ANAMT, 2026</em>
        </p>
      </div>
    </div>
  </section>

  {/* ═══════ ABOUT ═══════ */}
  <section className="about">
    <div className="container">
      <div className="about-grid">
        <div className="about-content">
          <span className="section-label">Sobre o programa</span>
          <h2 className="section-title">AcolherSer: prevenção com excelência clínica</h2>
          <p>
            O AcolherSer é um programa de atenção psicológica preventiva para servidores públicos, operado pela Associação Allos — uma clínica-escola que forma e seleciona terapeutas com rigor acima do mercado.
          </p>
          <p>
            Diferente de soluções genéricas de bem-estar, o programa opera com <strong>supervisão técnica obrigatória</strong>, gestão digital por plataforma proprietária (Hamilton) e avaliação contínua de qualidade.
          </p>
          <p>
            O modelo é quinquenal e preventivo: intervir <strong>antes</strong> que o sofrimento psíquico se converta em afastamento, judicialização ou colapso institucional.
          </p>

          <div className="quote-box">
            <p>"Transformar talentos em legado — e proteger quem sustenta o serviço público."</p>
            <cite>— Missão Allos</cite>
          </div>
        </div>

        <div>
          <div className="about-pillars">
            <div className="pillar">
              <div className="pillar-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg></div>
              <h4>Seleção Rigorosa</h4>
              <p>Apenas 5% dos terapeutas aprovados na 1ª tentativa. Avaliação por banca em 12 competências.</p>
            </div>
            <div className="pillar">
              <div className="pillar-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/></svg></div>
              <h4>Gestão por Dados</h4>
              <p>Plataforma Hamilton: prontuários digitais, KPIs, rastreamento de desfechos clínicos em tempo real.</p>
            </div>
            <div className="pillar">
              <div className="pillar-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></div>
              <h4>Supervisão Técnica</h4>
              <p>Todos os atendimentos supervisionados. Qualidade clínica monitorada continuamente.</p>
            </div>
            <div className="pillar">
              <div className="pillar-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <h4>Modelo Preventivo</h4>
              <p>Intervir antes do afastamento. Ações individuais, grupais e institucionais integradas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ═══════ THREE LENSES ═══════ */}
  <section className="lenses">
    <div className="container">
      <span className="section-label">Impacto mensurado</span>
      <h2 className="section-title">Resultados em três dimensões</h2>
      <p className="section-desc">Medimos o impacto do AcolherSer em alcance humano, economia projetada e excelência operacional — com cálculos conservadores e fontes auditáveis.</p>

      <div className="lenses-grid">
        {/* Lens 1 */}
        <div className="lens-card lens-1">
          <span className="lens-emoji"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1A7A6D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></span>
          <div className="lens-label">Alcance humano</div>
          <div className="lens-number">~940</div>
          <div className="lens-unit">pontos de contato</div>
          <ul className="lens-details">
            <li><span>Servidores atendidos</span> <strong>70+</strong></li>
            <li><span>Familiares impactados</span> <strong>~145</strong></li>
            <li><span>Participações coletivas</span> <strong>724</strong></li>
            <li><span>Palestras + Grupos</span> <strong>25 + 28</strong></li>
          </ul>
        </div>

        {/* Lens 2 */}
        <div className="lens-card lens-2">
          <span className="lens-emoji"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E8963E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></span>
          <div className="lens-label">Economia projetada</div>
          <div className="lens-number">R$ 138-276k</div>
          <div className="lens-unit">em custo evitado</div>
          <ul className="lens-details">
            <li><span>Afastamentos evitados</span> <strong>7 a 14</strong></li>
            <li><span>Dias recuperados</span> <strong>672 a 1.344</strong></li>
            <li><span>Custo/afastamento</span> <strong>R$ 6.568</strong></li>
            <li><span>Fator indireto</span> <strong>2x (conserv.)</strong></li>
          </ul>
        </div>

        {/* Lens 3 */}
        <div className="lens-card lens-3">
          <span className="lens-emoji"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
          <div className="lens-label">Excelência</div>
          <div className="lens-number">NPS +90</div>
          <div className="lens-unit">Zona de Encantamento</div>
          <ul className="lens-details">
            <li><span>Nota média</span> <strong>9,5 / 10</strong></li>
            <li><span>NPS de saída</span> <strong>+100</strong></li>
            <li><span>Taxa de realização</span> <strong>75,4%</strong></li>
            <li><span>Terapeutas alocados</span> <strong>26</strong></li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  {/* ═══════ STATS BANNER ═══════ */}
  <section className="stats-banner">
    <h2>Os números mostram o que a prevenção pode fazer por uma cidade inteira</h2>
    <div className="banner-stats">
      <div className="banner-stat">
        <span className="banner-stat-number">1.230+</span>
        <span className="banner-stat-label">Sessões realizadas</span>
      </div>
      <div className="banner-stat">
        <span className="banner-stat-number">25</span>
        <span className="banner-stat-label">Palestras temáticas</span>
      </div>
      <div className="banner-stat">
        <span className="banner-stat-number">17</span>
        <span className="banner-stat-label">Plantões emergenciais</span>
      </div>
      <div className="banner-stat">
        <span className="banner-stat-number">26</span>
        <span className="banner-stat-label">Terapeutas mobilizados</span>
      </div>
    </div>
  </section>

  {/* ═══════ EVOLUTION ═══════ */}
  <section className="evolution">
    <div className="container">
      <span className="section-label">Evolução</span>
      <h2 className="section-title">Crescimento orgânico: a demanda fala por si</h2>
      <p className="section-desc">O crescimento de +57% entre 2024 e 2025 aconteceu sem campanhas de captação — os próprios servidores procuraram o programa por indicação e confiança.</p>

      <div className="chart-container">
        <div className="chart-legend">
          <span><span className="legend-dot" style={{"background":"rgba(26,122,109,0.3)"}}></span> 2024</span>
          <span><span className="legend-dot" style={{"background":"var(--teal)"}}></span> 2025</span>
        </div>

        <div className="bars-wrapper">
          <div className="bar-group"><div className="bar y2024" style={{"height":"0%"}} title="Jan/2024: 0"></div><div className="bar y2025" style={{"height":"67.4%"}} title="Jan/2025: 58"></div><div className="bar-month">Jan</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"4.7%"}} title="Fev/2024: 4"></div><div className="bar y2025" style={{"height":"80.2%"}} title="Fev/2025: 69"></div><div className="bar-month">Fev</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"29.1%"}} title="Mar/2024: 25"></div><div className="bar y2025" style={{"height":"76.7%"}} title="Mar/2025: 66"></div><div className="bar-month">Mar</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"38.4%"}} title="Abr/2024: 33"></div><div className="bar y2025" style={{"height":"81.4%"}} title="Abr/2025: 70"></div><div className="bar-month">Abr</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"33.7%"}} title="Mai/2024: 29"></div><div className="bar y2025" style={{"height":"58.1%"}} title="Mai/2025: 50"></div><div className="bar-month">Mai</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"46.5%"}} title="Jun/2024: 40"></div><div className="bar y2025" style={{"height":"50%"}} title="Jun/2025: 43"></div><div className="bar-month">Jun</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"52.3%"}} title="Jul/2024: 45"></div><div className="bar y2025" style={{"height":"52.3%"}} title="Jul/2025: 45"></div><div className="bar-month">Jul</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"61.6%"}} title="Ago/2024: 53"></div><div className="bar y2025" style={{"height":"64%"}} title="Ago/2025: 55"></div><div className="bar-month">Ago</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"69.8%"}} title="Set/2024: 60"></div><div className="bar y2025" style={{"height":"77.9%"}} title="Set/2025: 67"></div><div className="bar-month">Set</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"86%"}} title="Out/2024: 74"></div><div className="bar y2025" style={{"height":"90.7%"}} title="Out/2025: 78"></div><div className="bar-month">Out</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"76.7%"}} title="Nov/2024: 66"></div><div className="bar y2025" style={{"height":"100%"}} title="Nov/2025: 86"></div><div className="bar-month">Nov</div></div>
          <div className="bar-group"><div className="bar y2024" style={{"height":"58.1%"}} title="Dez/2024: 50"></div><div className="bar y2025" style={{"height":"74.4%"}} title="Dez/2025: 64"></div><div className="bar-month">Dez</div></div>
        </div>

        <div className="chart-growth">
          <div className="growth-item">
            <div className="val">479</div>
            <div className="lbl">Total 2024</div>
          </div>
          <div className="growth-item">
            <div className="val">751</div>
            <div className="lbl">Total 2025</div>
          </div>
          <div className="growth-item">
            <div className="val">+57%</div>
            <div className="lbl">Crescimento</div>
          </div>
          <div className="growth-item">
            <div className="val">86</div>
            <div className="lbl">Pico mensal (Nov/25)</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ═══════ EVIDENCE ═══════ */}
  <section className="evidence">
    <div className="container">
      <span className="section-label">Base científica</span>
      <h2 className="section-title">Evidências que sustentam cada número</h2>
      <p className="section-desc">Todas as extrapolações deste relatório são conservadoras e baseadas em literatura científica revisada por pares e dados oficiais.</p>

      <div className="evidence-grid">
        <div className="ev-card">
          <span className="ev-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span>
          <h4>Psicoterapia reduz afastamentos em 40%</h4>
          <p>Estudo com 14.530 pacientes mostrou redução de 34 para 20 dias de afastamento/ano após intervenção psicoterapêutica ambulatorial.</p>
          <div className="ev-source">Psychological Medicine, Cambridge, 2023</div>
        </div>
        <div className="ev-card">
          <span className="ev-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></span>
          <h4>Cada $1 investido retorna $4</h4>
          <p>A OMS estima retorno de US$ 4 em produtividade e saúde para cada US$ 1 investido em programas de saúde mental no trabalho.</p>
          <div className="ev-source">Organização Mundial da Saúde (OMS)</div>
        </div>
        <div className="ev-card">
          <span className="ev-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span>
          <h4>27% menos absenteísmo</h4>
          <p>Iniciativas estruturadas de saúde mental no trabalho reduzem absenteísmo em 27% e custos com saúde em 26%.</p>
          <div className="ev-source">OMS — Workplace Health</div>
        </div>
        <div className="ev-card">
          <span className="ev-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg></span>
          <h4>48% dos trabalhadores em risco</h4>
          <p>Pesquisa com 8.980 trabalhadores brasileiros revelou que quase metade apresenta risco para transtornos de saúde mental.</p>
          <div className="ev-source">Pipo Saúde / Valor Econômico, 2024</div>
        </div>
      </div>
    </div>
  </section>

  {/* ═══════ NR-1 ═══════ */}
  <section className="nr1">
    <div className="container">
      <div className="nr1-content">
        <div className="nr1-text">
          <span className="section-label">Conformidade legal</span>
          <h2 className="section-title" style={{"color":"var(--cream)"}}>NR-1 atualizada: riscos psicossociais são obrigação legal</h2>
          <p>
            A atualização da Norma Regulamentadora nº 1 (NR-1) incluiu a gestão de <strong style={{"color":"var(--accent)"}}>riscos psicossociais</strong> como obrigação de todas as organizações — incluindo a administração pública.
          </p>
          <p>
            O AcolherSer não apenas atende essa exigência, mas vai além: opera um sistema preventivo contínuo que transforma conformidade em vantagem institucional.
          </p>
        </div>
        <ul className="nr1-checklist">
          <li><span className="check">✓</span> Mapeamento de riscos psicossociais por setor</li>
          <li><span className="check">✓</span> Atendimento individual com registro digital</li>
          <li><span className="check">✓</span> Grupos terapêuticos e palestras de sensibilização</li>
          <li><span className="check">✓</span> Plantões emergenciais para crises agudas</li>
          <li><span className="check">✓</span> Relatórios periódicos com KPIs e desfechos</li>
          <li><span className="check">✓</span> Supervisão técnica obrigatória de todos os atendimentos</li>
          <li><span className="check">✓</span> Plataforma digital de gestão clínica (Hamilton)</li>
        </ul>
      </div>
    </div>
  </section>

  {/* ═══════ SATISFACTION ═══════ */}
  <section className="satisfaction">
    <div className="container">
      <span className="section-label">Satisfação</span>
      <h2 className="section-title">O que dizem os servidores</h2>
      <p className="section-desc">NPS (Net Promoter Score) na faixa de marcas como Apple e Netflix. Os servidores não apenas aprovam — eles recomendam.</p>

      <div className="nps-display">
        <div className="nps-big">
          <div className="nps-score">+90</div>
          <div className="nps-label">Net Promoter Score</div>
          <div className="nps-zone">Zona de Encantamento</div>
        </div>
        <div className="nps-details-grid">
          <div className="nps-detail">
            <div className="nd-val">9,5</div>
            <div className="nd-label">Nota média de satisfação (de 0 a 10)</div>
          </div>
          <div className="nps-detail">
            <div className="nd-val">+100</div>
            <div className="nd-label">NPS de saída — todos os servidores que encerraram são promotores</div>
          </div>
          <div className="nps-detail">
            <div className="nd-val">75,4%</div>
            <div className="nd-label">Taxa de realização das consultas agendadas</div>
          </div>
          <div className="nps-detail">
            <div className="nd-val">64,3%</div>
            <div className="nd-label">Desejam continuar o acompanhamento com a Allos</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ═══════ ROI BANNER ═══════ */}
  <section className="roi-banner">
    <p className="roi-quote">"Cuidar de quem cuida da cidade é a estratégia mais eficiente para melhorar o atendimento à população."</p>
    <p className="roi-attribution">— Tese central do Programa AcolherSer</p>
    <div className="roi-stats">
      <div>
        <span className="roi-stat-number">US$ 4 : 1</span>
        <span className="roi-stat-label">ROI estimado pela OMS</span>
      </div>
      <div>
        <span className="roi-stat-number">R$ 6.568</span>
        <span className="roi-stat-label">Custo médio/afastamento (INSS)</span>
      </div>
      <div>
        <span className="roi-stat-number">96 dias</span>
        <span className="roi-stat-label">Duração média de afastamento</span>
      </div>
    </div>
  </section>

  {/* ═══════ CTA ═══════ */}
  <section className="cta-section">
    <h2>Pronto para transformar a saúde mental do seu <em>município</em>?</h2>
    <p>
      Converse com a equipe da Allos e conheça como o AcolherSer pode ser implantado na sua cidade — com governança, dados e resultados comprovados.
    </p>
    <a href="mailto:suporte@allos.org.br" className="cta-button">
      Falar com a equipe Allos
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </a>
    <p className="cta-secondary">
      <a href="mailto:suporte@allos.org.br" >suporte@allos.org.br</a> · <a href="https://allos.org.br">allos.org.br</a>
    </p>
  </section>

  {/* ═══════ FOOTER ═══════ */}
    </div>
  );
}
