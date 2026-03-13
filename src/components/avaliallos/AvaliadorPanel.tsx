'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AvaliacaoTool from './AvaliacaoTool'
import RascunhoTool from './RascunhoTool'
import QuadroSemanal from './QuadroSemanal'
import DiretrizesPanel from './DiretrizesPanel'
import AtmosphericBg from './AtmosphericBg'
import StatsPanel from './StatsPanel'

interface Avaliador { id: string; nome: string }
interface DispFixo { id: string; avaliador_id: string; avaliadores: Avaliador }
interface DispAvulso { id: string; avaliador_id: string; avaliadores: Avaliador }
interface SlotFixo { id: string; dia_semana: string; hora: string; ativo: boolean; avaliador_disp_fixo: DispFixo[] }
interface BkInfo { id: string; avaliado_id: string; avaliados: { nome_completo: string } }
interface SlotAvulso { id: string; data: string; hora: string; ativo: boolean; max_avaliadores: number; avaliador_disponibilidade: DispAvulso[]; bookings: BkInfo[] }

const DIAS: Record<string, string> = { segunda: 'Segunda-feira', terca: 'Terça-feira', quarta: 'Quarta-feira', quinta: 'Quinta-feira', sexta: 'Sexta-feira', sabado: 'Sábado', domingo: 'Domingo' }
const DIAS_ORDER = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']
const teal = '#0EA5A0'
const card = 'rgba(255,255,255,0.04)'
const brd = 'rgba(255,255,255,0.09)'

export default function AvaliadorPanel() {
  const [nome, setNome] = useState('')
  const [ready, setReady] = useState(false)
  const [fixos, setFixos] = useState<SlotFixo[]>([])
  const [avulsos, setAvulsos] = useState<SlotAvulso[]>([])
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [ns, setNs] = useState({ data: '', hora: '' })
  const [avTab, setAvTab] = useState<'quadro'|'horarios'|'rascunho'|'avaliacoes'|'diretrizes'|'stats'>('quadro')
  const [refreshKey, setRefreshKey] = useState(0)
  const [statsKey, setStatsKey] = useState(0)
  // Candidatos inscritos nos fixos (fetch from avaliados)
  const [avaliados, setAvaliados] = useState<{ id: string; nome_completo: string; fixos_escolhidos: string }[]>([])

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const criarAvulso = async () => {
    if (!ns.data || !ns.hora) return flash('Preencha data e hora')
    try {
      const r = await fetch('/api/avaliallos/slots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: ns.data, hora: ns.hora, max_avaliadores: 2, max_avaliados: 2, criado_por: nome }) })
      if (!r.ok) throw new Error()
      flash('Horário criado!'); setShowNew(false); setNs({ data: '', hora: '' }); fetchAll()
    } catch { flash('Erro ao criar') }
  }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [fr, ar, avr] = await Promise.all([fetch('/api/avaliallos/slots-fixos').then(r => r.json()), fetch('/api/avaliallos/slots').then(r => r.json()), fetch('/api/avaliallos/avaliados').then(r => r.json())])
      const fixArr = Array.isArray(fr) ? fr as SlotFixo[] : []
      const avArr = Array.isArray(ar) ? ar as SlotAvulso[] : []
      setFixos(fixArr.filter(s => s.ativo))
      const today = new Date(); today.setHours(0, 0, 0, 0)
      setAvulsos(avArr.filter(s => s.ativo && new Date(s.data + 'T00:00:00') >= today))
      setAvaliados(Array.isArray(avr) ? avr : [])
    } catch { flash('Erro ao carregar') } finally { setLoading(false) }
  }, [])

  useEffect(() => { if (ready) fetchAll() }, [ready, fetchAll])

  const marcarFixo = async (slotFixoId: string) => {
    setBusy(slotFixoId)
    try {
      const r = await fetch('/api/avaliallos/disponibilidade-fixo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ avaliador_nome: nome, slot_fixo_id: slotFixoId }) })
      const d = await r.json(); if (!r.ok) throw new Error(d.error); flash('Marcado!'); fetchAll()
    } catch (e: unknown) { flash(e instanceof Error ? e.message : 'Erro') } finally { setBusy(null) }
  }

  const removerFixo = async (dispId: string) => {
    setBusy(dispId)
    try { await fetch(`/api/avaliallos/disponibilidade-fixo?id=${dispId}`, { method: 'DELETE' }); flash('Removido'); fetchAll() }
    catch { flash('Erro') } finally { setBusy(null) }
  }

  const marcarAvulso = async (slotId: string) => {
    setBusy(slotId)
    try {
      const r = await fetch('/api/avaliallos/disponibilidade', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ avaliador_nome: nome, slot_id: slotId }) })
      const d = await r.json(); if (!r.ok) throw new Error(d.error); flash('Marcado!'); fetchAll()
    } catch (e: unknown) { flash(e instanceof Error ? e.message : 'Erro') } finally { setBusy(null) }
  }

  const removerAvulso = async (dispId: string) => {
    setBusy(dispId)
    try { await fetch(`/api/avaliallos/disponibilidade?id=${dispId}`, { method: 'DELETE' }); flash('Removido'); fetchAll() }
    catch { flash('Erro') } finally { setBusy(null) }
  }

  // Candidatos que escolheram um fixo (por id)
  const candidatosPorFixo = (fixoId: string) => {
    return avaliados.filter(a => {
      try { const ids = JSON.parse(a.fixos_escolhidos || '[]'); return ids.includes(fixoId) } catch { return false }
    })
  }

  const fmtDate = (s: string) => new Date(s + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  const fixosByDia = fixos.reduce<Record<string, SlotFixo[]>>((a, s) => { if (!a[s.dia_semana]) a[s.dia_semana] = []; a[s.dia_semana].push(s); return a }, {})
  const avulsosByDate = avulsos.reduce<Record<string, SlotAvulso[]>>((a, s) => { if (!a[s.data]) a[s.data] = []; a[s.data].push(s); return a }, {})

  const nomeWords = nome.trim().split(/\s+/).filter(Boolean)
  const hasFullName = nomeWords.length >= 2 && nomeWords.every(w => w.length >= 2)

  if (!ready) {
    return (
      <div className="min-h-screen relative">
        <AtmosphericBg />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-5">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(14,165,160,0.15) 0%, transparent 70%)', border: '2px solid rgba(14,165,160,0.3)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={teal} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h2 className="font-fraunces text-2xl mb-2" style={{ color: 'rgba(253,251,247,0.95)' }}>Painel do Avaliador</h2>
            <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.4)' }}>Digite seu nome completo para continuar</p>
          </div>
          <div className="rounded-3xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1.5px solid ${brd}`, backdropFilter: 'blur(12px)' }}>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome e Sobrenome" className="font-dm w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all mb-3 placeholder:text-white/20" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1.5px solid ${nome.trim() && !hasFullName ? 'rgba(200,75,49,0.5)' : brd}`, color: 'rgba(253,251,247,0.9)' }} onKeyDown={e => { if (e.key === 'Enter' && hasFullName) setReady(true) }} />

            {/* Full name warning */}
            <div className="rounded-xl px-4 py-3 mb-4 flex items-start gap-3" style={{
              backgroundColor: nome.trim() && !hasFullName ? 'rgba(200,75,49,0.08)' : 'rgba(14,165,160,0.06)',
              border: `1px solid ${nome.trim() && !hasFullName ? 'rgba(200,75,49,0.2)' : 'rgba(14,165,160,0.15)'}`,
            }}>
              <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={nome.trim() && !hasFullName ? '#C84B31' : teal} strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="font-dm text-xs leading-relaxed" style={{ color: nome.trim() && !hasFullName ? '#C84B31' : 'rgba(253,251,247,0.5)' }}>
                <strong>Use seu nome completo</strong> (nome e sobrenome).
                {nome.trim() && !hasFullName
                  ? ' Por favor, inclua pelo menos nome e sobrenome para que possamos te identificar corretamente.'
                  : ' Isso evita duplicidades e garante que suas avaliações fiquem corretamente registradas.'}
              </p>
            </div>

            <button onClick={() => hasFullName && setReady(true)} disabled={!hasFullName} className="font-dm w-full py-3.5 rounded-2xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed" style={{ backgroundColor: teal, color: '#fff', boxShadow: hasFullName ? '0 4px 20px rgba(14,165,160,0.25)' : 'none' }}>Continuar</button>
          </div>
        </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <AtmosphericBg />

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-10">

      {/* Header with glass card */}
      <div className="rounded-3xl p-6 mb-8" style={{ background:'linear-gradient(135deg, rgba(14,165,160,0.06), rgba(14,165,160,0.02))', border:'1px solid rgba(14,165,160,0.12)', backdropFilter:'blur(20px)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:'linear-gradient(135deg, #0EA5A0, #1BBAB0)', boxShadow:'0 4px 20px rgba(14,165,160,0.25)' }}>
              <span className="font-fraunces text-lg font-bold italic text-white">A</span>
            </div>
            <div>
              <span className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color: teal }}>Avaliador</span>
              <h2 className="font-fraunces text-xl" style={{ color: 'rgba(253,251,247,0.95)' }}>Olá, <em className="italic" style={{ color: teal }}>{nome}</em></h2>
            </div>
          </div>
          <div className="flex gap-2">
            {avTab === 'horarios' && (
              <button onClick={() => setShowNew(!showNew)} className="font-dm text-xs px-4 py-2.5 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5" style={{ background:'linear-gradient(135deg, #C84B31, #D4854A)', boxShadow:'0 4px 16px rgba(200,75,49,0.25)' }}>
                <svg className="inline mr-1.5 -mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                Sugerir horário
              </button>
            )}
            <button onClick={() => { fetchAll(); setRefreshKey(k => k + 1) }} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5" style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${brd}` }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(253,251,247,0.4)" strokeWidth="2" strokeLinecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs with glass effect */}
      <div className="flex gap-1.5 mb-8 p-1.5 rounded-2xl overflow-x-auto" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(12px)' }}>
        {([
          { k: 'quadro' as const, l: 'Quadro' },
          { k: 'horarios' as const, l: 'Horários' },
          { k: 'rascunho' as const, l: 'Rascunho' },
          { k: 'avaliacoes' as const, l: 'Avaliações' },
          { k: 'diretrizes' as const, l: 'Diretrizes' },
          { k: 'stats' as const, l: 'Estatísticas' },
        ]).map(t => (
          <button key={t.k} onClick={() => setAvTab(t.k)} className="font-dm text-xs sm:text-sm flex-1 py-3 rounded-xl transition-all duration-300 font-medium whitespace-nowrap px-2 sm:px-3" style={{ background: avTab === t.k ? 'linear-gradient(135deg, rgba(14,165,160,0.15), rgba(14,165,160,0.05))' : 'transparent', color: avTab === t.k ? teal : 'rgba(253,251,247,0.3)', border: avTab === t.k ? '1px solid rgba(14,165,160,0.2)' : '1px solid transparent', boxShadow: avTab === t.k ? '0 2px 12px rgba(14,165,160,0.1)' : 'none' }}>{t.l}</button>
        ))}
      </div>

      {avTab === 'avaliacoes' ? (
        <AvaliacaoTool key={refreshKey} avaliadorNome={nome} onDataChange={() => setStatsKey(k => k + 1)} />
      ) : avTab === 'rascunho' ? (
        <RascunhoTool />
      ) : avTab === 'quadro' ? (
        <QuadroSemanal key={`q${refreshKey}`} readOnly />
      ) : avTab === 'diretrizes' ? (
        <DiretrizesPanel />
      ) : avTab === 'stats' ? (
        <StatsPanel key={statsKey} />
      ) : (
      <>

      {/* Form criar avulso */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <div className="rounded-3xl p-6" style={{ backgroundColor: card, border: `1.5px solid ${brd}` }}>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                <p className="font-dm text-sm font-bold" style={{ color: 'rgba(253,251,247,0.8)' }}>Sugerir horário específico</p>
              </div>
              <p className="font-dm text-xs mb-4" style={{ color: 'rgba(253,251,247,0.3)' }}>O horário será enviado para a coordenação, que decidirá publicá-lo no formulário.</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-dm text-xs block mb-1.5" style={{ color: 'rgba(253,251,247,0.3)' }}>Data</label>
                  <input type="date" value={ns.data} onChange={e => setNs({ ...ns, data: e.target.value })} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(253,251,247,0.04)', border: `1.5px solid ${brd}`, color: 'rgba(253,251,247,0.8)', colorScheme: 'dark' }} />
                </div>
                <div>
                  <label className="font-dm text-xs block mb-1.5" style={{ color: 'rgba(253,251,247,0.3)' }}>Hora</label>
                  <input type="time" value={ns.hora} onChange={e => setNs({ ...ns, hora: e.target.value })} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(253,251,247,0.04)', border: `1.5px solid ${brd}`, color: 'rgba(253,251,247,0.8)', colorScheme: 'dark' }} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={criarAvulso} className="font-dm text-sm px-5 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor: '#C84B31' }}>Enviar</button>
                <button onClick={() => setShowNew(false)} className="font-dm text-sm px-5 py-2.5 rounded-xl" style={{ color: 'rgba(253,251,247,0.3)' }}>Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-16 text-center"><div className="w-8 h-8 rounded-full border-2 border-t-transparent mx-auto animate-spin" style={{ borderColor: brd, borderTopColor: 'transparent' }} /></div>
      ) : (
        <div className="space-y-12">
          {/* FIXOS */}
          <div>
            <h3 className="font-dm text-sm font-bold mb-1" style={{ color: 'rgba(253,251,247,0.8)' }}>Horários fixos semanais</h3>
            <p className="font-dm text-xs mb-5" style={{ color: 'rgba(253,251,247,0.3)' }}>Marque os horários recorrentes em que você pode avaliar.</p>
            {Object.keys(fixosByDia).length === 0 ? (
              <div className="py-8 text-center rounded-2xl" style={{ border: `1.5px dashed ${brd}` }}><p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>Nenhum horário fixo.</p></div>
            ) : (
              <div className="space-y-6">
                {DIAS_ORDER.filter(d => fixosByDia[d]).map(dia => (
                  <div key={dia}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: teal }} />
                      <h4 className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color: teal }}>{DIAS[dia]}</h4>
                      <div className="flex-1 h-px" style={{ backgroundColor: brd }} />
                    </div>
                    <div className="space-y-3">
                      {fixosByDia[dia].sort((a, b) => a.hora.localeCompare(b.hora)).map(slot => {
                        const mine = slot.avaliador_disp_fixo?.find(d => d.avaliadores?.nome === nome)
                        const ld = busy === slot.id || busy === mine?.id
                        return (
                          <div key={slot.id} className="rounded-2xl p-4" style={{ backgroundColor: mine ? 'rgba(14,165,160,0.06)' : card, border: `1.5px solid ${mine ? 'rgba(14,165,160,0.3)' : brd}` }}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-dm text-xl font-bold" style={{ color: 'rgba(253,251,247,0.95)' }}>{slot.hora}</span>
                              {mine ? (
                                <button onClick={() => removerFixo(mine.id)} disabled={!!ld} className="font-dm text-xs px-4 py-2 rounded-xl font-medium" style={{ backgroundColor: 'rgba(200,75,49,0.08)', color: '#C84B31' }}>{ld ? '...' : 'Remover'}</button>
                              ) : (
                                <button onClick={() => marcarFixo(slot.id)} disabled={!!ld} className="font-dm text-xs px-4 py-2 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5" style={{ backgroundColor: teal }}>{ld ? '...' : 'Marcar'}</button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {slot.avaliador_disp_fixo?.map(d => (
                                <span key={d.id} className="font-dm text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: d.avaliadores?.nome === nome ? 'rgba(14,165,160,0.12)' : 'rgba(253,251,247,0.05)', color: d.avaliadores?.nome === nome ? teal : 'rgba(253,251,247,0.5)' }}>{d.avaliadores?.nome}</span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AVULSOS */}
          {Object.keys(avulsosByDate).length > 0 && (
            <div>
              <h3 className="font-dm text-sm font-bold mb-1" style={{ color: 'rgba(253,251,247,0.8)' }}>Horários avulsos</h3>
              <p className="font-dm text-xs mb-5" style={{ color: 'rgba(253,251,247,0.3)' }}>Horários específicos criados pela coordenação.</p>
              <div className="space-y-6">
                {Object.entries(avulsosByDate).sort(([a], [b]) => a.localeCompare(b)).map(([data, slots]) => (
                  <div key={data}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#C84B31' }} />
                      <h4 className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color: '#C84B31' }}>{fmtDate(data)}</h4>
                      <div className="flex-1 h-px" style={{ backgroundColor: brd }} />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {slots.sort((a, b) => a.hora.localeCompare(b.hora)).map(slot => {
                        const mine = slot.avaliador_disponibilidade?.find(d => d.avaliadores?.nome === nome)
                        const cnt = slot.avaliador_disponibilidade?.length || 0
                        const full = cnt >= slot.max_avaliadores
                        const ld = busy === slot.id || busy === mine?.id
                        return (
                          <div key={slot.id} className="rounded-2xl p-4" style={{ backgroundColor: mine ? 'rgba(200,75,49,0.04)' : card, border: `1.5px solid ${mine ? 'rgba(200,75,49,0.2)' : brd}` }}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-dm text-xl font-bold" style={{ color: 'rgba(253,251,247,0.95)' }}>{slot.hora}</span>
                              {mine ? (
                                <button onClick={() => removerAvulso(mine.id)} disabled={!!ld} className="font-dm text-xs px-3 py-2 rounded-xl font-medium" style={{ backgroundColor: 'rgba(200,75,49,0.08)', color: '#C84B31' }}>{ld ? '...' : 'Remover'}</button>
                              ) : (
                                <button onClick={() => marcarAvulso(slot.id)} disabled={full || !!ld} className="font-dm text-xs px-3 py-2 rounded-xl text-white font-medium transition-all hover:-translate-y-0.5 disabled:opacity-30" style={{ backgroundColor: '#C84B31' }}>{ld ? '...' : full ? 'Cheio' : 'Marcar'}</button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>{cnt}/{slot.max_avaliadores} aval.</span>
                              {slot.avaliador_disponibilidade?.map(d => <span key={d.id} className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(253,251,247,0.05)', color: 'rgba(253,251,247,0.5)' }}>{d.avaliadores?.nome}</span>)}
                            </div>
                            {slot.bookings?.length > 0 && (
                              <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${brd}` }}>
                                <span className="font-dm text-xs" style={{ color: '#D4854A' }}>{slot.bookings.length} avaliado(s):</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {slot.bookings.map(b => <span key={b.id} className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(212,133,74,0.1)', color: '#D4854A' }}>{b.avaliados?.nome_completo}</span>)}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      </>
      )}

      <AnimatePresence>
        {toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 font-dm text-sm px-5 py-3 rounded-2xl shadow-xl z-50 font-medium" style={{ backgroundColor: 'rgba(253,251,247,0.95)', color: '#1A1A1A' }}>{toast}</motion.div>}
      </AnimatePresence>
      </div>
    </div>
  )
}
