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
  observacoes: string|null; telefone: string|null; avaliador_nome: string; avaliado_nome: string|null
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
  onDataChange?: () => void
}

export default function AvaliacaoTool({ avaliadorNome, onDataChange }: Props) {
  const [view, setView] = useState<View>('list')
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [avaliadores, setAvaliadores] = useState<AvaliadorReg[]>([])
  const [avaliados, setAvaliados] = useState<AvaliadoReg[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [selected, setSelected] = useState<Avaliacao|null>(null)

  // Filters
  const [busca, setBusca] = useState('')
  const [filtroAvaliador, setFiltroAvaliador] = useState('')
  const [filtroAvaliado, setFiltroAvaliado] = useState('')

  // Name editing
  const [editingName, setEditingName] = useState<{ type: 'avaliador' | 'avaliado'; id: string; nome: string } | null>(null)
  const [editNameVal, setEditNameVal] = useState('')
  // Merge avaliadores
  const [mergeSource, setMergeSource] = useState('')
  const [mergeTarget, setMergeTarget] = useState('')
  const [showMerge, setShowMerge] = useState(false)

  // Form state
  const emptyForm = {
    data: new Date().toISOString().slice(0, 10),
    avaliador_id: '', avaliado_id: '', nome_sessao: '',
    estagio_mudanca: 0, estrutura_coerencia: 0, encerramento_abertura: 0,
    acolhimento: 0, seguranca_terapeuta: 0, seguranca_metodo: 0,
    aprofundamento: 0, hipoteses: 0, interpretacao: 0,
    frase_timing: 0, corpo_setting: 0, insight_potencia: 0,
    observacoes: '', telefone: '',
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
      telefone: form.telefone || null,
    }
    try {
      const r = await fetch('/api/avaliallos/avaliacoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const d = await r.json()
      if (!r.ok) { flash(d.error || 'Erro ao criar'); return }
      flash('Avaliação criada!'); setView('list'); setForm(emptyForm); fetchAll(); onDataChange?.()
    } catch { flash('Erro ao criar') }
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
      telefone: form.telefone || null,
    }
    try {
      const r = await fetch('/api/avaliallos/avaliacoes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const d = await r.json()
      if (!r.ok) { flash(d.error || 'Erro ao salvar'); return }
      flash('Avaliação atualizada!'); setView('list'); fetchAll(); onDataChange?.()
    } catch { flash('Erro ao salvar') }
  }

  const excluir = async (id: number) => {
    if (!confirm('Excluir esta avaliação?')) return
    await fetch(`/api/avaliallos/avaliacoes?id=${id}`, { method: 'DELETE' })
    flash('Excluída'); if (view === 'detail') setView('list'); fetchAll(); onDataChange?.()
  }

  const editName = async () => {
    if (!editingName || !editNameVal.trim()) return
    const endpoint = editingName.type === 'avaliador' ? '/api/avaliallos/avaliadores' : '/api/avaliallos/avaliados'
    const payload = editingName.type === 'avaliador'
      ? { id: editingName.id, nome: editNameVal.trim() }
      : { id: editingName.id, nome_completo: editNameVal.trim() }
    const r = await fetch(endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (r.ok) { flash('Nome atualizado!'); setEditingName(null); fetchAll(); onDataChange?.() }
    else flash('Erro ao atualizar')
  }

  const deleteName = async (type: 'avaliador' | 'avaliado', id: string, nome: string) => {
    if (!confirm(`Excluir ${type === 'avaliador' ? 'avaliador' : 'avaliado'} "${nome}"? Isso pode afetar avaliações associadas.`)) return
    const endpoint = type === 'avaliador' ? `/api/avaliallos/avaliadores?id=${id}` : `/api/avaliallos/avaliados?id=${id}`
    await fetch(endpoint, { method: 'DELETE' })
    flash('Excluído!'); fetchAll(); onDataChange?.()
  }

  const mergeAvaliadores = async () => {
    if (!mergeSource || !mergeTarget || mergeSource === mergeTarget) return flash('Selecione dois avaliadores diferentes')
    const sourceName = avaliadores.find(a => a.id === mergeSource)?.nome
    const targetName = avaliadores.find(a => a.id === mergeTarget)?.nome
    if (!confirm(`Unificar "${sourceName}" → "${targetName}"?\nTodas as avaliações de "${sourceName}" serão atribuídas a "${targetName}" e "${sourceName}" será excluído.`)) return
    const r = await fetch('/api/avaliallos/avaliadores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'merge', source_id: mergeSource, target_id: mergeTarget }) })
    const d = await r.json()
    if (d.success) { flash(`Unificado! ${d.merged_avaliacoes} avaliações transferidas`); setMergeSource(''); setMergeTarget(''); setShowMerge(false); fetchAll(); onDataChange?.() }
    else flash(d.error || 'Erro')
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
      observacoes: a.observacoes || '', telefone: a.telefone || '',
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

  const computeTotal = (f: typeof form) => CRITERIOS.reduce((s, c) => s + (f[c.key as keyof typeof f] as number), 0)
  const filledCount = CRITERIOS.filter(c => (form[c.key as keyof typeof form] as number) !== 0).length
  const formTotal = computeTotal(form)

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
        <div className="mt-4">
          <label className="font-dm text-xs font-medium block mb-1.5" style={{ color: X3 }}>Telefone <span style={{ opacity: 0.5 }}>(opcional)</span></label>
          <input type="tel" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="(31) 99999-9999" className="font-dm text-sm w-full sm:w-1/2 px-4 py-3 rounded-xl placeholder:text-white/20" style={inp} />
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

      {/* Live Score */}
      {filledCount > 0 && (
        <div className="rounded-2xl p-5" style={{ backgroundColor: C, border: `1.5px solid ${B}` }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color: X3 }}>Nota Total</span>
            <span className="font-dm text-xs" style={{ color: X3 }}>{filledCount}/12 critérios preenchidos</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-fraunces text-4xl font-bold" style={{ color: formTotal >= 25 ? T : formTotal >= 0 ? '#1BBAB0' : '#C84B31' }}>
              {formTotal > 0 ? '+' : ''}{formTotal}
            </span>
            <div className="flex-1">
              <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(253,251,247,0.04)' }}>
                <div className="h-full rounded-full transition-all duration-300" style={{
                  width: `${((formTotal + 108) / 216) * 100}%`,
                  backgroundColor: formTotal >= 25 ? T : formTotal >= 0 ? '#1BBAB0' : '#C84B31',
                  opacity: 0.6,
                }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-dm text-[9px]" style={{ color: 'rgba(253,251,247,0.15)' }}>-108</span>
                <span className="font-dm text-[9px]" style={{ color: 'rgba(253,251,247,0.15)' }}>0</span>
                <span className="font-dm text-[9px]" style={{ color: 'rgba(14,165,160,0.3)' }}>+25</span>
                <span className="font-dm text-[9px]" style={{ color: 'rgba(253,251,247,0.15)' }}>+108</span>
              </div>
            </div>
          </div>
          {filledCount === 12 && (
            <div className="mt-3 px-3 py-2 rounded-lg" style={{
              backgroundColor: formTotal >= 25 ? 'rgba(14,165,160,0.08)' : formTotal >= 0 ? 'rgba(27,186,176,0.06)' : 'rgba(200,75,49,0.08)',
              border: `1px solid ${formTotal >= 25 ? 'rgba(14,165,160,0.15)' : formTotal >= 0 ? 'rgba(27,186,176,0.1)' : 'rgba(200,75,49,0.15)'}`,
            }}>
              <span className="font-dm text-xs" style={{ color: formTotal >= 25 ? T : formTotal >= 0 ? '#1BBAB0' : '#C84B31' }}>
                {formTotal >= 25 ? 'Acima da nota de corte (+25)' : formTotal >= 0 ? 'Abaixo da nota de corte (+25), mas positivo' : 'Pontuação negativa'}
                {' · '}Média: {(formTotal / 12).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      )}

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            {selected.telefone && (
              <div>
                <span className="font-dm text-xs block mb-1" style={{ color: X3 }}>Telefone</span>
                <span className="font-dm text-sm font-bold" style={{ color: X }}>{selected.telefone}</span>
              </div>
            )}
          </div>

          {/* Total score */}
          {(() => {
            const tot = CRITERIOS.reduce((s, c) => s + ((selected[c.key as keyof Avaliacao] as number) || 0), 0)
            const avg = (tot / 12).toFixed(1)
            return (
              <div className="mt-4 flex items-center gap-4 px-4 py-3 rounded-xl" style={{
                backgroundColor: tot >= 25 ? 'rgba(14,165,160,0.06)' : tot >= 0 ? 'rgba(27,186,176,0.04)' : 'rgba(200,75,49,0.06)',
                border: `1px solid ${tot >= 25 ? 'rgba(14,165,160,0.15)' : tot >= 0 ? 'rgba(27,186,176,0.1)' : 'rgba(200,75,49,0.15)'}`,
              }}>
                <span className="font-fraunces text-2xl font-bold" style={{ color: tot >= 25 ? T : tot >= 0 ? '#1BBAB0' : '#C84B31' }}>
                  {tot > 0 ? '+' : ''}{tot}
                </span>
                <div className="font-dm text-xs" style={{ color: X3 }}>
                  Pontuação total · Média {avg} · {tot >= 25 ? 'Acima do corte' : tot >= 0 ? 'Abaixo do corte' : 'Negativo'}
                </div>
              </div>
            )
          })()}
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

  // Filtered avaliacoes
  const filteredAvaliacoes = avaliacoes.filter(a => {
    if (filtroAvaliador && a.avaliador_id !== filtroAvaliador) return false
    if (filtroAvaliado && a.avaliado_id !== filtroAvaliado) return false
    if (busca) {
      const q = busca.toLowerCase()
      const match = (a.avaliador_nome || '').toLowerCase().includes(q) ||
        (a.avaliado_nome || '').toLowerCase().includes(q) ||
        (a.nome_sessao || '').toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })

  // Unique avaliadores/avaliados in current data for filters
  const usedAvaliadores = Array.from(new Map(avaliacoes.filter(a => a.avaliador_id).map(a => [a.avaliador_id, a.avaliador_nome])).entries()).sort((a, b) => a[1].localeCompare(b[1]))
  const usedAvaliados = Array.from(new Map(avaliacoes.filter(a => a.avaliado_id && a.avaliado_nome).map(a => [a.avaliado_id!, a.avaliado_nome!])).entries()).sort((a, b) => a[1].localeCompare(b[1]))

  // LIST VIEW
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-fraunces text-2xl" style={{ color: X }}>Avaliações de Seleção</h2>
        <button onClick={openCreate}
          className="font-dm text-sm px-5 py-3 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
          style={{ backgroundColor: T, boxShadow: `0 4px 14px ${T}30` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Nova Avaliação
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(253,251,247,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome de avaliador, avaliado ou sessão..." className="font-dm w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all placeholder:text-white/20" style={{ backgroundColor: C, border: `1.5px solid ${B}`, color: X }} onFocus={e => { e.target.style.borderColor = 'rgba(14,165,160,0.4)' }} onBlur={e => { e.target.style.borderColor = B }} />
          {busca && <button onClick={() => setBusca('')} className="absolute right-4 top-1/2 -translate-y-1/2 font-dm text-xs" style={{ color: X3 }}>✕</button>}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[180px]">
            <select value={filtroAvaliador} onChange={e => setFiltroAvaliador(e.target.value)} className="font-dm text-sm w-full px-4 py-2.5 rounded-xl" style={{ backgroundColor: '#1A1A1A', border: `1.5px solid ${B}`, color: filtroAvaliador ? X : X3, colorScheme: 'dark' }}>
              <option value="" style={{ backgroundColor: '#1A1A1A' }}>Todos os avaliadores</option>
              {usedAvaliadores.map(([id, nome]) => <option key={id} value={id!} style={{ backgroundColor: '#1A1A1A' }}>{nome}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <select value={filtroAvaliado} onChange={e => setFiltroAvaliado(e.target.value)} className="font-dm text-sm w-full px-4 py-2.5 rounded-xl" style={{ backgroundColor: '#1A1A1A', border: `1.5px solid ${B}`, color: filtroAvaliado ? X : X3, colorScheme: 'dark' }}>
              <option value="" style={{ backgroundColor: '#1A1A1A' }}>Todos os avaliados</option>
              {usedAvaliados.map(([id, nome]) => <option key={id} value={id!} style={{ backgroundColor: '#1A1A1A' }}>{nome}</option>)}
            </select>
          </div>
          <button onClick={() => setShowMerge(!showMerge)} className="font-dm text-xs px-3 py-2.5 rounded-xl font-medium inline-flex items-center gap-1.5 transition-all" style={{ backgroundColor: showMerge ? 'rgba(139,92,246,0.15)' : C, color: showMerge ? '#8B5CF6' : X3, border: `1px solid ${showMerge ? 'rgba(139,92,246,0.3)' : B}` }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3v12"/><path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
            Gerenciar nomes
          </button>
          {(busca || filtroAvaliador || filtroAvaliado) && (
            <button onClick={() => { setBusca(''); setFiltroAvaliador(''); setFiltroAvaliado('') }} className="font-dm text-xs px-3 py-2.5 rounded-xl" style={{ color: '#C84B31' }}>Limpar filtros</button>
          )}
        </div>

        <p className="font-dm text-xs" style={{ color: X3 }}>{filteredAvaliacoes.length} de {avaliacoes.length} avaliações</p>
      </div>

      {/* Merge / Name management panel */}
      <AnimatePresence>{showMerge && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
          <div className="rounded-2xl p-5 space-y-5" style={{ backgroundColor: C, border: `1.5px solid rgba(139,92,246,0.2)` }}>

            {/* Merge avaliadores */}
            <div>
              <h4 className="font-dm text-sm font-bold mb-3" style={{ color: '#8B5CF6' }}>Unificar avaliadores</h4>
              <p className="font-dm text-xs mb-3" style={{ color: X3 }}>Selecione o duplicado e o destino. Todas as avaliações serão transferidas e o duplicado será excluído.</p>
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="font-dm text-xs block mb-1" style={{ color: X3 }}>Duplicado (será excluído)</label>
                  <select value={mergeSource} onChange={e => setMergeSource(e.target.value)} className="font-dm text-sm w-full px-4 py-2.5 rounded-xl" style={{ backgroundColor: '#1A1A1A', border: `1.5px solid ${B}`, color: X, colorScheme: 'dark' }}>
                    <option value="" style={{ backgroundColor: '#1A1A1A' }}>Selecione...</option>
                    {avaliadores.map(a => <option key={a.id} value={a.id} style={{ backgroundColor: '#1A1A1A' }}>{a.nome}</option>)}
                  </select>
                </div>
                <span className="font-dm text-sm py-2.5" style={{ color: X3 }}>→</span>
                <div className="flex-1 min-w-[180px]">
                  <label className="font-dm text-xs block mb-1" style={{ color: X3 }}>Destino (será mantido)</label>
                  <select value={mergeTarget} onChange={e => setMergeTarget(e.target.value)} className="font-dm text-sm w-full px-4 py-2.5 rounded-xl" style={{ backgroundColor: '#1A1A1A', border: `1.5px solid ${B}`, color: X, colorScheme: 'dark' }}>
                    <option value="" style={{ backgroundColor: '#1A1A1A' }}>Selecione...</option>
                    {avaliadores.filter(a => a.id !== mergeSource).map(a => <option key={a.id} value={a.id} style={{ backgroundColor: '#1A1A1A' }}>{a.nome}</option>)}
                  </select>
                </div>
                <button onClick={mergeAvaliadores} className="font-dm text-xs px-4 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: '#8B5CF6' }}>Unificar</button>
              </div>
            </div>

            <div className="h-px" style={{ backgroundColor: B }} />

            {/* Avaliadores list */}
            <div>
              <h4 className="font-dm text-sm font-bold mb-3" style={{ color: T }}>Avaliadores ({avaliadores.length})</h4>
              <div className="flex flex-wrap gap-2">
                {avaliadores.map(a => (
                  <div key={a.id} className="font-dm text-xs px-3 py-2 rounded-xl inline-flex items-center gap-2" style={{ backgroundColor: 'rgba(14,165,160,0.06)', border: `1px solid rgba(14,165,160,0.15)` }}>
                    <span style={{ color: X }}>{a.nome}</span>
                    <button onClick={() => { setEditingName({ type: 'avaliador', id: a.id, nome: a.nome }); setEditNameVal(a.nome) }} className="opacity-50 hover:opacity-100" style={{ color: T }} title="Editar nome">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => deleteName('avaliador', a.id, a.nome)} className="opacity-50 hover:opacity-100" style={{ color: '#C84B31' }} title="Excluir">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px" style={{ backgroundColor: B }} />

            {/* Avaliados list */}
            <div>
              <h4 className="font-dm text-sm font-bold mb-3" style={{ color: '#D4854A' }}>Avaliados ({avaliados.length})</h4>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {avaliados.map(a => (
                  <div key={a.id} className="font-dm text-xs px-3 py-2 rounded-xl inline-flex items-center gap-2" style={{ backgroundColor: 'rgba(212,133,74,0.06)', border: `1px solid rgba(212,133,74,0.15)` }}>
                    <span style={{ color: X }}>{a.nome_completo}</span>
                    <button onClick={() => { setEditingName({ type: 'avaliado', id: a.id, nome: a.nome_completo }); setEditNameVal(a.nome_completo) }} className="opacity-50 hover:opacity-100" style={{ color: '#D4854A' }} title="Editar nome">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => deleteName('avaliado', a.id, a.nome_completo)} className="opacity-50 hover:opacity-100" style={{ color: '#C84B31' }} title="Excluir">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* Edit name modal */}
      <AnimatePresence>{editingName && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50 p-5" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setEditingName(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="rounded-2xl p-6 max-w-sm w-full" style={{ backgroundColor: '#1A1A1A', border: `1.5px solid ${B}` }}>
            <h3 className="font-fraunces text-lg mb-1" style={{ color: X }}>Editar nome</h3>
            <p className="font-dm text-xs mb-4" style={{ color: X3 }}>
              {editingName.type === 'avaliador' ? 'Avaliador' : 'Avaliado'}: &ldquo;{editingName.nome}&rdquo;
            </p>
            <input type="text" value={editNameVal} onChange={e => setEditNameVal(e.target.value)} className="font-dm text-sm w-full px-4 py-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(253,251,247,0.04)', border: `1.5px solid ${B}`, color: X }} autoFocus onKeyDown={e => e.key === 'Enter' && editName()} />
            <div className="flex gap-3">
              <button onClick={editName} className="font-dm text-sm px-5 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: T }}>Salvar</button>
              <button onClick={() => setEditingName(null)} className="font-dm text-sm px-5 py-2.5 rounded-xl" style={{ color: X3 }}>Cancelar</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {filteredAvaliacoes.length === 0 ? (
        <div className="py-16 text-center rounded-3xl" style={{ border: `1.5px dashed ${B}` }}>
          <svg className="mx-auto mb-4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={X3} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          <p className="font-dm text-sm" style={{ color: X3 }}>{avaliacoes.length > 0 ? 'Nenhuma avaliação corresponde aos filtros.' : 'Nenhuma avaliação registrada.'}</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${B}` }}>
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3" style={{ backgroundColor: 'rgba(253,251,247,0.04)' }}>
            <span className="col-span-2 font-dm text-xs font-bold" style={{ color: X3 }}>Data</span>
            <span className="col-span-2 font-dm text-xs font-bold" style={{ color: X3 }}>Avaliador</span>
            <span className="col-span-2 font-dm text-xs font-bold" style={{ color: X3 }}>Avaliado</span>
            <span className="col-span-2 font-dm text-xs font-bold" style={{ color: X3 }}>Nome/Sessão</span>
            <span className="col-span-1 font-dm text-xs font-bold text-center" style={{ color: X3 }}>Nota</span>
            <span className="col-span-3 font-dm text-xs font-bold text-right" style={{ color: X3 }}>Ações</span>
          </div>

          {/* Rows */}
          {filteredAvaliacoes.map((a) => {
            const tot = CRITERIOS.reduce((s, c) => s + ((a[c.key as keyof Avaliacao] as number) || 0), 0)
            return (
            <div key={a.id} className="grid grid-cols-12 gap-2 px-5 py-4 items-center transition-all hover:bg-white/[0.02]" style={{ borderTop: `1px solid ${B}` }}>
              <span className="col-span-2 font-dm text-sm" style={{ color: X2 }}>{fmtDate(a.data)}</span>
              <span className="col-span-2 font-dm text-sm" style={{ color: X }}>{a.avaliador_nome}</span>
              <span className="col-span-2 font-dm text-sm" style={{ color: X2 }}>{a.avaliado_nome || 'N/A'}</span>
              <span className="col-span-2 font-dm text-sm font-medium" style={{ color: X }}>{a.nome_sessao}</span>
              <span className="col-span-1 font-dm text-sm font-bold text-center" style={{ color: tot >= 25 ? T : tot >= 0 ? '#1BBAB0' : '#C84B31' }}>{tot > 0 ? '+' : ''}{tot}</span>
              <div className="col-span-3 flex gap-1.5 justify-end">
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
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 font-dm text-sm px-5 py-3 rounded-2xl shadow-xl z-50 font-medium" style={{ backgroundColor: 'rgba(253,251,247,0.95)', color: '#1A1A1A' }}>{toast}</motion.div>}
      </AnimatePresence>
    </motion.div>
  )
}
