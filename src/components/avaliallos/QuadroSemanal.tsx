'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Participante { id: string; quadro_slot_id: string; tipo: string; nome: string; telefone: string | null; confirmado: boolean }
interface QuadroSlot { id: string; data: string; hora: string; participantes: Participante[] }
interface QuadroData { semana_inicio: string; semana_fim: string; slots: QuadroSlot[] }
interface FilaAvaliado { id: string; nome_completo: string; telefone: string; categoria: string; status: string; fixos_escolhidos: string; ja_participou: boolean }

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
const T = '#0EA5A0', C = 'rgba(255,255,255,0.025)', B = 'rgba(255,255,255,0.07)'
const X = 'rgba(253,251,247,0.9)', X2 = 'rgba(253,251,247,0.5)', X3 = 'rgba(253,251,247,0.3)'
const ST: Record<string, { bg: string; tx: string; lb: string }> = {
  aguardando: { bg: 'rgba(212,133,74,0.12)', tx: '#D4854A', lb: 'Aguardando' },
  em_confirmacao: { bg: 'rgba(234,140,0,0.12)', tx: '#EA8C00', lb: 'Em confirmação' },
  confirmado: { bg: 'rgba(34,197,94,0.12)', tx: '#22c55e', lb: 'Confirmado' },
  remarcar: { bg: 'rgba(139,92,246,0.12)', tx: '#8B5CF6', lb: 'Remarcar' },
  removido: { bg: 'rgba(92,92,92,0.12)', tx: '#5C5C5C', lb: 'Removido' },
  avaliacao_realizada: { bg: 'rgba(253,251,247,0.04)', tx: 'rgba(253,251,247,0.35)', lb: 'Avaliação já realizada' },
}

interface Props { readOnly?: boolean }

export default function QuadroSemanal({ readOnly = false }: Props) {
  const [data, setData] = useState<QuadroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [weekOffset, setWeekOffset] = useState(0)

  // Add slot form
  const [addingDay, setAddingDay] = useState<string | null>(null)
  const [newHora, setNewHora] = useState('')

  // Add participant form
  const [addingPart, setAddingPart] = useState<{ slotId: string; tipo: 'avaliador' | 'avaliado' } | null>(null)
  const [partForm, setPartForm] = useState({ nome: '', telefone: '' })
  const [modalMode, setModalMode] = useState<'manual' | 'fila'>('fila')

  // Fila data
  const [fila, setFila] = useState<FilaAvaliado[]>([])
  const [filaBusca, setFilaBusca] = useState('')
  const [filaFiltro, setFilaFiltro] = useState<string | null>(null)

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  // Fetch fila
  const fetchFila = useCallback(async () => {
    try {
      const r = await fetch('/api/avaliallos/avaliados')
      const d = await r.json()
      setFila(Array.isArray(d) ? d : [])
    } catch {}
  }, [])

  const getMonday = useCallback(() => {
    const now = new Date()
    const day = now.getDay()
    const mon = new Date(now)
    mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + weekOffset * 7)
    mon.setHours(0, 0, 0, 0)
    return mon.toISOString().slice(0, 10)
  }, [weekOffset])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/avaliallos/quadro?semana=${getMonday()}`)
      const d = await r.json()
      setData(d)
    } catch { flash('Erro ao carregar') }
    finally { setLoading(false) }
  }, [getMonday])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { if (!readOnly) fetchFila() }, [readOnly, fetchFila])

  const addSlot = async (dateStr: string) => {
    if (!newHora) return flash('Preencha a hora')
    await fetch('/api/avaliallos/quadro', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_slot', data: dateStr, hora: newHora })
    })
    setAddingDay(null); setNewHora(''); fetchData()
  }

  const removeSlot = async (id: string) => {
    if (!confirm('Remover este horário e todos participantes?')) return
    await fetch(`/api/avaliallos/quadro?tipo=slot&id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const addParticipante = async (slotId: string, tipo: string) => {
    if (!partForm.nome) return flash('Preencha o nome')
    await fetch('/api/avaliallos/quadro', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_participante', quadro_slot_id: slotId, tipo, ...partForm })
    })
    setAddingPart(null); setPartForm({ nome: '', telefone: '' }); fetchData()
  }

  const addFromFila = async (av: FilaAvaliado) => {
    if (!addingPart) return
    await fetch('/api/avaliallos/quadro', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_participante', quadro_slot_id: addingPart.slotId, tipo: 'avaliado', nome: av.nome_completo, telefone: av.telefone })
    })
    setAddingPart(null); setFilaBusca(''); setFilaFiltro(null); fetchData()
    flash(`${av.nome_completo} adicionado!`)
  }

  const filaFiltered = fila.filter(a => {
    if (filaFiltro && a.status !== filaFiltro) return false
    if (filaBusca) {
      const q = filaBusca.toLowerCase()
      if (!a.nome_completo.toLowerCase().includes(q) && !a.telefone.includes(q)) return false
    }
    return true
  })

  const toggleConfirmado = async (p: Participante) => {
    await fetch('/api/avaliallos/quadro', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, confirmado: !p.confirmado })
    })
    fetchData()
  }

  const removeParticipante = async (id: string) => {
    await fetch(`/api/avaliallos/quadro?tipo=part&id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  // Generate WhatsApp text
  const exportText = () => {
    if (!data) return
    const weekDates = getWeekDates()
    let text = '*Avaliações da semana:*\n\n'
    weekDates.forEach((dateStr, i) => {
      const daySlots = (data.slots || []).filter(s => s.data === dateStr).sort((a, b) => a.hora.localeCompare(b.hora))
      if (daySlots.length === 0) return
      daySlots.forEach(slot => {
        const avaliadores = slot.participantes.filter(p => p.tipo === 'avaliador').map(p => p.nome).join(' + ')
        text += `*${DIAS[i]} às ${slot.hora}:* ${avaliadores || '?'}\n`
        slot.participantes.filter(p => p.tipo === 'avaliado').forEach(p => {
          const status = p.confirmado ? '(C)' : '(P)'
          text += `${p.nome}: ${p.telefone || 'sem tel'} ${status}\n`
        })
        text += '\n'
      })
    })
    text += '_(C) = Confirmado, (P) = Pendente_'

    navigator.clipboard.writeText(text).then(() => flash('Texto copiado para o clipboard!'))
  }

  const getWeekDates = () => {
    const mon = new Date(getMonday() + 'T00:00:00')
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(mon); d.setDate(mon.getDate() + i)
      return d.toISOString().slice(0, 10)
    })
  }

  const fmtDateShort = (s: string) => {
    const d = new Date(s + 'T00:00:00')
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const weekDates = data ? getWeekDates() : []

  const fmtWeekRange = () => {
    if (!data) return ''
    return `${fmtDateShort(data.semana_inicio)} — ${fmtDateShort(data.semana_fim)}`
  }

  if (loading) {
    return <div className="py-16 text-center"><div className="w-8 h-8 rounded-full border-2 border-t-transparent mx-auto animate-spin" style={{ borderColor: B, borderTopColor: 'transparent' }} /></div>
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-fraunces text-xl" style={{ color: X }}>Quadro da Semana</h3>
          <p className="font-dm text-xs mt-1" style={{ color: X3 }}>{fmtWeekRange()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(o => o - 1)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C, border: `1px solid ${B}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={X3} strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={() => setWeekOffset(0)} className="font-dm text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: weekOffset === 0 ? `${T}15` : C, color: weekOffset === 0 ? T : X3, border: `1px solid ${weekOffset === 0 ? `${T}30` : B}` }}>
            Hoje
          </button>
          <button onClick={() => setWeekOffset(o => o + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C, border: `1px solid ${B}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={X3} strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
          {!readOnly && (
            <button onClick={exportText} className="font-dm text-xs px-3 py-2 rounded-lg inline-flex items-center gap-1.5 ml-2" style={{ backgroundColor: '#25D36618', color: '#25D366', border: '1px solid #25D36630' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copiar p/ WhatsApp
            </button>
          )}
        </div>
      </div>

      {/* Week grid */}
      <div className="space-y-4">
        {weekDates.map((dateStr, dayIdx) => {
          const daySlots = (data?.slots || []).filter(s => s.data === dateStr).sort((a, b) => a.hora.localeCompare(b.hora))
          const isToday = dateStr === new Date().toISOString().slice(0, 10)

          return (
            <div key={dateStr} className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${isToday ? `${T}30` : B}`, backgroundColor: isToday ? `${T}04` : C }}>
              {/* Day header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${B}` }}>
                <div className="flex items-center gap-2">
                  {isToday && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: T }} />}
                  <span className="font-dm text-sm font-bold" style={{ color: isToday ? T : X }}>{DIAS[dayIdx]}</span>
                  <span className="font-dm text-xs" style={{ color: X3 }}>{fmtDateShort(dateStr)}</span>
                </div>
                {!readOnly && (
                  <button onClick={() => setAddingDay(addingDay === dateStr ? null : dateStr)} className="font-dm text-xs px-2 py-1 rounded-md" style={{ color: T }}>
                    + horário
                  </button>
                )}
              </div>

              {/* Add slot form */}
              <AnimatePresence>
                {addingDay === dateStr && !readOnly && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: 'rgba(253,251,247,0.02)' }}>
                      <input type="time" value={newHora} onChange={e => setNewHora(e.target.value)} className="font-dm text-xs px-3 py-1.5 rounded-md" style={{ backgroundColor: 'rgba(253,251,247,0.04)', border: `1px solid ${B}`, color: X, colorScheme: 'dark' }} />
                      <button onClick={() => addSlot(dateStr)} className="font-dm text-xs px-3 py-1.5 rounded-md text-white" style={{ backgroundColor: T }}>Criar</button>
                      <button onClick={() => setAddingDay(null)} className="font-dm text-xs" style={{ color: X3 }}>✕</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Slots */}
              {daySlots.length === 0 ? (
                <div className="px-4 py-3">
                  <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.15)' }}>Sem avaliações</span>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: B }}>
                  {daySlots.map(slot => {
                    const avaliadores = slot.participantes.filter(p => p.tipo === 'avaliador')
                    const avaliados = slot.participantes.filter(p => p.tipo === 'avaliado')
                    return (
                      <div key={slot.id} className="px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-dm text-lg font-bold" style={{ color: X }}>{slot.hora}</span>
                            {avaliadores.length > 0 && (
                              <span className="font-dm text-xs" style={{ color: T }}>
                                {avaliadores.map(a => a.nome).join(' + ')}
                              </span>
                            )}
                          </div>
                          {!readOnly && (
                            <button onClick={() => removeSlot(slot.id)} className="font-dm text-xs" style={{ color: 'rgba(200,75,49,0.5)' }}>✕</button>
                          )}
                        </div>

                        {/* Avaliadores */}
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          {avaliadores.map(p => (
                            <span key={p.id} className="font-dm text-xs px-2 py-1 rounded-md inline-flex items-center gap-1.5" style={{ backgroundColor: `${T}10`, color: T, border: `1px solid ${T}20` }}>
                              {p.nome}
                              {!readOnly && <button onClick={() => removeParticipante(p.id)} className="opacity-50 hover:opacity-100">✕</button>}
                            </span>
                          ))}
                          {!readOnly && (
                            <button onClick={() => { setAddingPart({ slotId: slot.id, tipo: 'avaliador' }); setPartForm({ nome: '', telefone: '' }) }} className="font-dm text-xs px-2 py-1 rounded-md" style={{ color: T, border: `1px dashed ${T}30` }}>
                              + avaliador
                            </button>
                          )}
                        </div>

                        {/* Avaliados */}
                        <div className="space-y-1">
                          {avaliados.map(p => (
                            <div key={p.id} className="flex items-center gap-2">
                              <button
                                onClick={() => !readOnly && toggleConfirmado(p)}
                                className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0 transition-all"
                                style={{
                                  backgroundColor: p.confirmado ? `${T}20` : 'transparent',
                                  border: `1.5px solid ${p.confirmado ? T : 'rgba(253,251,247,0.15)'}`,
                                  cursor: readOnly ? 'default' : 'pointer',
                                }}
                              >
                                {p.confirmado && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                              </button>
                              <span className="font-dm text-xs" style={{ color: p.confirmado ? X : X2 }}>{p.nome}</span>
                              {p.telefone && (
                                <a href={`https://wa.me/${p.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-dm text-xs" style={{ color: '#25D366' }}>
                                  {p.telefone}
                                </a>
                              )}
                              <span className="font-dm text-xs font-bold" style={{ color: p.confirmado ? T : '#D4854A' }}>
                                {p.confirmado ? 'C' : 'P'}
                              </span>
                              {!readOnly && <button onClick={() => removeParticipante(p.id)} className="font-dm text-xs opacity-30 hover:opacity-100" style={{ color: '#C84B31' }}>✕</button>}
                            </div>
                          ))}
                          {!readOnly && (
                            <button onClick={() => { setAddingPart({ slotId: slot.id, tipo: 'avaliado' }); setPartForm({ nome: '', telefone: '' }) }} className="font-dm text-xs py-0.5" style={{ color: '#D4854A' }}>
                              + avaliado
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add participant modal */}
      <AnimatePresence>
        {addingPart && !readOnly && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50 p-5" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => { setAddingPart(null); setFilaBusca(''); setFilaFiltro(null); setModalMode('fila') }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} onClick={e => e.stopPropagation()} className="rounded-2xl p-5 w-full max-w-lg max-h-[85vh] flex flex-col" style={{ backgroundColor: '#1A1A1A', border: `1.5px solid ${B}` }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-dm text-sm font-bold" style={{ color: X }}>
                  Adicionar {addingPart.tipo === 'avaliador' ? 'avaliador' : 'avaliado'}
                </h4>
                <button onClick={() => { setAddingPart(null); setFilaBusca(''); setFilaFiltro(null) }} className="font-dm text-xs" style={{ color: X3 }}>✕</button>
              </div>

              {addingPart.tipo === 'avaliado' ? (
                <>
                  {/* Mode toggle */}
                  <div className="flex gap-1 mb-4 p-0.5 rounded-xl" style={{ backgroundColor: 'rgba(253,251,247,0.03)' }}>
                    <button onClick={() => setModalMode('fila')} className="font-dm text-xs flex-1 py-2 rounded-lg font-medium" style={{ backgroundColor: modalMode === 'fila' ? 'rgba(253,251,247,0.08)' : 'transparent', color: modalMode === 'fila' ? X : X3 }}>Da fila</button>
                    <button onClick={() => setModalMode('manual')} className="font-dm text-xs flex-1 py-2 rounded-lg font-medium" style={{ backgroundColor: modalMode === 'manual' ? 'rgba(253,251,247,0.08)' : 'transparent', color: modalMode === 'manual' ? X : X3 }}>Manual</button>
                  </div>

                  {modalMode === 'fila' ? (
                    <div className="flex-1 min-h-0 flex flex-col">
                      {/* Search */}
                      <div className="relative mb-3">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(253,251,247,0.2)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input type="text" value={filaBusca} onChange={e => setFilaBusca(e.target.value)} placeholder="Buscar nome ou telefone..." className="font-dm text-xs w-full pl-9 pr-3 py-2.5 rounded-xl placeholder:text-white/15 outline-none" style={{ backgroundColor: 'rgba(253,251,247,0.03)', border: `1px solid ${B}`, color: X }} />
                      </div>

                      {/* Status filters */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <button onClick={() => setFilaFiltro(null)} className="font-dm text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: !filaFiltro ? X : 'rgba(253,251,247,0.03)', color: !filaFiltro ? '#1A1A1A' : X3 }}>Todos ({fila.length})</button>
                        {Object.entries(ST).map(([k, v]) => {
                          const c = fila.filter(a => a.status === k).length
                          if (!c) return null
                          return <button key={k} onClick={() => setFilaFiltro(filaFiltro === k ? null : k)} className="font-dm text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: filaFiltro === k ? v.tx : v.bg, color: filaFiltro === k ? '#fff' : v.tx }}>{v.lb} ({c})</button>
                        })}
                      </div>

                      {/* Results */}
                      <div className="flex-1 overflow-y-auto space-y-1 pr-1" style={{ maxHeight: '320px' }}>
                        {filaFiltered.length === 0 ? (
                          <p className="font-dm text-xs text-center py-6" style={{ color: X3 }}>Nenhum candidato encontrado.</p>
                        ) : filaFiltered.map(av => {
                          const st = ST[av.status] || ST.aguardando
                          return (
                            <button key={av.id} onClick={() => addFromFila(av)} className="w-full text-left px-3 py-2.5 rounded-xl transition-all hover:bg-white/[0.03] flex items-center justify-between gap-2" style={{ border: `1px solid ${B}` }}>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-dm text-xs font-bold truncate" style={{ color: X }}>{av.nome_completo}</span>
                                  <span className="font-dm text-xs px-1.5 py-0.5 rounded-md shrink-0" style={{ backgroundColor: st.bg, color: st.tx, fontSize: '10px' }}>{st.lb}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="font-dm text-xs" style={{ color: X3 }}>{av.telefone}</span>
                                  <span className="font-dm text-xs" style={{ color: X3 }}>·</span>
                                  <span className="font-dm text-xs truncate" style={{ color: X3 }}>{av.categoria}</span>
                                </div>
                              </div>
                              <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Manual mode */
                    <div className="space-y-3 mb-4">
                      <input type="text" value={partForm.nome} onChange={e => setPartForm({ ...partForm, nome: e.target.value })} placeholder="Nome" className="font-dm text-sm w-full px-3 py-2.5 rounded-xl placeholder:text-white/15" style={{ backgroundColor: 'rgba(253,251,247,0.04)', border: `1px solid ${B}`, color: X }} />
                      <input type="tel" value={partForm.telefone} onChange={e => setPartForm({ ...partForm, telefone: e.target.value })} placeholder="Telefone (opcional)" className="font-dm text-sm w-full px-3 py-2.5 rounded-xl placeholder:text-white/15" style={{ backgroundColor: 'rgba(253,251,247,0.04)', border: `1px solid ${B}`, color: X }} />
                      <button onClick={() => addParticipante(addingPart.slotId, 'avaliado')} className="font-dm text-sm px-4 py-2 rounded-xl text-white font-medium" style={{ backgroundColor: T }}>Adicionar</button>
                    </div>
                  )}
                </>
              ) : (
                /* Avaliador — manual only */
                <div className="space-y-3 mb-4">
                  <input type="text" value={partForm.nome} onChange={e => setPartForm({ ...partForm, nome: e.target.value })} placeholder="Nome do avaliador" className="font-dm text-sm w-full px-3 py-2.5 rounded-xl placeholder:text-white/15" style={{ backgroundColor: 'rgba(253,251,247,0.04)', border: `1px solid ${B}`, color: X }} />
                  <button onClick={() => addParticipante(addingPart.slotId, 'avaliador')} className="font-dm text-sm px-4 py-2 rounded-xl text-white font-medium" style={{ backgroundColor: T }}>Adicionar</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 font-dm text-sm px-5 py-3 rounded-2xl shadow-xl z-50 font-medium" style={{ backgroundColor: 'rgba(253,251,247,0.95)', color: '#1A1A1A' }}>{toast}</motion.div>}
      </AnimatePresence>
    </div>
  )
}
