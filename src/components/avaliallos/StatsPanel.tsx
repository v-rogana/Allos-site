'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Avaliacao {
  id: number; data: string; avaliador_id: string|null; avaliado_id: string|null; nome_sessao: string
  estagio_mudanca: number; estrutura_coerencia: number; encerramento_abertura: number
  acolhimento: number; seguranca_terapeuta: number; seguranca_metodo: number
  aprofundamento: number; hipoteses: number; interpretacao: number
  frase_timing: number; corpo_setting: number; insight_potencia: number
  observacoes: string|null; avaliador_nome: string; avaliado_nome: string|null
  [key: string]: unknown
}

const CRITERIOS = [
  { key: 'estagio_mudanca', label: 'Estágio de Mudança', cat: 'estrutura' },
  { key: 'estrutura_coerencia', label: 'Coerência & Consistência', cat: 'estrutura' },
  { key: 'encerramento_abertura', label: 'Abertura & Encerramento', cat: 'estrutura' },
  { key: 'acolhimento', label: 'Acolhimento', cat: 'relacao' },
  { key: 'seguranca_terapeuta', label: 'Segurança Terapeuta', cat: 'relacao' },
  { key: 'seguranca_metodo', label: 'Segurança Método', cat: 'relacao' },
  { key: 'aprofundamento', label: 'Aprofundamento', cat: 'formulacao' },
  { key: 'hipoteses', label: 'Hipóteses', cat: 'formulacao' },
  { key: 'interpretacao', label: 'Interpretação', cat: 'formulacao' },
  { key: 'frase_timing', label: 'Frase & Timing', cat: 'performance' },
  { key: 'corpo_setting', label: 'Corpo & Setting', cat: 'performance' },
  { key: 'insight_potencia', label: 'Insight & Potência', cat: 'performance' },
]

const CATS: Record<string, { c: string; l: string }> = {
  estrutura: { c: '#C84B31', l: 'Estrutura' },
  relacao: { c: '#D4854A', l: 'Relação' },
  formulacao: { c: '#B84060', l: 'Formulação' },
  performance: { c: '#8B5CF6', l: 'Performance' },
}

const SCORES = [-9, -3, -1, 1, 3, 9]
const SCORE_LABELS: Record<number, string> = {
  [-9]: 'Erros fatais', [-3]: 'Erros graves', [-1]: 'Erros pontuais',
  1: 'Adequado', 3: 'Muito bom', 9: 'Excepcional',
}

const T = '#0EA5A0', C = 'rgba(255,255,255,0.025)', B = 'rgba(255,255,255,0.07)'
const X = 'rgba(253,251,247,0.9)', X2 = 'rgba(253,251,247,0.5)', X3 = 'rgba(253,251,247,0.3)'

const sCol = (v: number) => v >= 3 ? '#0EA5A0' : v >= 1 ? '#1BBAB0' : v >= -1 ? '#D4854A' : '#C84B31'

function getTotal(a: Avaliacao) {
  return CRITERIOS.reduce((s, c) => s + ((a[c.key] as number) || 0), 0)
}

function catAvg(a: Avaliacao, cat: string) {
  const crits = CRITERIOS.filter(c => c.cat === cat)
  return crits.reduce((s, c) => s + ((a[c.key] as number) || 0), 0) / crits.length
}

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length
  if (n < 3) return 0
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, dx2 = 0, dy2 = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx, dy = ys[i] - my
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy
  }
  const den = Math.sqrt(dx2 * dy2)
  return den === 0 ? 0 : num / den
}

export default function StatsPanel({ isAdmin }: { isAdmin?: boolean }) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/avaliallos/avaliacoes').then(r => r.json()).then(d => {
      setAvaliacoes(Array.isArray(d) ? d : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    if (avaliacoes.length === 0) return null
    const n = avaliacoes.length

    // Global metrics
    const totals = avaliacoes.map(getTotal)
    const avgTotal = totals.reduce((a, b) => a + b, 0) / n
    const minTotal = Math.min(...totals)
    const maxTotal = Math.max(...totals)
    const passCount = totals.filter(t => t >= 25).length

    // Score distribution across all criteria (how often each score is given)
    const scoreDist: Record<number, number> = {}
    SCORES.forEach(s => scoreDist[s] = 0)
    avaliacoes.forEach(a => CRITERIOS.forEach(c => {
      const v = (a[c.key] as number) || 0
      if (scoreDist[v] !== undefined) scoreDist[v]++
    }))
    const totalScores = n * 12

    // Per-criterion stats
    const critStats = CRITERIOS.map(c => {
      const vals = avaliacoes.map(a => (a[c.key] as number) || 0)
      const avg = vals.reduce((a, b) => a + b, 0) / n
      const dist: Record<number, number> = {}
      SCORES.forEach(s => dist[s] = 0)
      vals.forEach(v => { if (dist[v] !== undefined) dist[v]++ })
      const mode = SCORES.reduce((a, b) => (dist[b] > dist[a] ? b : a), SCORES[0])
      return { ...c, avg, dist, mode }
    })

    // Worst (lowest avg) and best competencies
    const sorted = [...critStats].sort((a, b) => a.avg - b.avg)
    const worst3 = sorted.slice(0, 3)
    const best3 = sorted.slice(-3).reverse()

    // Category averages
    const catStats = Object.entries(CATS).map(([key, meta]) => {
      const vals = avaliacoes.map(a => catAvg(a, key))
      const avg = vals.reduce((a, b) => a + b, 0) / n
      return { key, ...meta, avg }
    })

    // Category correlations (pearson between category averages)
    const catKeys = Object.keys(CATS)
    const catCorrelations: { a: string; b: string; r: number }[] = []
    for (let i = 0; i < catKeys.length; i++) {
      for (let j = i + 1; j < catKeys.length; j++) {
        const xs = avaliacoes.map(a => catAvg(a, catKeys[i]))
        const ys = avaliacoes.map(a => catAvg(a, catKeys[j]))
        catCorrelations.push({ a: CATS[catKeys[i]].l, b: CATS[catKeys[j]].l, r: pearson(xs, ys) })
      }
    }
    catCorrelations.sort((a, b) => Math.abs(b.r) - Math.abs(a.r))

    // Evaluator comparison (bias analysis)
    const byEvaluator = new Map<string, Avaliacao[]>()
    avaliacoes.forEach(a => {
      const name = a.avaliador_nome || 'N/A'
      if (!byEvaluator.has(name)) byEvaluator.set(name, [])
      byEvaluator.get(name)!.push(a)
    })
    const evaluatorStats = Array.from(byEvaluator.entries())
      .filter(([, arr]) => arr.length >= 2)
      .map(([name, arr]) => {
        const avg = arr.map(getTotal).reduce((a, b) => a + b, 0) / arr.length
        return { name, count: arr.length, avg }
      })
      .sort((a, b) => b.avg - a.avg)

    // Per-avaliado analysis (multiple evaluations of same person)
    const byAvaliado = new Map<string, Avaliacao[]>()
    avaliacoes.forEach(a => {
      const name = a.avaliado_nome || a.nome_sessao || 'N/A'
      const key = (a.avaliado_id || name).toString()
      if (!byAvaliado.has(key)) byAvaliado.set(key, [])
      byAvaliado.get(key)!.push(a)
    })
    const avaliadoStats = Array.from(byAvaliado.entries())
      .filter(([, arr]) => arr.length >= 2)
      .map(([, arr]) => {
        const name = arr[0].avaliado_nome || arr[0].nome_sessao || 'N/A'
        const tots = arr.map(getTotal)
        const avg = tots.reduce((a, b) => a + b, 0) / tots.length
        const diff = Math.max(...tots) - Math.min(...tots)
        const evals = arr.map(a => ({ avaliador: a.avaliador_nome || 'N/A', total: getTotal(a) }))
        return { name, count: arr.length, avg, diff, evals }
      })
      .sort((a, b) => b.count - a.count)

    const uniqueAvaliados = byAvaliado.size

    // Total score distribution (histogram buckets)
    const histBuckets = [
      { label: '-108 a -50', min: -108, max: -50 },
      { label: '-49 a -25', min: -49, max: -25 },
      { label: '-24 a 0', min: -24, max: 0 },
      { label: '1 a 24', min: 1, max: 24 },
      { label: '25 a 50', min: 25, max: 50 },
      { label: '51 a 108', min: 51, max: 108 },
    ]
    const hist = histBuckets.map(b => ({
      ...b,
      count: totals.filter(t => t >= b.min && t <= b.max).length,
    }))

    return { n, avgTotal, minTotal, maxTotal, passCount, scoreDist, totalScores, critStats, worst3, best3, catStats, catCorrelations, evaluatorStats, hist, avaliadoStats, uniqueAvaliados }
  }, [avaliacoes])

  if (loading) return <div className="py-16 text-center"><div className="w-8 h-8 rounded-full border-2 border-t-transparent mx-auto animate-spin" style={{ borderColor: B, borderTopColor: 'transparent' }} /></div>
  if (!stats) return <div className="py-16 text-center font-dm text-sm" style={{ color: X3 }}>Nenhuma avaliação registrada.</div>

  const barMax = (arr: { count: number }[]) => Math.max(...arr.map(a => a.count), 1)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <span className="font-dm text-xs uppercase tracking-wider block mb-2" style={{ color: X3 }}>Total</span>
          <span className="font-fraunces text-3xl font-bold" style={{ color: X }}>{stats.n}</span>
          <span className="font-dm text-xs ml-1" style={{ color: X3 }}>avaliações</span>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <span className="font-dm text-xs uppercase tracking-wider block mb-2" style={{ color: X3 }}>Média Total</span>
          <span className="font-fraunces text-3xl font-bold" style={{ color: stats.avgTotal >= 25 ? T : stats.avgTotal >= 0 ? '#1BBAB0' : '#C84B31' }}>
            {stats.avgTotal > 0 ? '+' : ''}{stats.avgTotal.toFixed(0)}
          </span>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <span className="font-dm text-xs uppercase tracking-wider block mb-2" style={{ color: X3 }}>Aprovados</span>
          <span className="font-fraunces text-3xl font-bold" style={{ color: T }}>{stats.passCount}</span>
          <span className="font-dm text-xs ml-1" style={{ color: X3 }}>({((stats.passCount / stats.n) * 100).toFixed(0)}%)</span>
        </div>
        <div className="rounded-2xl p-5" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <span className="font-dm text-xs uppercase tracking-wider block mb-2" style={{ color: X3 }}>Avaliados</span>
          <span className="font-fraunces text-3xl font-bold" style={{ color: X }}>{stats.uniqueAvaliados}</span>
          <span className="font-dm text-xs ml-1" style={{ color: X3 }}>pessoas</span>
        </div>
      </div>

      {/* Score distribution (histogram of totals) */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
        <h3 className="font-fraunces text-lg mb-4" style={{ color: X }}>Distribuição de Pontuação Total</h3>
        <div className="space-y-2">
          {stats.hist.map(b => {
            const pct = (b.count / stats.n) * 100
            const isPass = b.min >= 25
            return (
              <div key={b.label} className="flex items-center gap-3">
                <span className="font-dm text-xs w-24 text-right" style={{ color: X3 }}>{b.label}</span>
                <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ backgroundColor: 'rgba(253,251,247,0.03)' }}>
                  <div className="h-full rounded-lg flex items-center px-2 transition-all" style={{
                    width: `${Math.max(pct, 2)}%`,
                    backgroundColor: isPass ? 'rgba(14,165,160,0.2)' : b.min >= 0 ? 'rgba(27,186,176,0.15)' : 'rgba(200,75,49,0.15)',
                  }}>
                    {b.count > 0 && <span className="font-dm text-[10px] font-bold" style={{ color: isPass ? T : b.min >= 0 ? '#1BBAB0' : '#C84B31' }}>{b.count}</span>}
                  </div>
                </div>
                <span className="font-dm text-xs w-10 text-right" style={{ color: X3 }}>{pct.toFixed(0)}%</span>
              </div>
            )
          })}
        </div>
        <div className="mt-3 pt-3 flex items-center gap-2" style={{ borderTop: `1px solid ${B}` }}>
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(14,165,160,0.3)' }} />
          <span className="font-dm text-[10px]" style={{ color: X3 }}>Nota de corte: +25</span>
        </div>
      </div>

      {/* Frequency of each score value */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
        <h3 className="font-fraunces text-lg mb-1" style={{ color: X }}>Notas Mais Atribuídas</h3>
        <p className="font-dm text-xs mb-4" style={{ color: X3 }}>Frequência de cada nota entre todas as {stats.totalScores} avaliações de critérios</p>
        <div className="grid grid-cols-6 gap-3">
          {SCORES.map(s => {
            const count = stats.scoreDist[s]
            const pct = (count / stats.totalScores) * 100
            return (
              <div key={s} className="text-center rounded-xl p-3" style={{ backgroundColor: 'rgba(253,251,247,0.015)', border: `1px solid ${B}` }}>
                <div className="font-dm text-xl font-bold mb-1" style={{ color: sCol(s) }}>{s > 0 ? '+' : ''}{s}</div>
                <div className="font-dm text-xs mb-0.5" style={{ color: X2 }}>{count}x</div>
                <div className="font-dm text-[10px]" style={{ color: X3 }}>{pct.toFixed(1)}%</div>
                <div className="font-dm text-[9px] mt-1" style={{ color: sCol(s), opacity: 0.6 }}>{SCORE_LABELS[s]}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best competencies */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <h3 className="font-fraunces text-lg mb-4" style={{ color: T }}>Melhores Competências</h3>
          {stats.best3.map((c, i) => (
            <div key={c.key} className="flex items-center gap-3 mb-3">
              <span className="font-dm text-sm font-bold w-5" style={{ color: T }}>{i + 1}</span>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATS[c.cat].c }} />
              <span className="font-dm text-sm flex-1" style={{ color: X2 }}>{c.label}</span>
              <span className="font-dm text-sm font-bold" style={{ color: T }}>{c.avg > 0 ? '+' : ''}{c.avg.toFixed(1)}</span>
              <span className="font-dm text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${sCol(c.mode)}15`, color: sCol(c.mode) }}>moda: {c.mode > 0 ? '+' : ''}{c.mode}</span>
            </div>
          ))}
        </div>

        {/* Worst competencies */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <h3 className="font-fraunces text-lg mb-4" style={{ color: '#C84B31' }}>Competências Mais Fracas</h3>
          {stats.worst3.map((c, i) => (
            <div key={c.key} className="flex items-center gap-3 mb-3">
              <span className="font-dm text-sm font-bold w-5" style={{ color: '#C84B31' }}>{i + 1}</span>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATS[c.cat].c }} />
              <span className="font-dm text-sm flex-1" style={{ color: X2 }}>{c.label}</span>
              <span className="font-dm text-sm font-bold" style={{ color: '#C84B31' }}>{c.avg > 0 ? '+' : ''}{c.avg.toFixed(1)}</span>
              <span className="font-dm text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${sCol(c.mode)}15`, color: sCol(c.mode) }}>moda: {c.mode > 0 ? '+' : ''}{c.mode}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-criterion detailed table */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
        <h3 className="font-fraunces text-lg mb-4" style={{ color: X }}>Média por Competência</h3>
        <div className="space-y-2">
          {stats.critStats.sort((a, b) => b.avg - a.avg).map(c => {
            const pct = ((c.avg + 9) / 18) * 100
            return (
              <div key={c.key} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CATS[c.cat].c }} />
                <span className="font-dm text-xs w-40 truncate" style={{ color: X2 }}>{c.label}</span>
                <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(253,251,247,0.03)' }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${Math.max(pct, 3)}%`,
                    backgroundColor: `${sCol(c.avg)}30`,
                  }} />
                </div>
                <span className="font-dm text-xs font-bold w-10 text-right" style={{ color: sCol(c.avg) }}>
                  {c.avg > 0 ? '+' : ''}{c.avg.toFixed(1)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category averages */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
        <h3 className="font-fraunces text-lg mb-4" style={{ color: X }}>Média por Categoria</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.catStats.map(c => (
            <div key={c.key} className="text-center rounded-xl p-4" style={{ backgroundColor: 'rgba(253,251,247,0.015)', border: `1px solid ${c.c}20` }}>
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: c.c }} />
              <div className="font-dm text-xs font-bold mb-1" style={{ color: c.c }}>{c.l}</div>
              <div className="font-fraunces text-2xl font-bold" style={{ color: sCol(c.avg) }}>
                {c.avg > 0 ? '+' : ''}{c.avg.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category correlations */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
        <h3 className="font-fraunces text-lg mb-1" style={{ color: X }}>Correlações entre Categorias</h3>
        <p className="font-dm text-xs mb-4" style={{ color: X3 }}>Coeficiente de Pearson: 1.0 = correlação perfeita, 0 = sem correlação, -1.0 = correlação inversa</p>
        <div className="space-y-2">
          {stats.catCorrelations.map(c => {
            const abs = Math.abs(c.r)
            const color = abs > 0.7 ? T : abs > 0.4 ? '#D4854A' : X3
            const label = abs > 0.7 ? 'Forte' : abs > 0.4 ? 'Moderada' : 'Fraca'
            return (
              <div key={`${c.a}-${c.b}`} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(253,251,247,0.015)' }}>
                <span className="font-dm text-xs flex-1" style={{ color: X2 }}>{c.a} ↔ {c.b}</span>
                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(253,251,247,0.04)' }}>
                  <div className="h-full rounded-full" style={{ width: `${abs * 100}%`, backgroundColor: `${color}60` }} />
                </div>
                <span className="font-dm text-xs font-bold w-12 text-right" style={{ color }}>{c.r.toFixed(2)}</span>
                <span className="font-dm text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Evaluator comparison */}
      {stats.evaluatorStats.length > 0 && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <h3 className="font-fraunces text-lg mb-1" style={{ color: X }}>Comparação entre Avaliadores</h3>
          <p className="font-dm text-xs mb-4" style={{ color: X3 }}>Média de pontuação total por avaliador (mín. 2 avaliações)</p>
          <div className="space-y-3">
            {stats.evaluatorStats.map(e => {
              const pct = ((e.avg + 108) / 216) * 100
              return (
                <div key={e.name} className="flex items-center gap-3">
                  <span className="font-dm text-sm w-32 truncate" style={{ color: X }}>{e.name}</span>
                  <div className="flex-1 h-5 rounded-full overflow-hidden relative" style={{ backgroundColor: 'rgba(253,251,247,0.03)' }}>
                    <div className="absolute top-0 bottom-0" style={{ left: '50%', width: '1px', backgroundColor: 'rgba(253,251,247,0.08)' }} />
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${Math.max(pct, 3)}%`,
                      backgroundColor: e.avg >= 25 ? 'rgba(14,165,160,0.25)' : e.avg >= 0 ? 'rgba(27,186,176,0.2)' : 'rgba(200,75,49,0.2)',
                    }} />
                  </div>
                  <span className="font-dm text-sm font-bold w-12 text-right" style={{ color: e.avg >= 25 ? T : e.avg >= 0 ? '#1BBAB0' : '#C84B31' }}>
                    {e.avg > 0 ? '+' : ''}{e.avg.toFixed(0)}
                  </span>
                  <span className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(253,251,247,0.04)', color: X3 }}>{e.count}x</span>
                </div>
              )
            })}
          </div>
          {(() => {
            const avgs = stats.evaluatorStats.map(e => e.avg)
            if (avgs.length < 2) return null
            const globalAvg = avgs.reduce((a, b) => a + b, 0) / avgs.length
            const maxDiff = Math.max(...avgs.map(a => Math.abs(a - globalAvg)))
            return (
              <div className="mt-4 pt-3 font-dm text-xs" style={{ borderTop: `1px solid ${B}`, color: X3 }}>
                Média geral: {globalAvg.toFixed(1)} · Maior desvio: ±{maxDiff.toFixed(1)} pontos
                {maxDiff > 20 && <span style={{ color: '#D4854A' }}> — diferença significativa entre avaliadores</span>}
              </div>
            )
          })()}
        </div>
      )}

      {/* Per-avaliado: multiple evaluations (admin only) */}
      {isAdmin && stats.avaliadoStats.length > 0 && (
        <div className="rounded-2xl p-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <h3 className="font-fraunces text-lg mb-1" style={{ color: X }}>Avaliados com Múltiplas Avaliações</h3>
          <p className="font-dm text-xs mb-4" style={{ color: X3 }}>{stats.avaliadoStats.length} pessoa(s) avaliada(s) por mais de um avaliador — útil para analisar concordância entre avaliadores</p>
          <div className="space-y-4">
            {stats.avaliadoStats.map(a => (
              <div key={a.name} className="rounded-xl p-4" style={{ backgroundColor: 'rgba(253,251,247,0.015)', border: `1px solid ${B}` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-dm text-sm font-bold" style={{ color: X }}>{a.name}</span>
                    <span className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(14,165,160,0.1)', color: T }}>{a.count}x avaliado(a)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-dm text-xs" style={{ color: X3 }}>Média:</span>
                    <span className="font-dm text-sm font-bold" style={{ color: a.avg >= 25 ? T : a.avg >= 0 ? '#1BBAB0' : '#C84B31' }}>
                      {a.avg > 0 ? '+' : ''}{a.avg.toFixed(0)}
                    </span>
                    <span className="font-dm text-xs px-2 py-0.5 rounded-full" style={{
                      backgroundColor: a.diff > 30 ? 'rgba(200,75,49,0.1)' : a.diff > 15 ? 'rgba(212,133,74,0.1)' : 'rgba(14,165,160,0.1)',
                      color: a.diff > 30 ? '#C84B31' : a.diff > 15 ? '#D4854A' : T,
                    }}>
                      {a.diff > 30 ? 'Alta' : a.diff > 15 ? 'Moderada' : 'Baixa'} discordância ({a.diff}pts)
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {a.evals.map((e, i) => (
                    <div key={i} className="font-dm text-xs px-3 py-2 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(253,251,247,0.03)', border: `1px solid ${B}` }}>
                      <span style={{ color: X2 }}>{e.avaliador}</span>
                      <span className="font-bold" style={{ color: e.total >= 25 ? T : e.total >= 0 ? '#1BBAB0' : '#C84B31' }}>
                        {e.total > 0 ? '+' : ''}{e.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {(() => {
            const avgDiff = stats.avaliadoStats.reduce((s, a) => s + a.diff, 0) / stats.avaliadoStats.length
            return (
              <div className="mt-4 pt-3 font-dm text-xs" style={{ borderTop: `1px solid ${B}`, color: X3 }}>
                Discordância média entre avaliadores: {avgDiff.toFixed(0)} pontos
                {avgDiff > 25 && <span style={{ color: '#D4854A' }}> — considere calibragem entre avaliadores</span>}
              </div>
            )
          })()}
        </div>
      )}

    </motion.div>
  )
}
