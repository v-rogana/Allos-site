'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Send, Download, AlertCircle, CheckCircle2, Sparkles, Clock, Award } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import StarRating from './StarRating'
import CertificateGenerator from './CertificateGenerator'

interface Atividade {
  id: string
  nome: string
  carga_horaria: number
}

interface Condutor {
  id: string
  nome: string
}

interface Evento {
  id: string
  titulo: string
  descricao: string | null
  data_inicio: string
  data_fim: string
}

interface HorasInfo {
  totalHoras: number
  horasRestantes: number
  liberado: boolean
  porAtividade: Record<string, { count: number; horas: number }>
}

type Step = 'identificacao' | 'atividade' | 'feedback' | 'sucesso'

const HORAS_MINIMO = 30

const SLIDE_VARIANTS = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
}

export default function FormCertificado() {
  // Data from Supabase
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [condutores, setCondutores] = useState<Condutor[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])

  // Form state
  const [step, setStep] = useState<Step>('identificacao')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [nomeSocial, setNomeSocial] = useState('')
  const [email, setEmail] = useState('')
  const [atividadeSelecionada, setAtividadeSelecionada] = useState('')
  const [isEvento, setIsEvento] = useState(false)
  const [notaGrupo, setNotaGrupo] = useState(0)
  const [condutoresSelecionados, setCondutoresSelecionados] = useState<string[]>([])
  const [notaCondutor, setNotaCondutor] = useState(0)
  const [relato, setRelato] = useState('')

  // Hours tracking
  const [horasInfo, setHorasInfo] = useState<HorasInfo | null>(null)
  const [loadingHoras, setLoadingHoras] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [atRes, coRes, evRes] = await Promise.all([
      supabase.from('certificado_atividades').select('*').eq('ativo', true).order('nome'),
      supabase.from('certificado_condutores').select('*').eq('ativo', true).order('nome'),
      fetch('/api/certificados/formacao?type=eventos_ativos').then(r => r.json()),
    ])
    if (atRes.data) setAtividades(atRes.data)
    if (coRes.data) setCondutores(coRes.data)
    if (Array.isArray(evRes)) setEventos(evRes)
  }

  async function fetchHoras(nome: string) {
    if (!nome.trim()) return
    setLoadingHoras(true)
    try {
      const res = await fetch('/api/certificados/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_hours', nome: nome.trim() }),
      })
      const data = await res.json()
      if (!data.error) setHorasInfo(data)
    } catch {
      // silently fail
    } finally {
      setLoadingHoras(false)
    }
  }

  async function claimCertificates() {
    setClaiming(true)
    try {
      await fetch('/api/certificados/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim_certificates', nome: nomeCompleto.trim() }),
      })
      setClaimed(true)
      // Refresh hours (should now be 0)
      await fetchHoras(nomeCompleto)
    } catch {
      // silently fail
    } finally {
      setClaiming(false)
    }
  }

  function toggleCondutor(nome: string) {
    setCondutoresSelecionados(prev => {
      if (prev.includes(nome)) return prev.filter(c => c !== nome)
      if (prev.length >= 3) return prev
      return [...prev, nome]
    })
  }

  function canAdvance(): boolean {
    switch (step) {
      case 'identificacao':
        return nomeCompleto.trim().length > 0 && email.trim().length > 0 && email.includes('@')
      case 'atividade':
        return atividadeSelecionada.length > 0
      case 'feedback':
        if (isEvento) return true
        return notaGrupo > 0 && condutoresSelecionados.length > 0 && notaCondutor > 0
      default:
        return false
    }
  }

  async function handleSubmit() {
    if (!canAdvance()) return
    setLoading(true)
    setError('')

    try {
      // Rate limiting: TEMPORARIAMENTE DESATIVADO PARA TESTES
      // const today = new Date().toISOString().split('T')[0]
      // const { count } = await supabase
      //   .from('certificado_submissions')
      //   .select('*', { count: 'exact', head: true })
      //   .eq('email', email.trim().toLowerCase())
      //   .gte('created_at', `${today}T00:00:00`)
      //   .lte('created_at', `${today}T23:59:59`)
      //
      // if (count !== null && count >= 3) {
      //   setError('Você já registrou o número máximo de atividades hoje (3). Tente novamente amanhã.')
      //   setLoading(false)
      //   return
      // }

      // Submit
      const { error: submitError } = await supabase
        .from('certificado_submissions')
        .insert({
          nome_completo: nomeCompleto.trim(),
          nome_social: nomeSocial.trim() || null,
          email: email.trim().toLowerCase(),
          atividade_nome: atividadeSelecionada,
          nota_grupo: isEvento ? (notaGrupo || 5) : notaGrupo,
          condutores: isEvento ? [] : condutoresSelecionados,
          nota_condutor: isEvento ? (notaCondutor || 5) : notaCondutor,
          relato: relato.trim() || null,
          certificado_gerado: false,
        })

      if (submitError) throw submitError

      // Fetch updated hours after submission
      await fetchHoras(nomeCompleto)

      setSubmitted(true)
      setStep('sucesso')
    } catch {
      setError('Erro ao enviar o formulário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const steps: Step[] = ['identificacao', 'atividade', 'feedback', 'sucesso']
  const stepIndex = steps.indexOf(step)

  const [direction, setDirection] = useState(1)

  function goNext() {
    if (!canAdvance()) return
    setDirection(1)
    if (step === 'feedback') {
      handleSubmit()
    } else {
      setStep(steps[stepIndex + 1])
    }
  }

  function goBack() {
    if (stepIndex > 0 && step !== 'sucesso') {
      setDirection(-1)
      setStep(steps[stepIndex - 1])
    }
  }

  // Get the selected activity's hours
  const atividadeHoras = atividades.find(a => a.nome === atividadeSelecionada)?.carga_horaria || 2

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(165deg, #1A1A1A 0%, #141414 50%, #1A1A1A 100%)' }}>
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute" style={{ top: '-10%', left: '20%', width: '60%', height: '40%', background: 'radial-gradient(ellipse, rgba(200,75,49,0.06) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div className="absolute" style={{ bottom: '-10%', right: '10%', width: '50%', height: '40%', background: 'radial-gradient(ellipse, rgba(200,75,49,0.04) 0%, transparent 60%)', filter: 'blur(60px)' }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(rgba(253,251,247,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="inline-block font-dm text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#C84B31', border: '1px solid rgba(200,75,49,0.2)' }}>
            Formação Base
          </span>
          <h1 className="font-fraunces font-bold text-3xl md:text-4xl mb-3" style={{ color: 'rgba(253,251,247,0.95)' }}>
            Certificado & Feedback
          </h1>
          <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.4)' }}>
            Registre sua participação e ajude a melhorar nossos grupos
          </p>
        </motion.div>

        {/* Progress bar */}
        {step !== 'sucesso' && (
          <div className="flex items-center gap-2 mb-10 px-4">
            {['Dados', 'Atividade', 'Feedback'].map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#C84B31' }}
                    initial={false}
                    animate={{ width: stepIndex > i ? '100%' : stepIndex === i ? '50%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <span className="font-dm text-[10px] tracking-wider uppercase" style={{ color: stepIndex >= i ? 'rgba(253,251,247,0.6)' : 'rgba(253,251,247,0.2)' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Form card */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait" custom={direction}>
              {/* Step 1: Identificação */}
              {step === 'identificacao' && (
                <motion.div
                  key="identificacao"
                  custom={direction}
                  variants={SLIDE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-fraunces font-bold text-xl mb-1" style={{ color: 'rgba(253,251,247,0.9)' }}>Seus Dados</h2>
                    <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.35)' }}>Informe seus dados para registrar sua participação</p>
                  </div>

                  {/* Warning about correct data */}
                  <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: 'rgba(212,133,74,0.08)', border: '1px solid rgba(212,133,74,0.2)' }}>
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#D4854A' }} />
                    <div>
                      <p className="font-dm text-sm font-medium mb-1" style={{ color: '#D4854A' }}>
                        Preencha seus dados corretamente
                      </p>
                      <p className="font-dm text-xs leading-relaxed" style={{ color: 'rgba(212,133,74,0.8)' }}>
                        O nome completo e o e-mail devem ser preenchidos corretamente. Se houver erro no preenchimento, o certificado não será gerado. O nome completo é o principal identificador para o acúmulo de horas.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField label="Nome completo *" value={nomeCompleto} onChange={setNomeCompleto} placeholder="Seu nome completo (exatamente como deseja no certificado)" />
                    <FormField label="Nome social (opcional)" value={nomeSocial} onChange={setNomeSocial} placeholder="Como prefere ser chamado(a)" />
                    <FormField label="E-mail *" value={email} onChange={setEmail} placeholder="seu@email.com" type="email" />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Atividade */}
              {step === 'atividade' && (
                <motion.div
                  key="atividade"
                  custom={direction}
                  variants={SLIDE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-fraunces font-bold text-xl mb-1" style={{ color: 'rgba(253,251,247,0.9)' }}>Atividade Participada</h2>
                    <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.35)' }}>Selecione a atividade que você participou</p>
                  </div>

                  {/* Active events */}
                  {eventos.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={14} style={{ color: '#C84B31' }} />
                        <span className="font-dm text-xs font-bold tracking-wider uppercase" style={{ color: '#C84B31' }}>Eventos</span>
                      </div>
                      {eventos.map((ev) => {
                        const sel = atividadeSelecionada === ev.titulo && isEvento
                        return (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => { setAtividadeSelecionada(ev.titulo); setIsEvento(true) }}
                            className="w-full text-left px-5 py-4 rounded-xl font-dm text-sm transition-all duration-200"
                            style={{
                              backgroundColor: sel ? 'rgba(200,75,49,0.12)' : 'rgba(200,75,49,0.04)',
                              border: `1.5px solid ${sel ? 'rgba(200,75,49,0.4)' : 'rgba(200,75,49,0.12)'}`,
                              color: sel ? '#C84B31' : 'rgba(253,251,247,0.7)',
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                style={{ borderColor: sel ? '#C84B31' : 'rgba(200,75,49,0.3)' }}
                              >
                                {sel && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#C84B31' }} />}
                              </div>
                              <div>
                                <span className="font-medium">{ev.titulo}</span>
                                {ev.descricao && (
                                  <p className="text-xs mt-0.5" style={{ color: 'rgba(253,251,247,0.35)' }}>{ev.descricao}</p>
                                )}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Regular activities */}
                  {eventos.length > 0 && atividades.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                      <span className="font-dm text-[10px] tracking-wider uppercase" style={{ color: 'rgba(253,251,247,0.2)' }}>Atividades regulares</span>
                      <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    {atividades.map((at) => {
                      const sel = atividadeSelecionada === at.nome && !isEvento
                      return (
                        <button
                          key={at.id}
                          type="button"
                          onClick={() => { setAtividadeSelecionada(at.nome); setIsEvento(false) }}
                          className="text-left px-5 py-4 rounded-xl font-dm text-sm transition-all duration-200"
                          style={{
                            backgroundColor: sel ? 'rgba(200,75,49,0.12)' : 'rgba(255,255,255,0.03)',
                            border: `1.5px solid ${sel ? 'rgba(200,75,49,0.4)' : 'rgba(255,255,255,0.06)'}`,
                            color: sel ? '#C84B31' : 'rgba(253,251,247,0.7)',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                style={{ borderColor: sel ? '#C84B31' : 'rgba(255,255,255,0.15)' }}
                              >
                                {sel && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#C84B31' }} />}
                              </div>
                              {at.nome}
                            </div>
                            <span className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(253,251,247,0.4)' }}>
                              {at.carga_horaria || 2}h
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Feedback */}
              {step === 'feedback' && (
                <motion.div
                  key="feedback"
                  custom={direction}
                  variants={SLIDE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {isEvento ? (
                    <>
                      <div>
                        <h2 className="font-fraunces font-bold text-xl mb-2" style={{ color: 'rgba(253,251,247,0.9)' }}>Feedback (opcional)</h2>
                        <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.4)' }}>
                          Conte-nos como foi sua experiência no evento <strong style={{ color: 'rgba(253,251,247,0.7)' }}>{atividadeSelecionada}</strong>.
                          Você pode pular este passo clicando em &quot;Enviar&quot;.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="font-dm text-sm font-medium block" style={{ color: 'rgba(253,251,247,0.7)' }}>
                          O que achou do evento?
                        </label>
                        <StarRating value={notaGrupo} onChange={setNotaGrupo} />
                      </div>

                      <div className="space-y-3">
                        <label className="font-dm text-sm font-medium block" style={{ color: 'rgba(253,251,247,0.7)' }}>
                          Deixe um relato sobre sua experiência
                        </label>
                        <textarea
                          value={relato}
                          onChange={(e) => setRelato(e.target.value)}
                          rows={4}
                          placeholder="Conte-nos como foi sua experiência..."
                          className="font-dm w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1.5px solid rgba(255,255,255,0.08)',
                            color: 'rgba(253,251,247,0.9)',
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(200,75,49,0.4)' }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h2 className="font-fraunces font-bold text-xl mb-2" style={{ color: 'rgba(253,251,247,0.9)' }}>Seu Feedback</h2>
                        <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.4)' }}>
                          Seu feedback é muito importante para a construção do aprimoramento contínuo da nossa formação. Ele nos ajuda a melhorar a qualidade dos grupos e oferecer um percurso cada vez mais qualificado para todos os envolvidos.
                        </p>
                        <p className="font-dm text-sm leading-relaxed mt-2" style={{ color: 'rgba(253,251,247,0.4)' }}>
                          Na Alos, todos estamos em constante formação, inclusive quem conduz os grupos.
                        </p>
                      </div>

                      {/* Group rating */}
                      <div className="space-y-3">
                        <label className="font-dm text-sm font-medium block" style={{ color: 'rgba(253,251,247,0.7)' }}>
                          O quanto você gostou do formato do grupo que você participou? *
                        </label>
                        <StarRating value={notaGrupo} onChange={setNotaGrupo} />
                      </div>

                      {/* Conductors */}
                      <div className="space-y-3">
                        <label className="font-dm text-sm font-medium block" style={{ color: 'rgba(253,251,247,0.7)' }}>
                          Quem conduziu o grupo? * <span className="font-normal" style={{ color: 'rgba(253,251,247,0.3)' }}>(selecione até 3)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {condutores.map((c) => {
                            const selected = condutoresSelecionados.includes(c.nome)
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => toggleCondutor(c.nome)}
                                className="px-4 py-2 rounded-full font-dm text-sm transition-all duration-200"
                                style={{
                                  backgroundColor: selected ? 'rgba(200,75,49,0.15)' : 'rgba(255,255,255,0.04)',
                                  border: `1px solid ${selected ? 'rgba(200,75,49,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                  color: selected ? '#C84B31' : 'rgba(253,251,247,0.6)',
                                  opacity: !selected && condutoresSelecionados.length >= 3 ? 0.4 : 1,
                                }}
                              >
                                {c.nome}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Conductor rating */}
                      {condutoresSelecionados.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                          <label className="font-dm text-sm font-medium block" style={{ color: 'rgba(253,251,247,0.7)' }}>
                            Qual nota você daria para quem conduziu o grupo? *
                          </label>
                          <StarRating value={notaCondutor} onChange={setNotaCondutor} />
                        </motion.div>
                      )}

                      {/* Free text */}
                      <div className="space-y-3">
                        <label className="font-dm text-sm font-medium block" style={{ color: 'rgba(253,251,247,0.7)' }}>
                          Faça um pequeno relato sobre sua experiência
                        </label>
                        <p className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.25)' }}>
                          Sugestões, críticas ou feedbacks. Esta resposta será anônima.
                        </p>
                        <textarea
                          value={relato}
                          onChange={(e) => setRelato(e.target.value)}
                          rows={4}
                          placeholder="Conte-nos como foi sua experiência..."
                          className="font-dm w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1.5px solid rgba(255,255,255,0.08)',
                            color: 'rgba(253,251,247,0.9)',
                          }}
                          onFocus={(e) => { e.target.style.borderColor = 'rgba(200,75,49,0.4)' }}
                          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'sucesso' && submitted && (
                <motion.div
                  key="sucesso"
                  custom={direction}
                  variants={SLIDE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(200,75,49,0.1)', border: '1px solid rgba(200,75,49,0.2)' }}
                    >
                      <CheckCircle2 size={32} style={{ color: '#C84B31' }} />
                    </motion.div>
                    <h2 className="font-fraunces font-bold text-2xl mb-2" style={{ color: 'rgba(253,251,247,0.95)' }}>
                      Participação registrada!
                    </h2>
                    <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.4)' }}>
                      +{atividadeHoras}h de <strong style={{ color: 'rgba(253,251,247,0.6)' }}>{atividadeSelecionada}</strong> adicionadas ao seu acumulado.
                    </p>
                  </div>

                  {/* Event: immediate certificate */}
                  {isEvento && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Download size={16} style={{ color: '#C84B31' }} />
                        <span className="font-dm text-sm font-medium" style={{ color: 'rgba(253,251,247,0.7)' }}>Certificado do Evento</span>
                      </div>
                      <CertificateGenerator
                        data={{
                          nomeParticipante: nomeCompleto,
                          atividade: atividadeSelecionada,
                          data: new Date().toISOString().split('T')[0],
                          cargaHoraria: atividadeHoras,
                          cargaHorariaExtenso: horasExtenso(atividadeHoras),
                        }}
                      />
                    </div>
                  )}

                  {/* Hours progress */}
                  {horasInfo && !claimed && (
                    <div className="rounded-xl p-5 space-y-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={16} style={{ color: '#C84B31' }} />
                        <span className="font-dm text-sm font-medium" style={{ color: 'rgba(253,251,247,0.7)' }}>Seu Acumulado Total</span>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.4)' }}>
                            {horasInfo.totalHoras}h de {HORAS_MINIMO}h necessárias
                          </span>
                          <span className="font-dm text-xs font-bold" style={{ color: horasInfo.liberado ? '#0EA5A0' : '#D4854A' }}>
                            {horasInfo.liberado ? 'Certificados liberados!' : `Faltam ${horasInfo.horasRestantes}h`}
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: horasInfo.liberado ? '#0EA5A0' : '#C84B31' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((horasInfo.totalHoras / HORAS_MINIMO) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </div>

                      {/* Hours by activity */}
                      {Object.keys(horasInfo.porAtividade).length > 0 && (
                        <div className="space-y-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <span className="font-dm text-xs font-medium" style={{ color: 'rgba(253,251,247,0.5)' }}>Suas participações acumuladas:</span>
                          {Object.entries(horasInfo.porAtividade).map(([nome, info]) => (
                            <div key={nome} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: nome === atividadeSelecionada ? 'rgba(200,75,49,0.06)' : 'rgba(255,255,255,0.02)' }}>
                              <div className="flex items-center gap-2">
                                {nome === atividadeSelecionada && <span className="font-dm text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(200,75,49,0.15)', color: '#C84B31' }}>agora</span>}
                                <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.6)' }}>{nome}</span>
                              </div>
                              <span className="font-dm text-xs font-bold" style={{ color: 'rgba(253,251,247,0.7)' }}>
                                {info.horas}h ({info.count} {info.count === 1 ? 'participação' : 'participações'})
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {!horasInfo.liberado && (
                        <p className="font-dm text-xs leading-relaxed" style={{ color: 'rgba(253,251,247,0.35)' }}>
                          Continue participando das atividades para acumular as {HORAS_MINIMO} horas necessárias.
                          Quando atingir o total, seus certificados ficarão disponíveis para download.
                        </p>
                      )}
                    </div>
                  )}

                  {loadingHoras && (
                    <div className="flex items-center justify-center py-4">
                      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: 'transparent' }} />
                    </div>
                  )}

                  {/* Certificates - only when hours >= 30 and not yet claimed */}
                  {horasInfo?.liberado && !claimed && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Award size={16} style={{ color: '#C84B31' }} />
                        <span className="font-dm text-sm font-medium" style={{ color: 'rgba(253,251,247,0.7)' }}>Seus Certificados</span>
                      </div>
                      <p className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.35)' }}>
                        Cada certificado corresponde a um tipo de atividade, com as horas acumuladas.
                        Ao clicar em &quot;Resgatar certificados&quot;, o contador será reiniciado.
                      </p>
                      {Object.entries(horasInfo.porAtividade).map(([nomeAtividade, info]) => (
                        <div key={nomeAtividade} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-dm text-sm font-medium" style={{ color: 'rgba(253,251,247,0.7)' }}>{nomeAtividade}</span>
                            <span className="font-dm text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(14,165,160,0.1)', color: '#0EA5A0' }}>
                              {info.horas}h acumuladas
                            </span>
                          </div>
                          <CertificateGenerator
                            data={{
                              nomeParticipante: nomeCompleto,
                              atividade: nomeAtividade === 'Avaliallos (Processo avaliativo)'
                                ? 'Monitoria formativa de psicoterapia'
                                : nomeAtividade,
                              data: new Date().toISOString().split('T')[0],
                              cargaHoraria: info.horas,
                              cargaHorariaExtenso: horasExtenso(info.horas),
                            }}
                          />
                        </div>
                      ))}

                      {/* Claim button: downloads done, reset cycle */}
                      <button
                        onClick={claimCertificates}
                        disabled={claiming}
                        className="w-full font-dm font-bold text-sm py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#0EA5A0', color: '#FFFFFF', boxShadow: '0 4px 20px rgba(14,165,160,0.3)' }}
                      >
                        <CheckCircle2 size={16} />
                        {claiming ? 'Resgatando...' : 'Resgatar certificados e reiniciar contador'}
                      </button>
                    </div>
                  )}

                  {/* After claiming: confirmation */}
                  {claimed && (
                    <div className="rounded-xl p-5 text-center space-y-3" style={{ backgroundColor: 'rgba(14,165,160,0.06)', border: '1px solid rgba(14,165,160,0.15)' }}>
                      <CheckCircle2 size={24} className="mx-auto" style={{ color: '#0EA5A0' }} />
                      <p className="font-dm text-sm font-medium" style={{ color: '#0EA5A0' }}>
                        Certificados resgatados com sucesso!
                      </p>
                      <p className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.4)' }}>
                        Seu contador foi reiniciado. Continue participando para acumular {HORAS_MINIMO}h novamente.
                      </p>
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="space-y-3">
                    <a
                      href="https://chat.whatsapp.com/JpZtYWJovU03VlrZJ5oUxQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-dm font-bold text-sm transition-all duration-300 hover:-translate-y-0.5"
                      style={{ background: '#25D366', color: '#FFFFFF', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Entrar no grupo de Formação Aberta
                    </a>

                    <a
                      href="/processo-seletivo"
                      className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-dm font-bold text-sm transition-all duration-300 hover:-translate-y-0.5"
                      style={{ background: 'rgba(200,75,49,0.12)', color: '#C84B31', border: '1px solid rgba(200,75,49,0.3)', boxShadow: '0 4px 20px rgba(200,75,49,0.1)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
                      </svg>
                      Conhecer o Processo Seletivo de Estágio e Bolsa
                    </a>
                  </div>

                  {/* Final message */}
                  <div className="rounded-xl p-5 space-y-3" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.5)' }}>
                      Lembre-se: este é apenas um dos grupos abertos dentro da Alos. Além deles, existem diversos outros grupos de estudo, projetos sociais e iniciativas de iniciação científica acontecendo em nossa comunidade.
                    </p>
                    <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.5)' }}>
                      Se você quiser participar mais ativamente, atender clinicamente com supervisão, realizar intervenções e ter acesso a todas as atividades que continuam crescendo dentro da Alos, considere se tornar associado.
                    </p>
                    <p className="font-dm text-sm font-medium" style={{ color: '#C84B31' }}>
                      Sua participação fortalece nossos projetos e amplia nosso impacto coletivo.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 md:px-8 pb-2">
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: 'rgba(200,75,49,0.08)', border: '1px solid rgba(200,75,49,0.15)' }}>
                <AlertCircle size={16} style={{ color: '#C84B31' }} />
                <span className="font-dm text-sm" style={{ color: '#C84B31' }}>{error}</span>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          {step !== 'sucesso' && (
            <div className="flex items-center justify-between p-6 md:p-8 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <button
                onClick={goBack}
                disabled={stepIndex === 0}
                className="flex items-center gap-2 font-dm text-sm transition-all duration-200"
                style={{
                  color: stepIndex === 0 ? 'rgba(253,251,247,0.15)' : 'rgba(253,251,247,0.5)',
                  cursor: stepIndex === 0 ? 'default' : 'pointer',
                }}
              >
                <ChevronLeft size={16} />
                Voltar
              </button>

              <button
                onClick={goNext}
                disabled={!canAdvance() || loading}
                className="flex items-center gap-2 font-dm text-sm font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: canAdvance() && !loading ? '#C84B31' : 'rgba(255,255,255,0.06)',
                  color: canAdvance() && !loading ? '#FFFFFF' : 'rgba(253,251,247,0.25)',
                  boxShadow: canAdvance() && !loading ? '0 4px 20px rgba(200,75,49,0.3)' : 'none',
                  cursor: canAdvance() && !loading ? 'pointer' : 'default',
                }}
              >
                {loading ? 'Enviando...' : step === 'feedback' ? (
                  <>Enviar <Send size={14} /></>
                ) : (
                  <>Próximo <ChevronRight size={14} /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function horasExtenso(h: number): string {
  const extenso: Record<number, string> = {
    1: 'uma', 2: 'duas', 3: 'três', 4: 'quatro', 5: 'cinco',
    6: 'seis', 7: 'sete', 8: 'oito', 9: 'nove', 10: 'dez',
    11: 'onze', 12: 'doze', 13: 'treze', 14: 'quatorze', 15: 'quinze',
    16: 'dezesseis', 17: 'dezessete', 18: 'dezoito', 19: 'dezenove', 20: 'vinte',
    21: 'vinte e uma', 22: 'vinte e duas', 23: 'vinte e três', 24: 'vinte e quatro',
    25: 'vinte e cinco', 26: 'vinte e seis', 27: 'vinte e sete', 28: 'vinte e oito',
    29: 'vinte e nove', 30: 'trinta', 31: 'trinta e uma', 32: 'trinta e duas',
    33: 'trinta e três', 34: 'trinta e quatro', 35: 'trinta e cinco',
    36: 'trinta e seis', 37: 'trinta e sete', 38: 'trinta e oito',
    39: 'trinta e nove', 40: 'quarenta', 50: 'cinquenta', 60: 'sessenta',
  }
  return extenso[h] || String(h)
}

function FormField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div>
      <label className="font-dm text-sm font-medium block mb-2" style={{ color: 'rgba(253,251,247,0.5)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-dm w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1.5px solid rgba(255,255,255,0.08)',
          color: 'rgba(253,251,247,0.9)',
        }}
        onFocus={(e) => { e.target.style.borderColor = 'rgba(200,75,49,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(200,75,49,0.08)' }}
        onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
      />
    </div>
  )
}
