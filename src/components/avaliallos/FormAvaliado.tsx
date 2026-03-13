'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SlotFixo { id: string; dia_semana: string; hora: string; ativo: boolean }
interface SlotAvulso { id: string; data: string; hora: string; ativo: boolean; no_formulario: boolean; max_avaliados: number; bookings: { id: string }[] }

const DIAS: Record<string, string> = { segunda: 'Segunda-feira', terca: 'Terça-feira', quarta: 'Quarta-feira', quinta: 'Quinta-feira', sexta: 'Sexta-feira', sabado: 'Sábado', domingo: 'Domingo' }
const DIAS_ORDER = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']
const CATEGORIAS = ['Já atendo na Allos — reavaliação', 'Testar habilidades clínicas', 'Formação Omnia ACP', 'Processo seletivo estágio — 1ª tentativa', 'Processo seletivo estágio — 2ª+ tentativa']

export default function FormAvaliado() {
  const [fixos, setFixos] = useState<SlotFixo[]>([])
  const [avulsos, setAvulsos] = useState<SlotAvulso[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ nome_completo: '', telefone: '', ja_participou: false, categoria: '', observacoes: '', fixos_ids: [] as string[], avulso_slot_id: '' })

  useEffect(() => {
    Promise.all([fetch('/api/avaliallos/slots-fixos').then(r => r.json()), fetch('/api/avaliallos/slots').then(r => r.json())])
      .then(([f, a]) => {
        const fixArr = Array.isArray(f) ? f as SlotFixo[] : []
        const avArr = Array.isArray(a) ? a as SlotAvulso[] : []
        setFixos(fixArr.filter(s => s.ativo))
        const today = new Date(); today.setHours(0, 0, 0, 0)
        setAvulsos(avArr.filter(s => s.ativo && s.no_formulario && new Date(s.data + 'T00:00:00') >= today && (s.bookings?.length ?? 0) < s.max_avaliados))
      }).catch(() => setError('Erro ao carregar')).finally(() => setLoading(false))
  }, [])

  const toggleFixo = (id: string) => {
    setForm(f => ({ ...f, fixos_ids: f.fixos_ids.includes(id) ? f.fixos_ids.filter(x => x !== id) : [...f.fixos_ids, id] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (form.fixos_ids.length === 0) return setError('Selecione pelo menos um horário fixo')
    setSubmitting(true); setError('')
    try {
      const r = await fetch('/api/avaliallos/avaliados', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fixos_escolhidos: JSON.stringify(form.fixos_ids), avulso_slot_id: form.avulso_slot_id || null })
      })
      const d = await r.json(); if (!r.ok) throw new Error(d.error); setSuccess(true)
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Erro') } finally { setSubmitting(false) }
  }

  const fmtDate = (s: string) => new Date(s + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })

  // Group fixos by dia_semana
  const fixosByDia = fixos.reduce<Record<string, SlotFixo[]>>((a, s) => { if (!a[s.dia_semana]) a[s.dia_semana] = []; a[s.dia_semana].push(s); return a }, {})

  // Group avulsos by date
  const avulsosByDate = avulsos.reduce<Record<string, SlotAvulso[]>>((a, s) => { if (!a[s.data]) a[s.data] = []; a[s.data].push(s); return a }, {})

  const inp = { backgroundColor: 'rgba(253,251,247,0.04)', border: '1.5px solid rgba(253,251,247,0.1)', color: 'rgba(253,251,247,0.9)', borderRadius: '16px' }
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = 'rgba(14,165,160,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,165,160,0.08)' }
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = 'rgba(253,251,247,0.1)'; e.target.style.boxShadow = 'none' }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-12 px-5">
        {/* Confirmação */}
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'radial-gradient(circle, rgba(14,165,160,0.2) 0%, transparent 70%)', border: '2px solid rgba(14,165,160,0.3)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0EA5A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </motion.div>
          <h2 className="font-fraunces text-3xl mb-3" style={{ color: 'rgba(253,251,247,0.95)' }}>Inscrição realizada!</h2>
          <p className="font-dm text-base leading-relaxed" style={{ color: 'rgba(253,251,247,0.5)' }}>Você entrou na lista de espera. Nossa equipe vai avaliar e entrar em contato pelo WhatsApp.</p>
        </div>

        {/* Dicas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-3xl p-6 md:p-8 mb-8" style={{ backgroundColor: 'rgba(253,251,247,0.03)', border: '1.5px solid rgba(253,251,247,0.08)' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(200,75,49,0.15), rgba(212,133,74,0.15))', border: '1.5px solid rgba(200,75,49,0.2)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
            </div>
            <div>
              <h3 className="font-fraunces text-xl" style={{ color: 'rgba(253,251,247,0.95)' }}>Quer <em className="italic" style={{ color: '#C84B31' }}>decolar</em> na avaliação?</h3>
              <p className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.4)' }}>Dicas clínicas que podem te ajudar no processo seletivo</p>
            </div>
          </div>

          {/* YouTube embed */}
          <div className="rounded-2xl overflow-hidden mb-5" style={{ aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/videoseries?list=PL1Vwy7VAMFcqh-ACF12DmZ00Z9lxmVaPH"
              title="Dicas clínicas AvaliAllos"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>

          <a
            href="https://youtube.com/playlist?list=PL1Vwy7VAMFcqh-ACF12DmZ00Z9lxmVaPH&si=VrOmIAaiYmdPJKBv"
            target="_blank"
            rel="noopener noreferrer"
            className="font-dm text-sm font-medium inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#D4854A', border: '1px solid rgba(200,75,49,0.2)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            Ver playlist completa no YouTube
          </a>
        </motion.div>

        {/* Links úteis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-4">
          <a href="/processo-seletivo" className="group block rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ backgroundColor: 'rgba(253,251,247,0.03)', border: '1.5px solid rgba(253,251,247,0.08)', borderLeftWidth: '4px', borderLeftColor: '#0EA5A0' }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(14,165,160,0.1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0EA5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <div>
                <h4 className="font-fraunces text-lg mb-1" style={{ color: 'rgba(253,251,247,0.95)' }}>Conheça o processo seletivo</h4>
                <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.4)' }}>Entenda como funciona o processo seletivo completo, da inscrição à aprovação, e as competências clínicas avaliadas.</p>
                <span className="font-dm text-xs font-medium mt-2 inline-block" style={{ color: '#0EA5A0' }}>Ver página →</span>
              </div>
            </div>
          </a>

          <a href="/pbe" className="group block rounded-2xl p-5 transition-all hover:-translate-y-1" style={{ backgroundColor: 'rgba(253,251,247,0.03)', border: '1.5px solid rgba(253,251,247,0.08)', borderLeftWidth: '4px', borderLeftColor: '#8B5CF6' }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>
              </div>
              <div>
                <h4 className="font-fraunces text-lg mb-1" style={{ color: 'rgba(253,251,247,0.95)' }}>Prática Baseada em Evidências</h4>
                <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.4)' }}>Entenda a história por trás da prática deliberada e a base científica da nossa avaliação.</p>
                <span className="font-dm text-xs font-medium mt-2 inline-block" style={{ color: '#8B5CF6' }}>Ver página →</span>
              </div>
            </div>
          </a>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-5">
      {/* Hero */}
      <div className="pt-16 sm:pt-20 pb-8 sm:pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-5 sm:mb-6">
          <span className="font-dm text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3 sm:px-4 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(14,165,160,0.1)', color: '#0EA5A0' }}>AvaliAllos · Associação Allos</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-fraunces text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-5 leading-tight" style={{ color: 'rgba(253,251,247,0.95)' }}>
          Agende sua <br className="sm:hidden" /><em className="italic" style={{ color: '#0EA5A0' }}>avaliação</em>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-dm text-sm sm:text-base max-w-md mx-auto leading-relaxed px-2" style={{ color: 'rgba(253,251,247,0.4)' }}>
          Preencha o formulário e escolha seu horário de preferência. Nossa equipe entrará em contato para confirmar.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-center mt-8 gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0EA5A0' }} />
          <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, #0EA5A0, transparent)' }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1BBAB0' }} />
          <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, #0EA5A0)' }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0EA5A0' }} />
        </motion.div>
      </div>

      {/* Aviso informativo */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl p-5 mb-8" style={{ backgroundColor: 'rgba(14,165,160,0.04)', border: '1.5px solid rgba(14,165,160,0.15)' }}>
        <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.6)' }}>
          Este formulário tem como finalidade agendar uma avaliação de aptidão clínica dentro do instrumento <strong style={{ color: '#0EA5A0' }}>AvaliAllos</strong>. Leia os enunciados e preencha com atenção.
        </p>
        <p className="font-dm text-xs mt-3" style={{ color: 'rgba(253,251,247,0.3)' }}>
          Quando você enviar este formulário, ele não coletará automaticamente seus detalhes, como nome e endereço de email, a menos que você mesmo o forneça.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Nome */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <label className="font-dm text-sm font-semibold block mb-2.5" style={{ color: 'rgba(253,251,247,0.7)' }}>Nome completo</label>
          <input type="text" required value={form.nome_completo} onChange={e => setForm({ ...form, nome_completo: e.target.value })} placeholder="Como você se chama?" className="font-dm w-full px-4 py-3.5 text-sm outline-none transition-all placeholder:text-white/20" style={inp} onFocus={focus} onBlur={blur} />
        </motion.div>

        {/* Telefone */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="font-dm text-sm font-semibold block mb-2.5" style={{ color: 'rgba(253,251,247,0.7)' }}>Telefone (WhatsApp)</label>
          <input type="tel" required value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="(31) 99999-9999" className="font-dm w-full px-4 py-3.5 text-sm outline-none transition-all placeholder:text-white/20" style={inp} onFocus={focus} onBlur={blur} />
        </motion.div>

        {/* Já participou */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <label className="font-dm text-sm font-semibold block mb-3" style={{ color: 'rgba(253,251,247,0.7)' }}>Já participou de grupo da Allos?</label>
          <div className="flex gap-3">
            {[{ v: true, l: 'Sim' }, { v: false, l: 'Não' }].map(({ v, l }) => (
              <button key={String(v)} type="button" onClick={() => setForm({ ...form, ja_participou: v })} className="font-dm text-sm flex-1 py-3 rounded-2xl transition-all font-medium" style={{ backgroundColor: form.ja_participou === v ? 'rgba(14,165,160,0.15)' : 'rgba(253,251,247,0.04)', color: form.ja_participou === v ? '#0EA5A0' : 'rgba(253,251,247,0.4)', border: `1.5px solid ${form.ja_participou === v ? 'rgba(14,165,160,0.4)' : 'rgba(253,251,247,0.1)'}` }}>{l}</button>
            ))}
          </div>
        </motion.div>

        {/* Categoria */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="font-dm text-sm font-semibold block mb-3" style={{ color: 'rgba(253,251,247,0.7)' }}>Categoria</label>
          <div className="space-y-2.5">
            {CATEGORIAS.map(cat => { const sel = form.categoria === cat; return (
              <button key={cat} type="button" onClick={() => setForm({ ...form, categoria: cat })} className="font-dm text-xs sm:text-sm w-full text-left px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl transition-all" style={{ backgroundColor: sel ? 'rgba(14,165,160,0.1)' : 'rgba(253,251,247,0.03)', color: sel ? '#1BBAB0' : 'rgba(253,251,247,0.5)', border: `1.5px solid ${sel ? 'rgba(14,165,160,0.3)' : 'rgba(253,251,247,0.08)'}`, borderLeftWidth: sel ? '4px' : '1.5px', borderLeftColor: sel ? '#0EA5A0' : 'rgba(253,251,247,0.08)', fontWeight: sel ? 600 : 400 }}>{cat}</button>
            )})}
          </div>
        </motion.div>

        {/* SEÇÃO 1: Horários fixos (obrigatório 1+) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="mb-3">
            <label className="font-dm text-sm font-semibold block mb-1" style={{ color: 'rgba(253,251,247,0.7)' }}>Horários de disponibilidade *</label>
            <p className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>Selecione um ou mais horários semanais em que você pode comparecer.</p>
          </div>
          {loading ? (
            <div className="py-6 text-center"><div className="w-6 h-6 rounded-full border-2 border-t-transparent mx-auto animate-spin" style={{ borderColor: 'rgba(253,251,247,0.1)', borderTopColor: 'transparent' }} /></div>
          ) : Object.keys(fixosByDia).length === 0 ? (
            <div className="py-6 px-4 rounded-2xl text-center" style={{ border: '1.5px dashed rgba(253,251,247,0.1)' }}><p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>Nenhum horário fixo disponível.</p></div>
          ) : (
            <div className="space-y-4">
              {DIAS_ORDER.filter(d => fixosByDia[d]).map(dia => (
                <div key={dia}>
                  <p className="font-dm text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#0EA5A0' }}>{DIAS[dia]}</p>
                  <div className="flex flex-wrap gap-2.5">
                    {fixosByDia[dia].sort((a, b) => a.hora.localeCompare(b.hora)).map(slot => {
                      const sel = form.fixos_ids.includes(slot.id)
                      return (
                        <button key={slot.id} type="button" onClick={() => toggleFixo(slot.id)} className="font-dm text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all font-medium" style={{ backgroundColor: sel ? 'rgba(14,165,160,0.15)' : 'rgba(253,251,247,0.04)', color: sel ? '#fff' : 'rgba(253,251,247,0.6)', border: `1.5px solid ${sel ? 'rgba(14,165,160,0.5)' : 'rgba(253,251,247,0.1)'}`, boxShadow: sel ? '0 0 20px rgba(14,165,160,0.15)' : 'none' }}>
                          {slot.hora} {sel && '✓'}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          {form.fixos_ids.length > 0 && (
            <p className="font-dm text-xs mt-2" style={{ color: '#0EA5A0' }}>{form.fixos_ids.length} horário(s) selecionado(s)</p>
          )}
        </motion.div>

        {/* SEÇÃO 2: Horários avulsos (opcional) */}
        {Object.keys(avulsosByDate).length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="rounded-2xl p-5" style={{ border: '1.5px solid rgba(200,75,49,0.2)', backgroundColor: 'rgba(200,75,49,0.03)' }}>
              <label className="font-dm text-sm font-semibold block mb-1" style={{ color: '#D4854A' }}>Horário específico disponível</label>
              <p className="font-dm text-xs mb-3" style={{ color: 'rgba(253,251,247,0.3)' }}>Há vagas em horários específicos. Se escolher e for confirmado, este horário será reservado para você.</p>
              <div className="space-y-4">
                {Object.entries(avulsosByDate).sort(([a], [b]) => a.localeCompare(b)).map(([data, slots]) => (
                  <div key={data}>
                    <p className="font-dm text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#C84B31' }}>{fmtDate(data)}</p>
                    <div className="flex flex-wrap gap-2.5">
                      {slots.sort((a, b) => a.hora.localeCompare(b.hora)).map(slot => {
                        const sel = form.avulso_slot_id === slot.id
                        return (
                          <button key={slot.id} type="button" onClick={() => setForm({ ...form, avulso_slot_id: sel ? '' : slot.id })} className="font-dm text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl transition-all font-medium" style={{ backgroundColor: sel ? 'rgba(200,75,49,0.15)' : 'rgba(253,251,247,0.04)', color: sel ? '#fff' : 'rgba(253,251,247,0.6)', border: `1.5px solid ${sel ? 'rgba(200,75,49,0.4)' : 'rgba(253,251,247,0.1)'}` }}>
                            {slot.hora} {sel && '✓'}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Observações */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <label className="font-dm text-sm font-semibold block mb-2.5" style={{ color: 'rgba(253,251,247,0.7)' }}>Observações <span style={{ fontWeight: 400, color: 'rgba(253,251,247,0.3)' }}>(opcional)</span></label>
          <textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} placeholder="Algo que devemos saber?" rows={3} className="font-dm w-full px-4 py-3.5 text-sm outline-none transition-all resize-none placeholder:text-white/20" style={inp} onFocus={focus as unknown as React.FocusEventHandler<HTMLTextAreaElement>} onBlur={blur as unknown as React.FocusEventHandler<HTMLTextAreaElement>} />
        </motion.div>

        <AnimatePresence>
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-dm text-sm text-center py-3 px-4 rounded-2xl" style={{ color: '#C84B31', backgroundColor: 'rgba(200,75,49,0.08)', border: '1px solid rgba(200,75,49,0.15)' }}>{error}</motion.div>}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <button type="submit" disabled={submitting || !form.nome_completo || !form.telefone || !form.categoria || form.fixos_ids.length === 0} className="font-dm w-full py-3.5 sm:py-4 rounded-2xl text-white text-sm font-bold tracking-wide transition-all hover:-translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed" style={{ background: 'linear-gradient(135deg, #C84B31, #D4854A)', boxShadow: '0 6px 25px rgba(200,75,49,0.25)' }}>
            {submitting ? 'Enviando...' : 'Enviar inscrição'}
          </button>
        </motion.div>
      </form>
    </div>
  )
}
