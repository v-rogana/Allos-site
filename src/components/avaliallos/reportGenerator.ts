interface ReportData {
  id: number; data: string; avaliador_nome: string; avaliado_nome: string | null
  nome_sessao: string; observacoes: string | null; [key: string]: unknown
}

const CR = [
  { key: 'estagio_mudanca', label: 'Estágio de Mudança', cat: 'estrutura', desc: 'Mede o descompasso entre a intensidade das intervenções clínicas e o momento do paciente no processo de mudança.', link: '/estagios-mudanca' },
  { key: 'estrutura_coerencia', label: 'Coerência & Consistência', cat: 'estrutura', desc: 'Mede a coerência entre este atendimento e a abordagem do avaliado, a consistência teórica das intervenções.', link: '/coerencia-consistencia' },
  { key: 'encerramento_abertura', label: 'Abertura & Encerramento', cat: 'estrutura', desc: 'Abertura é a primeira decisão clínica do atendimento. Encerramento mede a capacidade de fechar adequadamente.', link: '/abertura-encerramento' },
  { key: 'acolhimento', label: 'Sensação de Acolhimento', cat: 'relacao', desc: 'Mede a qualidade do vínculo clínico e a conformidade dele com a proposta terapêutica.', link: '/acolhimento' },
  { key: 'seguranca_terapeuta', label: 'Segurança no Terapeuta', cat: 'relacao', desc: 'Mede o quão seguro o paciente se sente nas mãos desse profissional.', link: '/seguranca-terapeuta' },
  { key: 'seguranca_metodo', label: 'Segurança no Método', cat: 'relacao', desc: 'Mede a credibilidade transmitida pelo clínico na sua forma de atuar.', link: '/seguranca-metodo' },
  { key: 'aprofundamento', label: 'Capacidade de Aprofundar', cat: 'formulacao', desc: 'Mede a capacidade do clínico de fazer o paciente aprofundar nos temas relevantes.', link: '/aprofundamento' },
  { key: 'hipoteses', label: 'Construção de Hipóteses', cat: 'formulacao', desc: 'Mede a qualidade das hipóteses clínicas, a clareza do que é central no caso.', link: '/hipoteses-clinicas' },
  { key: 'interpretacao', label: 'Capacidade Interpretativa', cat: 'formulacao', desc: 'Mede a qualidade da escuta clínica, implicando saber priorizar nas pontuações.', link: '/interpretacao' },
  { key: 'frase_timing', label: 'Frase & Timing', cat: 'performance', desc: 'Mede a qualidade da execução da decisão clínica. Envolve escolha vocabular, modulação vocal, timing.', link: '/frase-timing' },
  { key: 'corpo_setting', label: 'Corpo & Setting', cat: 'performance', desc: 'Mede a potência clínica dos elementos visuais. Percepção da comunicação não verbal.', link: '/setting-corpo' },
  { key: 'insight_potencia', label: 'Insight & Potência', cat: 'performance', desc: 'Mede a capacidade de provocar mudança, a potência do atendimento.', link: '/potencia-insight' },
]

const CT: Record<string, { c: string; l: string }> = {
  estrutura: { c: '#C84B31', l: 'Estrutura do Atendimento' },
  relacao: { c: '#D4854A', l: 'Relação Terapêutica' },
  formulacao: { c: '#B84060', l: 'Interpretação e Formulação' },
  performance: { c: '#8B5CF6', l: 'Performance' },
}

const SL: Record<number, string> = { [-9]: 'Erros fatais', [-3]: 'Erros graves', [-1]: 'Erros pontuais', 1: 'Adequado', 3: 'Muito bom', 9: 'Excepcional' }

const LINKS = [
  { n: 'Tempo clínico', u: 'https://youtu.be/NJBRCNbPc3Q' },
  { n: 'Relação terapêutica', u: 'https://www.youtube.com/watch?v=JTso5qJYMNU' },
  { n: 'Esquemas de aprofundamento', u: 'https://youtu.be/pbCStH1GWgY' },
  { n: 'Introdução à hermenêutica', u: 'https://youtu.be/lhOlhOd3bDY' },
  { n: 'Primeiros passos na clínica', u: 'https://youtu.be/JTso5qJYMNU' },
  { n: 'Máximas psicológicas', u: 'https://youtu.be/WzFJFIem8EE' },
  { n: 'Insight e potência', u: 'https://youtu.be/u1uOyDlyjUU' },
]

function buildHTML(a: ReportData, light = false): string {
  const sc = CR.map(c => ({ ...c, val: (a[c.key] as number) || 0 }))
  const total = sc.reduce((s, c) => s + c.val, 0)
  const media = (total / sc.length).toFixed(1)
  const dt = new Date(a.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const nm = a.avaliado_nome || a.nome_sessao
  const o = typeof window !== 'undefined' ? window.location.origin : ''
  const sCol = (v: number) => v >= 3 ? '#0EA5A0' : v >= 1 ? '#1BBAB0' : v >= -1 ? '#D4854A' : '#C84B31'

  // Radar
  const cx = 200, cy = 200, R = 145, n = sc.length, st = (2 * Math.PI) / n
  const nrm = (v: number) => ((v + 9) / 18) * R
  const grd = [0.22, 0.44, 0.66, 0.88].map(l => {
    const p = Array.from({ length: n }, (_, i) => { const a = i * st - Math.PI / 2; return `${cx + l * R * Math.cos(a)},${cy + l * R * Math.sin(a)}` }).join(' ')
    return `<polygon points="${p}" fill="none" stroke="rgba(253,251,247,${l > 0.5 ? 0.08 : 0.04})" stroke-width="0.7"/>`
  }).join('')
  const ax = Array.from({ length: n }, (_, i) => { const a = i * st - Math.PI / 2; return `<line x1="${cx}" y1="${cy}" x2="${cx + R * Math.cos(a)}" y2="${cy + R * Math.sin(a)}" stroke="rgba(253,251,247,0.03)"/>` }).join('')
  const dp = sc.map((s, i) => { const r = nrm(s.val), a = i * st - Math.PI / 2; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}` }).join(' ')
  const dt2 = sc.map((s, i) => { const r = nrm(s.val), a = i * st - Math.PI / 2; const c = CT[s.cat].c; return `<circle cx="${cx + r * Math.cos(a)}" cy="${cy + r * Math.sin(a)}" r="4.5" fill="${c}"/><circle cx="${cx + r * Math.cos(a)}" cy="${cy + r * Math.sin(a)}" r="10" fill="${c}" opacity="0.1"/>` }).join('')
  const lb = sc.map((s, i) => { const a = i * st - Math.PI / 2; const x = cx + (R + 32) * Math.cos(a), y = cy + (R + 32) * Math.sin(a); const an = Math.abs(Math.cos(a)) < 0.15 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end'; const t = s.label.length > 15 ? s.label.slice(0, 14) + '…' : s.label; return `<text x="${x}" y="${y}" text-anchor="${an}" dominant-baseline="middle" fill="${CT[s.cat].c}" font-family="DM Sans,sans-serif" font-size="8.5" font-weight="600" opacity="0.85">${t}</text>` }).join('')

  // Details
  const byCat = Object.entries(sc.reduce<Record<string, typeof sc>>((a, s) => { if (!a[s.cat]) a[s.cat] = []; a[s.cat].push(s); return a }, {}))
  const details = byCat.map(([cat, crits]) => {
    const c = CT[cat as keyof typeof CT]
    return `<div style="margin-bottom:40px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <div style="width:4px;height:28px;border-radius:2px;background:${c.c}"></div>
        <span style="font-family:'Fraunces',serif;font-size:19px;color:rgba(253,251,247,0.92)">${c.l}</span>
      </div>
      ${crits.map(cr => `<div style="display:flex;gap:16px;padding:22px 24px;border-radius:16px;background:rgba(253,251,247,0.015);border:1px solid rgba(253,251,247,0.045);margin-bottom:10px;position:relative;overflow:hidden">
        <div style="position:absolute;top:0;left:0;width:3px;height:100%;background:${c.c};opacity:0.4"></div>
        <div style="min-width:52px;text-align:center;padding-top:2px">
          <div style="font-size:24px;font-weight:800;color:${sCol(cr.val)};font-family:'DM Sans';line-height:1">${cr.val > 0 ? '+' : ''}${cr.val}</div>
          <div style="font-size:8.5px;color:${sCol(cr.val)};opacity:0.65;margin-top:3px;text-transform:uppercase;letter-spacing:0.5px">${SL[cr.val] || ''}</div>
        </div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:600;color:rgba(253,251,247,0.88);margin-bottom:5px">${cr.label}</div>
          <div style="font-size:12px;color:rgba(253,251,247,0.3);line-height:1.7">${cr.desc}</div>
          <a href="${o}${cr.link}" target="_blank" style="font-size:10.5px;color:${c.c};text-decoration:none;margin-top:8px;display:inline-block;opacity:0.75;letter-spacing:0.3px">Explorar competência →</a>
        </div>
      </div>`).join('')}
    </div>`
  }).join('')

  // Comp grid
  const cg = Object.entries(CT).map(([k, v]) => {
    const items = CR.filter(c => c.cat === k)
    return `<div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px">
        <div style="width:8px;height:8px;border-radius:2px;background:${v.c}"></div>
        <span style="font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${v.c}">${v.l.split(' ')[0]}</span>
      </div>
      ${items.map(c => { const v2 = (a[c.key] as number) || 0; return `<a href="${o}${c.link}" target="_blank" style="display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-radius:10px;background:rgba(253,251,247,0.015);border:1px solid rgba(253,251,247,0.04);margin-bottom:5px;text-decoration:none"><span style="font-size:11.5px;color:rgba(253,251,247,0.55)">${c.label}</span><span style="font-size:11.5px;font-weight:700;color:${sCol(v2)}">${v2 > 0 ? '+' : ''}${v2}</span></a>` }).join('')}
    </div>`
  }).join('')

  const html = `<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AvaliAllos — ${nm}</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0A0A0F;color:rgba(253,251,247,0.9);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden}
.bg{position:fixed;inset:0;pointer-events:none;z-index:0}
.bg::before{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");opacity:0.5}
.bg::after{content:'';position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:120%;height:60%;background:radial-gradient(ellipse,rgba(14,165,160,0.05) 0%,transparent 55%)}
.stars{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.stars span{position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(253,251,247,0.25);animation:twinkle 4s ease-in-out infinite}
.stars span:nth-child(odd){animation-duration:3s;width:1.5px;height:1.5px;background:rgba(253,251,247,0.15)}
.stars span:nth-child(3n){animation-duration:5s;width:2.5px;height:2.5px;background:rgba(14,165,160,0.2)}
@keyframes twinkle{0%,100%{opacity:0.15}50%{opacity:0.8}}
.g2{position:fixed;bottom:-10%;right:-5%;width:50%;height:40%;background:radial-gradient(ellipse,rgba(200,75,49,0.025) 0%,transparent 65%);pointer-events:none;z-index:0}
.g3{position:fixed;top:40%;left:-10%;width:30%;height:30%;background:radial-gradient(ellipse,rgba(139,92,246,0.02) 0%,transparent 65%);pointer-events:none;z-index:0}
.w{max-width:740px;margin:0 auto;padding:56px 28px;position:relative;z-index:1}
a{transition:opacity 0.2s}a:hover{opacity:0.8}
@media(max-width:600px){.w{padding:28px 16px}.rdr svg{width:280px!important;height:280px!important}.cg{grid-template-columns:1fr 1fr!important}.sl{grid-template-columns:repeat(3,1fr)!important}.mt{flex-direction:column}.mt>div{text-align:left!important}}
${light ? `
@page{margin:0;size:A4}
*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
body{background:#0D1219!important;margin:0!important}
.bg::before,.bg::after{display:block!important}
.bg{position:absolute!important}
.g2,.g3{position:absolute!important}
.stars{display:none!important}
.w{padding:40px 32px!important}
a{color:#0EA5A0!important}
` : `@media print{@page{margin:0.4in}.bg,.g2,.g3,.stars{display:none!important}}`}
</style></head><body>
<div class="bg"></div><div class="g2"></div><div class="g3"></div>
${light ? '' : `<div class="stars">${Array.from({length:60},()=>{const x=Math.random()*100;const y=Math.random()*100;const d=Math.random()*3;return `<span style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`}).join('')}</div>`}
<div class="w">

<!-- HEADER -->
<div style="text-align:center;padding:16px 0 56px">
  <div style="display:inline-block;font-size:9.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;padding:7px 22px;border-radius:999px;background:rgba(14,165,160,0.06);color:#0EA5A0;border:1px solid rgba(14,165,160,0.1)">AvaliAllos · Associação Allos</div>
  <h1 style="font-family:'Fraunces',serif;font-size:clamp(30px,5.5vw,46px);margin-top:24px;color:rgba(253,251,247,0.95);line-height:1.1">Resultado da<br><em style="color:#0EA5A0;font-style:italic">AvaliAllos</em></h1>
  <p style="font-size:13px;color:rgba(253,251,247,0.28);margin-top:12px;letter-spacing:0.3px">Avaliação de Aptidão Clínica — Processo de Entrada</p>
  <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:28px">
    <div style="width:5px;height:5px;border-radius:50%;background:#0EA5A0"></div>
    <div style="width:56px;height:1px;background:linear-gradient(90deg,rgba(14,165,160,0.4),transparent)"></div>
    <div style="width:5px;height:5px;border-radius:50%;background:rgba(253,251,247,0.15)"></div>
    <div style="width:56px;height:1px;background:linear-gradient(90deg,transparent,rgba(14,165,160,0.4))"></div>
    <div style="width:5px;height:5px;border-radius:50%;background:#0EA5A0"></div>
  </div>
</div>

<!-- INTRO -->
<div style="padding:28px 32px;border-radius:18px;background:linear-gradient(135deg,rgba(253,251,247,0.015),rgba(253,251,247,0.008));border:1px solid rgba(253,251,247,0.04);border-left:3px solid rgba(14,165,160,0.4);margin-bottom:32px">
  <p style="font-size:14px;color:rgba(253,251,247,0.5);line-height:1.85">Na Allos, acreditamos que o aprendizado verdadeiro nasce da prática, do erro e do feedback. Cada prática aqui é uma oportunidade de crescimento — de testar habilidades, superar inseguranças e evoluir continuamente.</p>
  <p style="font-size:12px;color:rgba(253,251,247,0.22);margin-top:14px;font-style:italic;line-height:1.7">Mais do que uma formação, somos uma comunidade movida por um propósito: transformar a psicologia e a prática clínica em algo rigoroso, vivo e impactante.</p>
</div>

<!-- SCORE SCALE -->
<div style="padding:24px;border-radius:18px;background:rgba(253,251,247,0.01);border:1px solid rgba(253,251,247,0.035);margin-bottom:40px">
  <p style="font-size:13px;color:rgba(253,251,247,0.4);margin-bottom:18px">A nota vai de <strong style="color:rgba(253,251,247,0.75)">-100</strong> a <strong style="color:rgba(253,251,247,0.75)">+100</strong>. Nota de corte: <strong style="color:#0EA5A0">+25</strong>.</p>
  <div class="sl" style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px">
    ${[{ v:-9,c:'#C84B31' },{ v:-3,c:'#C84B31' },{ v:-1,c:'#D4854A' },{ v:1,c:'#1BBAB0' },{ v:3,c:'#0EA5A0' },{ v:9,c:'#0EA5A0' }].map(s => `<div style="text-align:center;padding:14px 4px;border-radius:12px;background:${s.c}08;border:1px solid ${s.c}15"><div style="font-size:20px;font-weight:800;color:${s.c}">${s.v > 0 ? '+' : ''}${s.v}</div><div style="font-size:8px;color:${s.c};opacity:0.6;margin-top:3px;letter-spacing:0.5px;text-transform:uppercase">${SL[s.v]}</div></div>`).join('')}
  </div>
</div>

<!-- RADAR -->
<div style="text-align:center;margin-bottom:12px">
  <span style="font-family:'Fraunces',serif;font-size:22px;color:rgba(253,251,247,0.92)">Radar de Competências</span>
  <p style="font-size:13px;color:rgba(253,251,247,0.25);margin-top:4px">${nm}</p>
</div>
<div class="rdr" style="text-align:center;margin-bottom:20px">
  <svg viewBox="0 0 400 400" width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="rg"><stop offset="0%" stop-color="rgba(14,165,160,0.06)"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#rg)"/>
    ${grd}${ax}
    <polygon points="${dp}" fill="rgba(14,165,160,0.08)" stroke="rgba(14,165,160,0.6)" stroke-width="2" stroke-linejoin="round"/>
    ${dt2}${lb}
  </svg>
</div>

<!-- TOTAL -->
<div class="mt" style="display:flex;justify-content:center;gap:28px;flex-wrap:wrap;padding:24px 28px;border-radius:16px;background:linear-gradient(135deg,rgba(14,165,160,0.025),rgba(14,165,160,0.005));border:1px solid rgba(14,165,160,0.08);margin-bottom:48px">
  <div style="text-align:center"><div style="font-size:10px;color:rgba(253,251,247,0.25);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">Pontuação</div><div style="font-size:32px;font-weight:800;color:${total >= 25 ? '#0EA5A0' : total >= 0 ? '#1BBAB0' : '#C84B31'};line-height:1">${total > 0 ? '+' : ''}${total}</div></div>
  <div style="width:1px;background:rgba(253,251,247,0.05)"></div>
  <div style="text-align:center"><div style="font-size:10px;color:rgba(253,251,247,0.25);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">Média</div><div style="font-size:24px;font-weight:700;color:rgba(253,251,247,0.75);line-height:1">${media}</div></div>
  <div style="width:1px;background:rgba(253,251,247,0.05)"></div>
  <div style="text-align:center"><div style="font-size:10px;color:rgba(253,251,247,0.25);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">Data</div><div style="font-size:17px;font-weight:600;color:rgba(253,251,247,0.6);line-height:1">${dt}</div></div>
  <div style="width:1px;background:rgba(253,251,247,0.05)"></div>
  <div style="text-align:center"><div style="font-size:10px;color:rgba(253,251,247,0.25);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">Avaliador</div><div style="font-size:17px;font-weight:600;color:rgba(253,251,247,0.6);line-height:1">${a.avaliador_nome}</div></div>
</div>

<!-- DETAILS -->
<div style="margin-bottom:48px">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px">
    <div style="width:8px;height:8px;border-radius:50%;background:#D4854A"></div>
    <span style="font-family:'Fraunces',serif;font-size:24px;color:rgba(253,251,247,0.95)">Resultado Detalhado</span>
    <div style="flex:1;height:1px;background:rgba(253,251,247,0.04)"></div>
  </div>
  ${details}
</div>

${a.observacoes ? `
<!-- OBS -->
<div style="padding:28px 32px;border-radius:18px;background:linear-gradient(135deg,rgba(139,92,246,0.02),rgba(139,92,246,0.005));border:1px solid rgba(139,92,246,0.08);border-left:3px solid rgba(139,92,246,0.4);margin-bottom:48px">
  <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8B5CF6;margin-bottom:12px;opacity:0.8">Observações do Avaliador</div>
  <p style="font-size:14px;color:rgba(253,251,247,0.6);line-height:1.85">${a.observacoes}</p>
</div>` : ''}

<!-- COMP GRID -->
<div style="margin-bottom:40px">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
    <div style="width:8px;height:8px;border-radius:50%;background:#C84B31"></div>
    <span style="font-family:'Fraunces',serif;font-size:24px;color:rgba(253,251,247,0.95)">Grade de Competências</span>
    <div style="flex:1;height:1px;background:rgba(253,251,247,0.04)"></div>
  </div>
  <p style="font-size:12px;color:rgba(253,251,247,0.22);margin-bottom:18px">Clique para explorar cada competência em detalhes.</p>
  <div class="cg" style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${cg}</div>
</div>

<!-- PBE -->
<div style="text-align:center;padding:20px 0;margin-bottom:36px;border-top:1px solid rgba(253,251,247,0.03);border-bottom:1px solid rgba(253,251,247,0.03)">
  <span style="font-size:12.5px;color:rgba(253,251,247,0.2)">Quer entender a ciência por trás? </span>
  <a href="${o}/pbe" target="_blank" style="font-size:12.5px;color:rgba(253,251,247,0.6);text-decoration:underline;text-underline-offset:3px">Conheça a história da Prática Deliberada</a>
</div>

<!-- MATERIAL -->
<div style="margin-bottom:44px">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
    <div style="width:8px;height:8px;border-radius:50%;background:#0EA5A0"></div>
    <span style="font-family:'Fraunces',serif;font-size:22px;color:rgba(253,251,247,0.95)">Material de Suporte</span>
    <div style="flex:1;height:1px;background:rgba(253,251,247,0.04)"></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    ${LINKS.map(l => `<a href="${l.u}" target="_blank" style="display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:14px;background:rgba(253,251,247,0.012);border:1px solid rgba(253,251,247,0.035);text-decoration:none">
      <div style="width:8px;height:8px;border-radius:50%;background:rgba(14,165,160,0.4);flex-shrink:0"></div>
      <span style="font-size:12px;color:rgba(253,251,247,0.45)">${l.n}</span>
    </a>`).join('')}
  </div>
</div>

<!-- RECOMENDAÇÕES -->
<div style="padding:28px 32px;border-radius:18px;background:rgba(253,251,247,0.01);border:1px solid rgba(253,251,247,0.035);margin-bottom:44px">
  <div style="font-size:15px;font-weight:700;color:rgba(253,251,247,0.75);margin-bottom:16px">Recomendamos</div>
  ${[
    { t: 'Assistir aos vídeos específicos de cada categoria', c: '#0EA5A0' },
    { t: 'Buscar supervisão focada nas áreas prioritárias', c: '#D4854A' },
    { t: 'Reagendar nova avaliação em 45–60 dias', c: '#8B5CF6' },
  ].map(r => `<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;background:${r.c}04;margin-bottom:8px"><div style="width:5px;height:5px;border-radius:50%;background:${r.c};flex-shrink:0"></div><span style="font-size:13px;color:rgba(253,251,247,0.4)">${r.t}</span></div>`).join('')}
</div>

<!-- CTA -->
<div style="text-align:center;padding:56px 24px;border-radius:22px;background:radial-gradient(ellipse at 50% 60%,rgba(200,75,49,0.045) 0%,transparent 65%);margin-bottom:44px">
  <h2 style="font-family:'Fraunces',serif;font-size:clamp(26px,4.5vw,34px);color:rgba(253,251,247,0.95);margin-bottom:10px;line-height:1.15">Intervir com <em style="color:#C84B31;font-style:italic">precisão</em></h2>
  <p style="font-size:13px;color:rgba(253,251,247,0.3);margin-bottom:28px;max-width:360px;margin-left:auto;margin-right:auto;line-height:1.7">Você pode refazer a avaliação quantas vezes quiser. Cada tentativa é uma oportunidade de crescer.</p>
  <a href="${o}/avaliallos" target="_blank" style="display:inline-block;padding:16px 40px;border-radius:999px;background:#C84B31;color:#fff;font-family:'DM Sans';font-size:15px;font-weight:700;text-decoration:none;box-shadow:0 8px 28px rgba(200,75,49,0.25)">Agendar nova avaliação →</a>
</div>

<!-- CERTIFICADO -->
<div style="text-align:center;padding:40px 24px;border-radius:22px;background:linear-gradient(135deg,rgba(14,165,160,0.03),rgba(14,165,160,0.008));border:1px solid rgba(14,165,160,0.08);margin-bottom:44px">
  <div style="width:48px;height:48px;border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;background:rgba(14,165,160,0.08);border:1px solid rgba(14,165,160,0.15)">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5A0" stroke-width="1.5" stroke-linecap="round"><path d="M12 15l-2 5l2-1l2 1l-2-5"/><circle cx="12" cy="9" r="6"/></svg>
  </div>
  <h3 style="font-family:'Fraunces',serif;font-size:20px;color:rgba(253,251,247,0.9);margin-bottom:8px">Participou da <em style="color:#0EA5A0;font-style:italic">Formação Base</em>?</h3>
  <p style="font-size:13px;color:rgba(253,251,247,0.3);margin-bottom:20px;max-width:380px;margin-left:auto;margin-right:auto;line-height:1.7">Gere seu certificado de participação e deixe seu feedback sobre a experiência.</p>
  <a href="${o}/certificado" target="_blank" style="display:inline-block;padding:14px 36px;border-radius:999px;background:linear-gradient(135deg,#0EA5A0,#1BBAB0);color:#fff;font-family:'DM Sans';font-size:14px;font-weight:700;text-decoration:none;box-shadow:0 6px 24px rgba(14,165,160,0.25)">Gerar certificado →</a>
</div>

<!-- FOOTER -->
<div style="text-align:center;padding:36px 0;border-top:1px solid rgba(253,251,247,0.03)">
  <p style="font-size:11.5px;color:rgba(253,251,247,0.15);font-style:italic;margin-bottom:8px">Acreditamos no seu potencial e esperamos vê-lo de volta em breve!</p>
  <p style="font-size:10px;color:rgba(253,251,247,0.07)">Associação Allos © ${new Date().getFullYear()}</p>
</div>

</div></body></html>`

  return html
}

export function generateReport(a: ReportData) {
  const html = buildHTML(a)
  const nm = a.avaliado_nome || a.nome_sessao
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `AvaliAllos_${(nm||'report').replace(/\s+/g, '_')}_${a.data}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateReportPDF(a: ReportData) {
  const html = buildHTML(a, true)
  const printWin = window.open('', '_blank')
  if (!printWin) return
  
  // Inject a print hint banner before the content
  const bannerHTML = html.replace('<div class="w">', `
    <div id="print-hint" style="position:fixed;top:0;left:0;right:0;z-index:999;padding:12px 20px;background:linear-gradient(135deg,#0EA5A0,#1BBAB0);color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;text-align:center;display:flex;align-items:center;justify-content:center;gap:12px">
      <span>Para salvar como PDF: <strong>Ctrl+P</strong> → Destino: <strong>Salvar como PDF</strong> → Marque <strong>"Gráficos de plano de fundo"</strong></span>
      <button onclick="this.parentElement.remove();window.print()" style="padding:6px 16px;border-radius:8px;background:#fff;color:#0C6E6A;font-weight:700;border:none;cursor:pointer;font-size:12px">Salvar PDF</button>
      <button onclick="this.parentElement.remove()" style="padding:6px 12px;border-radius:8px;background:rgba(255,255,255,0.2);color:#fff;border:none;cursor:pointer;font-size:12px">✕</button>
    </div>
    <div style="height:48px"></div>
    <div class="w">`)
  
  printWin.document.write(bannerHTML)
  printWin.document.close()
}
