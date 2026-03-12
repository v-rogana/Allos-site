'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Send, Download, AlertCircle, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import StarRating from './StarRating'
import CertificateGenerator from './CertificateGenerator'

interface Atividade {
  id: string
  nome: string
}

interface Condutor {
  id: string
  nome: string
}

type Step = 'identificacao' | 'atividade' | 'feedback' | 'sucesso'

export default function FormCertificado() {
  // Data from Supabase
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [condutores, setCondutores] = useState<Condutor[]>([])

  // Form state
  const [step, setStep] = useState<Step>('identificacao')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [nomeSocial, setNomeSocial] = useState('')
  const [email, setEmail] = useState('')
  const [atividadeSelecionada, setAtividadeSelecionada] = useState('')
  const [notaGrupo, setNotaGrupo] = useState(0)
  const [condutoresSelecionados, setCondutoresSelecionados] = useState<string[]>([])
  const [notaCondutor, setNotaCondutor] = useState(0)
  const [relato, setRelato] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [atRes, coRes] = await Promise.all([
      supabase.from('certificado_atividades').select('*').eq('ativo', true).order('nome'),
      supabase.from('certificado_condutores').select('*').eq('ativo', true).order('nome'),
    ])
    if (atRes.data) setAtividades(atRes.data)
    if (coRes.data) setCondutores(coRes.data)
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
      // Rate limiting: check submissions today
      const today = new Date().toISOString().split('T')[0]
      const { count } = await supabase
        .from('certificado_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('email', email.trim().toLowerCase())
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)

      if (count !== null && count >= 3) {
        setError('Você já gerou o número máximo de certificados hoje (3). Tente novamente amanhã.')
        setLoading(false)
        return
      }

      // Submit
      const { error: submitError } = await supabase
        .from('certificado_submissions')
        .insert({
          nome_completo: nomeCompleto.trim(),
          nome_social: nomeSocial.trim() || null,
          email: email.trim().toLowerCase(),
          atividade_nome: atividadeSelecionada,
          nota_grupo: notaGrupo,
          condutores: condutoresSelecionados,
          nota_condutor: notaCondutor,
          relato: relato.trim() || null,
          certificado_gerado: true,
        })

      if (submitError) throw submitError

      setSubmitted(true)
      setStep('sucesso')
    } catch (err) {
      console.error(err)
      setError('Erro ao enviar o formulário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const steps: Step[] = ['identificacao', 'atividade', 'feedback', 'sucesso']
  const stepIndex = steps.indexOf(step)

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
  }

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
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="font-fraunces font-bold text-xl mb-1" style={{ color: 'rgba(253,251,247,0.9)' }}>Seus Dados</h2>
                    <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.35)' }}>Informe seus dados para gerar o certificado</p>
                  </div>

                  <div className="space-y-4">
                    <FormField label="Nome completo *" value={nomeCompleto} onChange={setNomeCompleto} placeholder="Seu nome completo" />
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
                  variants={slideVariants}
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

                  <div className="grid grid-cols-1 gap-3">
                    {atividades.map((at) => (
                      <button
                        key={at.id}
                        type="button"
                        onClick={() => setAtividadeSelecionada(at.nome)}
                        className="text-left px-5 py-4 rounded-xl font-dm text-sm transition-all duration-200"
                        style={{
                          backgroundColor: atividadeSelecionada === at.nome ? 'rgba(200,75,49,0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1.5px solid ${atividadeSelecionada === at.nome ? 'rgba(200,75,49,0.4)' : 'rgba(255,255,255,0.06)'}`,
                          color: atividadeSelecionada === at.nome ? '#C84B31' : 'rgba(253,251,247,0.7)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{
                              borderColor: atividadeSelecionada === at.nome ? '#C84B31' : 'rgba(255,255,255,0.15)',
                            }}
                          >
                            {atividadeSelecionada === at.nome && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#C84B31' }} />
                            )}
                          </div>
                          {at.nome}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Feedback */}
              {step === 'feedback' && (
                <motion.div
                  key="feedback"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
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
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'sucesso' && submitted && (
                <motion.div
                  key="sucesso"
                  custom={direction}
                  variants={slideVariants}
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
                    <h2 className="font-fraunces font-bold text-2xl mb-3" style={{ color: 'rgba(253,251,247,0.95)' }}>
                      Obrigado por participar!
                    </h2>
                  </div>

                  {/* Certificate */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Download size={16} style={{ color: '#C84B31' }} />
                      <span className="font-dm text-sm font-medium" style={{ color: 'rgba(253,251,247,0.7)' }}>Seu Certificado</span>
                    </div>
                    <CertificateGenerator
                      data={{
                        nomeParticipante: nomeCompleto,
                        atividade: atividadeSelecionada,
                        data: new Date().toISOString().split('T')[0],
                      }}
                    />
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
