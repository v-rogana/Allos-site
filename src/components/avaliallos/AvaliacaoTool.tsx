'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateReport, generateReportPDF } from './reportGenerator'

interface AvaliadorReg { id: string; nome: string }
interface AvaliadoReg { id: string; nome_completo: string }
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
  { key: 'estagio_mudanca', label: 'Estágio de Mudança', cat: 'performance' },
  { key: 'estrutura_coerencia', label: 'Estrutura: Coerência e Consistência', cat: 'estrutura' },
  { key: 'encerramento_abertura', label: 'Encerramento | Abertura', cat: 'estrutura' },
  { key: 'acolhimento', label: 'Sensação de Acolhimento', cat: 'relacao' },
  { key: 'seguranca_terapeuta', label: 'Segurança do Terapeuta', cat: 'relacao' },
  { key: 'seguranca_metodo', label: 'Segurança do Método', cat: 'relacao' },
  { key: 'aprofundamento', label: 'Capacidade de Aprofundar', cat: 'formulacao' },
  { key: 'hipoteses', label: 'Construção de Hipóteses', cat: 'formulacao' },
  { key: 'interpretacao', label: 'Capacidade Interpretativa', cat: 'formulacao' },
  { key: 'frase_timing', label: 'Construção de Frase & Timing', cat: 'performance' },
  { key: 'corpo_setting', label: 'Corpo & Setting', cat: 'performance' },
  { key: 'insight_potencia', label: 'Insight & Potência', cat: 'performance' },
]

const CAT_COLORS: Record<string, string> = {
  estrutura: '#C84B31', relacao: '#D4854A', formulacao: '#B84060', performance: '#8B5CF6'
}
const CAT_LABELS: Record<string, string> = {
  estrutura: 'Estrutura', relacao: 'Relação', formulacao: 'Formulação', performance: 'Performance'
}

const SCORES = [-9, -3, -1, 1, 3, 9]

const SCORE_LABELS: Record<number, string> = {
  [-9]: 'Erros fatais', [-3]: 'Erros graves', [-1]: 'Erros pontuais',
  1: 'Adequado, mas básico', 3: 'Muito bom', 9: 'Excepcional',
}

const scoreColor = (v: number) => {
  if (v === 9) return { bg: 'rgba(14,165,160,0.25)', tx: '#0EA5A0' }
  if (v === 3) return { bg: 'rgba(27,186,176,0.2)', tx: '#1BBAB0' }
  if (v === 1) return { bg: 'rgba(27,186,176,0.12)', tx: '#1BBAB0' }
  if (v === -1) return { bg: 'rgba(212,133,74,0.15)', tx: '#D4854A' }
  if (v === -3) return { bg: 'rgba(200,75,49,0.15)', tx: '#C84B31' }
  if (v === -9) return { bg: 'rgba(200,75,49,0.25)', tx: '#C84B31' }
  return { bg: 'rgba(253,251,247,0.05)', tx: 'rgba(253,251,247,0.3)' }
}

const T = '#0EA5A0', C = 'rgba(255,255,255,0.025)', B = 'rgba(255,255,255,0.07)'
const X = 'rgba(253,251,247,0.9)', X2 = 'rgba(253,251,247,0.5)', X3 = 'rgba(253,251,247,0.3)'

type View = 'list' | 'create' | 'edit' | 'detail'

interface Props {
  avaliadorNome: string
}

export default function AvaliacaoTool({ avaliadorNome }: Props) {
  const [view, setView] = useState<View>('list')
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [avaliadores, setAvaliadores] = useState<AvaliadorReg[]>([])
  const [avaliados, setAvaliados] = useState<AvaliadoReg[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [selected, setSelected] = useState<Avaliacao|null>(null)

  // Form state
  const emptyForm = {
    data: new Date().toISOString().slice(0, 10),
    avaliador_id: '', avaliado_id: '', nome_sessao: '',
    estagio_mudanca: 0, estrutura_coerencia: 0, encerramento_abertura: 0,
    acolhimento: 0, seguranca_terapeuta: 0, seguranca_metodo: 0,
    aprofundamento: 0, hipoteses: 0, interpretacao: 0,
    frase_timing: 0, corpo_setting: 0, insight_potencia: 0,
    observacoes: '',
  }
  const [form, setForm] = useState(emptyForm)

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [ar, avlr, avdr] = await Promise.all([
        fetch('/api/avaliallos/avaliacoes').then(r => r.json()),
        fetch('/api/avaliallos/avaliadores').then(r => r.json()),
        fetch('/api/avaliallos/avaliados').then(r => r.json()),
      ])
      setAvaliacoes(Array.isArray(ar) ? ar : [])
      setAvaliadores(Array.isArray(avlr) ? avlr : [])
      setAvaliados(Array.isArray(avdr) ? avdr : [])
    } catch { flash('Erro ao carregar') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Find current avaliador id by name
  const myId = avaliadores.find(a => a.nome === avaliadorNome)?.id || ''

  const criar = async () => {
    if (!form.nome_sessao) return flash('Preencha o nome da sessão')
    const allFilled = CRITERIOS.every(c => (form[c.key as keyof typeof form] as number) !== 0)
    if (!allFilled) return flash('Avalie todas as competências antes de salvar')
    const avId = form.avaliador_id || myId || null
    const adId = form.avaliado_id || null
    const payload = {
      data: form.data,
      avaliador_id: avId || null,
      avaliado_id: adId || null,
      nome_sessao: form.nome_sessao,
      estagio_mudanca: form.estagio_mudanca,
      estrutura_coerencia: form.estrutura_coerencia,
      encerramento_abertura: form.encerramento_abertura,
      acolhimento: form.acolhimento,
      seguranca_terapeuta: form.seguranca_terapeuta,
      seguranca_metodo: form.seguranca_metodo,
      aprofundamento: form.aprofundamento,
      hipoteses: form.hipoteses,
      interpretacao: form.interpretacao,
      frase_timing: form.frase_timing,
      corpo_setting: form.corpo_setting,
      insight_potencia: form.insight_potencia,
      observacoes: form.observacoes || null,
    }
    try {
      const r = await fetch('/api/avaliallos/avaliacoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const d = await r.json()
      if (!r.ok) { flash(d.error || 'Erro ao criar'); return }
      flash('Avaliação criada!'); setView('list'); setForm(emptyForm); fetchAll()
    } catch (e) { console.error(e); flash('Erro ao criar') }
  }

  const salvar = async () => {
    if (!selected) return
    const allFilled = CRITERIOS.every(c => (form[c.key as keyof typeof form] as number) !== 0)
    if (!allFilled) return flash('Avalie todas as competências antes de salvar')
    const payload = {
      id: selected.id,
      data: form.data,
      avaliador_id: form.avaliador_id || null,
      avaliado_id: form.avaliado_id || null,
      nome_sessao: form.nome_sessao,
      estagio_mudanca: form.estagio_mudanca,
      estrutura_coerencia: form.estrutura_coerencia,
      encerramento_abertura: form.encerramento_abertura,
      acolhimento: form.acolhimento,
      seguranca_terapeuta: form.seguranca_terapeuta,
      seguranca_metodo: form.seguranca_metodo,
      aprofundamento: form.aprofundamento,
      hipoteses: form.hipoteses,
      interpretacao: form.interpretacao,
      frase_timing: form.frase_timing,
      corpo_setting: form.corpo_setting,
      insight_potencia: form.insight_potencia,
      observacoes: form.observacoes || null,
    }
    try {
      const r = await fetch('/api/avaliallos/avaliacoes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const d = await r.json()
      if (!r.ok) { flash(d.error || 'Erro ao salvar'); return }
      flash('Avaliação atualizada!'); setView('list'); fetchAll()
    } catch (e) { console.error(e); flash('Erro ao salvar') }
  }

  const excluir = async (id: number) => {
    if (!confirm('Excluir esta avaliação?')) return
    await fetch(`/api/avaliallos/avaliacoes?id=${id}`, { method: 'DELETE' })
    flash('Excluída'); if (view === 'detail') setView('list'); fetchAll()
  }

  const openDetail = (a: Avaliacao) => { setSelected(a); setView('detail') }
  const openEdit = (a: Avaliacao) => {
    setSelected(a)
    setForm({
      data: a.data, avaliador_id: a.avaliador_id || '', avaliado_id: a.avaliado_id || '',
      nome_sessao: a.nome_sessao,
      estagio_mudanca: a.estagio_mudanca, estrutura_coerencia: a.estrutura_coerencia,
      encerramento_abertura: a.encerramento_abertura, acolhimento: a.acolhimento,
      seguranca_terapeuta: a.seguranca_terapeuta, seguranca_metodo: a.seguranca_metodo,
      aprofundamento: a.aprofundamento, hipoteses: a.hipoteses, interpretacao: a.interpretacao,
      frase_timing: a.frase_timing, corpo_setting: a.corpo_setting, insight_potencia: a.insight_potencia,
      observacoes: a.observacoes || '',
    })
    setView('edit')
  }
  const openCreate = () => { setForm({ ...emptyForm, avaliador_id: myId }); setView('create') }


  const fmtDate = (s: string) => new Date(s + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const setScore = (key: string, val: number) => setForm(f => ({ ...f, [key]: val }))

  // Group criterios by category
  const critByCategory = CRITERIOS.reduce<Record<string, typeof CRITERIOS>>((acc, c) => {
    if (!acc[c.cat]) acc[c.cat] = []; acc[c.cat].push(c); return acc
  }, {})

  const inp = { backgroundColor: 'rgba(253,251,247,0.04)', border: `1.5px solid ${B}`, color: X, borderRadius: '12px', colorScheme: 'dark' as const }

  // ===== FORM (shared between create and edit) =====
  const renderForm = () => (
    <div className="space-y-6">
      {/* Header fields */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-dm text-xs font-medium block mb-1.5" style={{ color: X3 }}>Data</label>
            <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={inp} />
          </div>
          <div>
            <label className="font-dm text-xs font-medium block mb-1.5" style={{ color: X3 }}>Selecione o Terapeuta Avaliador</label>
            <select value={form.avaliador_id} onChange={e => setForm({ ...form, avaliador_id: e.target.value })} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ ...inp, backgroundColor: '#1A1A1A' }}>
              <option value="" style={{ backgroundColor: '#1A1A1A' }}>— Selecione —</option>
              {avaliadores.map(a => <option key={a.id} value={a.id} style={{ backgroundColor: '#1A1A1A' }}>{a.nome}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-dm text-xs font-medium block mb-1.5" style={{ color: X3 }}>Selecione o Associado Avaliado (se aplicável)</label>
            <select value={form.avaliado_id} onChange={e => setForm({ ...form, avaliado_id: e.target.value })} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ ...inp, backgroundColor: '#1A1A1A' }}>
              <option value="" style={{ backgroundColor: '#1A1A1A' }}>— Candidato externo —</option>
              {avaliados.map(a => <option key={a.id} value={a.id} style={{ backgroundColor: '#1A1A1A' }}>{a.nome_completo}</option>)}
            </select>
          </div>
          <div>
            <label className="font-dm text-xs font-medium block mb-1.5" style={{ color: X3 }}>Nome (Candidato Externo)</label>
            <input type="text" value={form.nome_sessao} onChange={e => setForm({ ...form, nome_sessao: e.target.value })} placeholder="Nome do avaliado" className="font-dm text-sm w-full px-4 py-3 rounded-xl placeholder:text-white/20" style={inp} />
          </div>
        </div>
      </div>

      {/* Critérios por categoria */}
      <div>
        <h3 className="font-fraunces text-lg mb-4" style={{ color: X }}>Critérios de Avaliação</h3>
        <div className="space-y-6">
          {Object.entries(critByCategory).map(([cat, crits]) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CAT_COLORS[cat] }} />
                <span className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color: CAT_COLORS[cat] }}>{CAT_LABELS[cat]}</span>
                <div className="flex-1 h-px" style={{ backgroundColor: B }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {crits.map(c => {
                  const val = form[c.key as keyof typeof form] as number
                  return (
                    <div key={c.key} className="rounded-xl p-4" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
                      <label className="font-dm text-xs font-medium block mb-3" style={{ color: X2 }}>{c.label}</label>
                      <div className="flex gap-2">
                        {SCORES.map(s => {
                          const active = val === s
                          const sc = scoreColor(s)
                          return (
                            <button key={s} type="button" onClick={() => setScore(c.key, s)}
                              className="font-dm text-sm font-bold flex-1 py-2.5 rounded-lg transition-all duration-200"
                              style={{
                                backgroundColor: active ? sc.bg : 'rgba(253,251,247,0.02)',
                                color: active ? sc.tx : X3,
                                border: `1.5px solid ${active ? sc.tx + '40' : 'rgba(253,251,247,0.06)'}`,
                                boxShadow: active ? `0 0 12px ${sc.tx}15` : 'none',
                              }}>
                              {s > 0 ? `+${s}` : s}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="font-dm text-xs font-medium block mb-2" style={{ color: X3 }}>Observações</label>
        <textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} rows={4} placeholder="Observações gerais sobre a avaliação..." className="font-dm text-sm w-full px-4 py-3 rounded-xl resize-none placeholder:text-white/20" style={inp} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={view === 'create' ? criar : salvar}
          className="font-dm text-sm px-6 py-3 rounded-xl text-white font-bold transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
          style={{ backgroundColor: T, boxShadow: `0 4px 14px ${T}30` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
          {view === 'create' ? 'Criar avaliação' : 'Salvar alterações'}
        </button>
        <button onClick={() => setView('list')} className="font-dm text-sm px-6 py-3 rounded-xl font-medium" style={{ color: X3, backgroundColor: C, border: `1.5px solid ${B}` }}>
          Cancelar
        </button>
      </div>
    </div>
  )

  // ===== VIEWS =====
  if (loading) {
    return <div className="py-16 text-center"><div className="w-8 h-8 rounded-full border-2 border-t-transparent mx-auto animate-spin" style={{ borderColor: B, borderTopColor: 'transparent' }} /></div>
  }

  // DETAIL VIEW
  if (view === 'detail' && selected) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="font-fraunces text-xl" style={{ color: X }}>Avaliação #{selected.id}</h2>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => openEdit(selected)} className="font-dm text-xs px-3 py-2 rounded-xl font-medium inline-flex items-center gap-1.5" style={{ backgroundColor: 'rgba(14,165,160,0.1)', color: T }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Editar
              </button>
              <button onClick={() => excluir(selected.id)} className="font-dm text-xs px-3 py-2 rounded-xl font-medium inline-flex items-center gap-1.5" style={{ backgroundColor: 'rgba(200,75,49,0.08)', color: '#C84B31' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Excluir
              </button>
              <button onClick={() => setView('list')} className="font-dm text-xs px-3 py-2 rounded-xl font-medium inline-flex items-center gap-1.5" style={{ backgroundColor: C, color: X3, border: `1px solid ${B}` }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Voltar
              </button>
              <button onClick={() => generateReport(selected)} className="font-dm text-xs px-3 py-2 rounded-xl font-medium inline-flex items-center gap-1.5" style={{ backgroundColor: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>HTML
              </button>
              <button onClick={() => generateReportPDF(selected)} className="font-dm text-xs px-3 py-2 rounded-xl font-medium inline-flex items-center gap-1.5" style={{ backgroundColor: 'rgba(200,75,49,0.08)', color: '#C84B31' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>PDF
              </button>
            </div>
          </div>

          {/* Info row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <span className="font-dm text-xs block mb-1" style={{ color: X3 }}>Avaliador</span>
              <span className="font-dm text-sm font-bold" style={{ color: X }}>{selected.avaliador_nome}</span>
            </div>
            <div>
              <span className="font-dm text-xs block mb-1" style={{ color: X3 }}>Avaliado</span>
              <span className="font-dm text-sm font-bold" style={{ color: X }}>{selected.avaliado_nome || 'N/A'}</span>
            </div>
            <div>
              <span className="font-dm text-xs block mb-1" style={{ color: X3 }}>Nome/Sessão</span>
              <span className="font-dm text-sm font-bold" style={{ color: X }}>{selected.nome_sessao}</span>
            </div>
          </div>
        </div>

        {/* Scores */}
        <h3 className="font-fraunces text-lg mb-4" style={{ color: X }}>Notas dos Critérios</h3>
        <div className="space-y-6 mb-6">
          {Object.entries(critByCategory).map(([cat, crits]) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CAT_COLORS[cat] }} />
                <span className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color: CAT_COLORS[cat] }}>{CAT_LABELS[cat]}</span>
                <div className="flex-1 h-px" style={{ backgroundColor: B }} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {crits.map(c => {
                  const val = selected[c.key as keyof Avaliacao] as number
                  const sc = scoreColor(val)
                  return (
                    <div key={c.key} className="rounded-xl p-4" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
                      <span className="font-dm text-xs block mb-2" style={{ color: X2 }}>{c.label}</span>
                      <span className="font-dm text-lg font-bold inline-block px-3 py-1 rounded-lg" style={{ backgroundColor: sc.bg, color: sc.tx }}>
                        {val > 0 ? `+${val}` : val}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Observações */}
        {selected.observacoes && (
          <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
            <span className="font-dm text-xs font-medium block mb-2" style={{ color: X3 }}>Observações</span>
            <p className="font-dm text-sm leading-relaxed" style={{ color: X2 }}>{selected.observacoes}</p>
          </div>
        )}
      </motion.div>
    )
  }

  // CREATE / EDIT VIEW
  if (view === 'create' || view === 'edit') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: C, border: `1px solid ${B}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={X3} strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="font-fraunces text-2xl" style={{ color: X }}>
            {view === 'create' ? 'Nova Avaliação' : 'Editar Avaliação'}
          </h2>
        </div>
        {renderForm()}
      </motion.div>
    )
  }

  // LIST VIEW
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fraunces text-2xl" style={{ color: X }}>Avaliações de Seleção</h2>
        <button onClick={openCreate}
          className="font-dm text-sm px-5 py-3 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
          style={{ backgroundColor: T, boxShadow: `0 4px 14px ${T}30` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Nova Avaliação
        </button>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="py-16 text-center rounded-3xl" style={{ border: `1.5px dashed ${B}` }}>
          <svg className="mx-auto mb-4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={X3} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          <p className="font-dm text-sm" style={{ color: X3 }}>Nenhuma avaliação registrada.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${B}` }}>
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3" style={{ backgroundColor: 'rgba(253,251,247,0.04)' }}>
            <span className="col-span-2 font-dm text-xs font-bold" style={{ color: X3 }}>Data</span>
            <span className="col-span-3 font-dm text-xs font-bold" style={{ color: X3 }}>Avaliador</span>
            <span className="col-span-2 font-dm text-xs font-bold" style={{ color: X3 }}>Avaliado</span>
            <span className="col-span-3 font-dm text-xs font-bold" style={{ color: X3 }}>Nome/Sessão</span>
            <span className="col-span-2 font-dm text-xs font-bold text-right" style={{ color: X3 }}>Ações</span>
          </div>

          {/* Rows */}
          {avaliacoes.map((a, i) => (
            <div key={a.id} className="grid grid-cols-12 gap-2 px-5 py-4 items-center transition-all hover:bg-white/[0.02]" style={{ borderTop: `1px solid ${B}` }}>
              <span className="col-span-2 font-dm text-sm" style={{ color: X2 }}>{fmtDate(a.data)}</span>
              <span className="col-span-3 font-dm text-sm" style={{ color: X }}>{a.avaliador_nome}</span>
              <span className="col-span-2 font-dm text-sm" style={{ color: X2 }}>{a.avaliado_nome || 'N/A'}</span>
              <span className="col-span-3 font-dm text-sm font-medium" style={{ color: X }}>{a.nome_sessao}</span>
              <div className="col-span-2 flex gap-1.5 justify-end">
                <button onClick={() => openDetail(a)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5" style={{ backgroundColor: 'rgba(14,165,160,0.12)' }} title="Ver detalhes">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button onClick={() => openEdit(a)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5" style={{ backgroundColor: 'rgba(212,133,74,0.12)' }} title="Editar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4854A" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => excluir(a.id)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5" style={{ backgroundColor: 'rgba(200,75,49,0.12)' }} title="Excluir">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
                <button onClick={() => generateReport(a)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5" style={{ backgroundColor: 'rgba(139,92,246,0.12)' }} title="HTML">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </button>
                <button onClick={() => generateReportPDF(a)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:-translate-y-0.5" style={{ backgroundColor: 'rgba(200,75,49,0.1)' }} title="PDF">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 font-dm text-sm px-5 py-3 rounded-2xl shadow-xl z-50 font-medium" style={{ backgroundColor: 'rgba(253,251,247,0.95)', color: '#1A1A1A' }}>{toast}</motion.div>}
      </AnimatePresence>
    </motion.div>
  )
}
