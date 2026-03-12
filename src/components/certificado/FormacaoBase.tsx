'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, Plus, Trash2, Eye, EyeOff, X, AlertTriangle,
  RefreshCw, Image as ImageIcon, Download, ChevronDown,
  CheckCircle2, XCircle, MinusCircle, Calendar
} from 'lucide-react'

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'] as const
const DIAS_SHORT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'] as const

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pendente: { label: 'Pendente', color: 'rgba(253,251,247,0.4)', bg: 'rgba(255,255,255,0.04)', icon: <MinusCircle size={14} /> },
  conduzido: { label: 'Conduzido', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', icon: <CheckCircle2 size={14} /> },
  nao_conduzido: { label: 'Não conduzido', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <XCircle size={14} /> },
  cancelado: { label: 'Cancelado', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <XCircle size={14} /> },
}

interface Horario { id: string; hora: string; ordem: number; ativo: boolean }
interface Slot {
  id: string; dia_semana: number; horario_id: string; ativo: boolean; status: string
  atividade_nome: string | null
  formacao_horarios: { hora: string; ordem: number } | null
}
interface Alocacao {
  id: string; slot_id: string; condutor_id: string
  certificado_condutores: { id: string; nome: string; telefone: string | null } | null
}
interface Condutor { id: string; nome: string; ativo: boolean; telefone: string | null }
interface Atividade { id: string; nome: string; ativo: boolean }

type SubTab = 'calendario' | 'horarios' | 'cronograma'

interface FormacaoBaseProps {
  atividades?: Atividade[]
}

export default function FormacaoBase({ atividades = [] }: FormacaoBaseProps) {
  const [subTab, setSubTab] = useState<SubTab>('calendario')
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [alocacoes, setAlocacoes] = useState<Alocacao[]>([])
  const [condutores, setCondutores] = useState<Condutor[]>([])
  const [loading, setLoading] = useState(true)

  const [newHora, setNewHora] = useState('')
  const [addingCondutor, setAddingCondutor] = useState<string | null>(null) // slot_id
  const cronogramaCanvasRef = useRef<HTMLCanvasElement>(null)
  const logoRef = useRef<HTMLImageElement | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }, [])

  const api = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch('/api/certificados/formacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    const [hRes, sRes, aRes, cRes] = await Promise.all([
      fetch('/api/certificados/formacao?type=horarios').then(r => r.json()),
      fetch('/api/certificados/formacao?type=slots').then(r => r.json()),
      fetch('/api/certificados/formacao?type=alocacoes').then(r => r.json()),
      fetch('/api/certificados/formacao?type=condutores').then(r => r.json()),
    ])
    if (Array.isArray(hRes)) setHorarios(hRes)
    if (Array.isArray(sRes)) setSlots(sRes)
    if (Array.isArray(aRes)) setAlocacoes(aRes)
    if (Array.isArray(cRes)) setCondutores(cRes)
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // ─── Derived data ──────────────────────────────────────────────
  const activeHorarios = useMemo(() => horarios.filter(h => h.ativo).sort((a, b) => a.ordem - b.ordem), [horarios])

  const slotMap = useMemo(() => {
    const map = new Map<string, Slot>()
    slots.forEach(s => map.set(`${s.dia_semana}-${s.horario_id}`, s))
    return map
  }, [slots])

  const alocacaoMap = useMemo(() => {
    const map = new Map<string, Alocacao[]>()
    alocacoes.forEach(a => {
      const list = map.get(a.slot_id) || []
      list.push(a)
      map.set(a.slot_id, list)
    })
    return map
  }, [alocacoes])

  // ─── Horário CRUD ──────────────────────────────────────────────
  async function addHorario() {
    if (!newHora.trim()) return
    await api({ action: 'create_horario', hora: newHora.trim() })
    setNewHora('')
    loadData()
    showToast('Horário adicionado')
  }

  function confirmDeleteHorario(h: Horario) {
    setConfirmModal({
      title: 'Excluir Horário',
      message: `Excluir o horário ${h.hora}? Todos os grupos nesse horário serão removidos.`,
      onConfirm: async () => {
        setActionLoading(true)
        await api({ action: 'delete_horario', id: h.id })
        setConfirmModal(null)
        setActionLoading(false)
        loadData()
        showToast('Horário excluído')
      },
    })
  }

  // ─── Slot toggle ───────────────────────────────────────────────
  async function toggleSlot(dia: number, horarioId: string) {
    const key = `${dia}-${horarioId}`
    const existing = slotMap.get(key)
    if (existing) {
      await api({ action: 'update_slot', id: existing.id, ativo: !existing.ativo })
    } else {
      await api({ action: 'create_slot', dia_semana: dia, horario_id: horarioId })
    }
    loadData()
  }

  async function updateSlotStatus(slotId: string, status: string) {
    await api({ action: 'update_slot', id: slotId, status })
    loadData()
  }

  function confirmDeleteSlot(slot: Slot) {
    setConfirmModal({
      title: 'Excluir Grupo',
      message: 'Excluir este grupo e todas as alocações associadas?',
      onConfirm: async () => {
        setActionLoading(true)
        await api({ action: 'delete_slot', id: slot.id })
        setConfirmModal(null)
        setActionLoading(false)
        loadData()
        showToast('Grupo excluído')
      },
    })
  }

  // ─── Alocação ──────────────────────────────────────────────────
  async function addAlocacao(slotId: string, condutorId: string) {
    await api({ action: 'add_alocacao', slot_id: slotId, condutor_id: condutorId })
    setAddingCondutor(null)
    loadData()
    showToast('Condutor alocado')
  }

  async function removeAlocacao(alocId: string) {
    await api({ action: 'remove_alocacao', id: alocId })
    loadData()
  }

  // ─── Atividade no slot ───────────────────────────────────────────
  async function setSlotAtividade(slotId: string, atividade_nome: string | null) {
    await api({ action: 'update_slot', id: slotId, atividade_nome })
    loadData()
  }

  // ─── Cronograma auto-generate ────────────────────────────────
  // Load logo once
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => { logoRef.current = img }
    img.src = '/Icone_Allos_Verde.png'
  }, [])

  const cronogramaData = useMemo(() => {
    const dias = [0, 1, 2, 3, 4]
    const result: { dia: string; items: string[] }[] = []
    dias.forEach(d => {
      const items: string[] = []
      activeHorarios.forEach(h => {
        const slot = slotMap.get(`${d}-${h.id}`)
        if (slot && slot.ativo && slot.atividade_nome) {
          items.push(`${h.hora.replace(':00', 'h')}:  ${slot.atividade_nome}`)
        }
      })
      if (items.length > 0) {
        result.push({ dia: DIAS[d], items })
      }
    })
    return result
  }, [activeHorarios, slotMap])

  function drawCronograma() {
    const canvas = cronogramaCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 1080
    const rowH = 80
    const headerH = 200
    const footerH = 80
    // Calculate total rows height
    let totalItemsH = 0
    cronogramaData.forEach(d => { totalItemsH += Math.max(rowH, d.items.length * 28 + 40) })
    const H = headerH + 50 + totalItemsH + footerH + 40
    canvas.width = W
    canvas.height = H

    // Background - teal gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, '#1a6b63')
    grad.addColorStop(1, '#14524c')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Subtle noise texture overlay
    ctx.save()
    ctx.globalAlpha = 0.04
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000'
      ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1)
    }
    ctx.restore()

    const cx = W / 2

    // Logo
    const logo = logoRef.current
    if (logo) {
      const logoH = 80
      const logoW = (logo.naturalWidth / logo.naturalHeight) * logoH
      ctx.drawImage(logo, cx - logoW / 2, 25, logoW, logoH)
    }

    // "ASSOCIAÇÃO" text under logo
    ctx.textAlign = 'center'
    ctx.font = '600 14px "DM Sans", Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.letterSpacing = '4px'
    ctx.fillText('— ASSOCIAÇÃO —', cx, 125)

    // "QUADRO DE HORÁRIOS" header bar
    const barY = 150
    const barH = 42
    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(60, barY, W - 120, barH)
    ctx.font = 'bold 18px "DM Sans", Arial, sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.letterSpacing = '3px'
    ctx.fillText('QUADRO DE HORÁRIOS', cx, barY + 28)

    // Table rows
    let y = barY + barH + 16
    const tableX = 60
    const tableW = W - 120
    const labelW = 140

    cronogramaData.forEach(d => {
      const itemH = Math.max(rowH, d.items.length * 28 + 30)

      // Row background
      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.fillRect(tableX, y, tableW, itemH)

      // Separator line
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(tableX, y + itemH)
      ctx.lineTo(tableX + tableW, y + itemH)
      ctx.stroke()

      // Day label bg
      ctx.fillStyle = 'rgba(0,0,0,0.04)'
      ctx.fillRect(tableX, y, labelW, itemH)

      // Day label
      ctx.textAlign = 'center'
      ctx.font = 'bold 15px "DM Sans", Arial, sans-serif'
      ctx.fillStyle = '#1a1a1a'
      ctx.fillText(d.dia.toUpperCase(), tableX + labelW / 2, y + itemH / 2 + 5)

      // Vertical separator
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'
      ctx.beginPath()
      ctx.moveTo(tableX + labelW, y)
      ctx.lineTo(tableX + labelW, y + itemH)
      ctx.stroke()

      // Items
      ctx.textAlign = 'left'
      ctx.font = '14px "DM Sans", Arial, sans-serif'
      ctx.fillStyle = '#333333'
      const startItemY = y + 22
      d.items.forEach((item, i) => {
        // Bullet
        ctx.fillStyle = '#1a6b63'
        ctx.beginPath()
        ctx.arc(tableX + labelW + 24, startItemY + i * 28 - 4, 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#333333'
        ctx.font = '14px "DM Sans", Arial, sans-serif'
        ctx.fillText(item, tableX + labelW + 36, startItemY + i * 28)
      })

      y += itemH
    })

    // Footer
    ctx.textAlign = 'center'
    ctx.font = 'italic 16px "DM Sans", Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillText('Cronograma Geral', cx, y + 50)
  }

  function downloadCronograma() {
    drawCronograma()
    const canvas = cronogramaCanvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'cronograma_allos.png'
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
    showToast('Cronograma baixado')
  }

  // ─── Reset statuses ────────────────────────────────────────────
  function confirmResetStatuses() {
    setConfirmModal({
      title: 'Resetar Status',
      message: 'Resetar o status de todos os grupos para "Pendente"? Use isso no início de uma nova semana.',
      onConfirm: async () => {
        setActionLoading(true)
        await api({ action: 'reset_statuses' })
        setConfirmModal(null)
        setActionLoading(false)
        loadData()
        showToast('Status resetados')
      },
    })
  }

  // ─── Stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const activeSlots = slots.filter(s => s.ativo)
    const withAtividade = activeSlots.filter(s => s.atividade_nome)
    const atividadeCount = new Map<string, { total: number; conduzidos: number }>()
    withAtividade.forEach(s => {
      const name = s.atividade_nome!
      const cur = atividadeCount.get(name) || { total: 0, conduzidos: 0 }
      cur.total++
      if (s.status === 'conduzido') cur.conduzidos++
      atividadeCount.set(name, cur)
    })
    return {
      total: activeSlots.length,
      conduzidos: activeSlots.filter(s => s.status === 'conduzido').length,
      naoCond: activeSlots.filter(s => s.status === 'nao_conduzido').length,
      cancelados: activeSlots.filter(s => s.status === 'cancelado').length,
      pendentes: activeSlots.filter(s => s.status === 'pendente').length,
      atividadeCount,
    }
  }, [slots])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(200,75,49,0.3)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl font-dm text-sm"
            style={{ backgroundColor: 'rgba(200,75,49,0.9)', color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => !actionLoading && setConfirmModal(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl p-6 space-y-5"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(200,75,49,0.1)' }}>
                  <AlertTriangle size={20} style={{ color: '#C84B31' }} />
                </div>
                <h3 className="font-fraunces font-bold text-lg" style={{ color: 'rgba(253,251,247,0.9)' }}>{confirmModal.title}</h3>
              </div>
              <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.5)' }}>{confirmModal.message}</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmModal(null)} disabled={actionLoading}
                  className="font-dm text-sm px-5 py-2.5 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(253,251,247,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Cancelar
                </button>
                <button onClick={confirmModal.onConfirm} disabled={actionLoading}
                  className="font-dm text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2"
                  style={{ backgroundColor: '#C84B31', color: '#fff' }}>
                  {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MiniStat label="Grupos" value={stats.total} color="rgba(253,251,247,0.6)" />
        <MiniStat label="Conduzidos" value={stats.conduzidos} color="#22c55e" />
        <MiniStat label="Não conduzidos" value={stats.naoCond} color="#f59e0b" />
        <MiniStat label="Cancelados" value={stats.cancelados} color="#ef4444" />
        <MiniStat label="Pendentes" value={stats.pendentes} color="rgba(253,251,247,0.4)" />
      </div>

      {/* Activity stats */}
      {stats.atividadeCount.size > 0 && (
        <div className="flex flex-wrap gap-2">
          {Array.from(stats.atividadeCount.entries()).map(([name, { total, conduzidos }]) => (
            <div key={name} className="flex items-center gap-2 px-3 py-1.5 rounded-full font-dm text-xs"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(253,251,247,0.5)' }}>
              <span style={{ color: '#C84B31' }}>{name}</span>
              <span>{conduzidos}/{total}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: 'calendario', label: 'Calendário', icon: <Calendar size={14} /> },
          { key: 'horarios', label: 'Horários', icon: <Clock size={14} /> },
          { key: 'cronograma', label: 'Cronograma', icon: <ImageIcon size={14} /> },
        ] as { key: SubTab; label: string; icon: React.ReactNode }[]).map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)}
            className="font-dm text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all"
            style={{
              backgroundColor: subTab === t.key ? 'rgba(200,75,49,0.12)' : 'rgba(255,255,255,0.03)',
              color: subTab === t.key ? '#C84B31' : 'rgba(253,251,247,0.4)',
              border: `1px solid ${subTab === t.key ? 'rgba(200,75,49,0.3)' : 'rgba(255,255,255,0.06)'}`,
            }}>
            {t.icon} {t.label}
          </button>
        ))}

        <button onClick={confirmResetStatuses}
          className="font-dm text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition-all ml-auto"
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(253,251,247,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <RefreshCw size={14} /> Nova Semana
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ─── Calendário ──────────────────────────────────────── */}
        {subTab === 'calendario' && (
          <motion.div key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {activeHorarios.length === 0 ? (
              <EmptyBox icon={<Clock size={36} />} message="Nenhum horário cadastrado" hint="Vá na aba Horários para adicionar" />
            ) : (
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <table className="w-full border-collapse" style={{ minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th className="font-dm text-xs font-medium text-left p-3" style={{ color: 'rgba(253,251,247,0.3)', backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        Horário
                      </th>
                      {DIAS.map((d, i) => (
                        <th key={i} className="font-dm text-xs font-medium text-center p-3"
                          style={{ color: 'rgba(253,251,247,0.4)', backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
                          <span className="hidden md:inline">{d}</span>
                          <span className="md:hidden">{DIAS_SHORT[i]}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeHorarios.map(h => (
                      <tr key={h.id}>
                        <td className="font-dm text-sm font-bold p-3 whitespace-nowrap"
                          style={{ color: '#C84B31', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {h.hora}
                        </td>
                        {DIAS.map((_, dia) => {
                          const slot = slotMap.get(`${dia}-${h.id}`)
                          const slotActive = slot?.ativo !== false
                          const slotAlocs = slot ? (alocacaoMap.get(slot.id) || []) : []
                          const st = slot ? STATUS_CONFIG[slot.status] || STATUS_CONFIG.pendente : STATUS_CONFIG.pendente

                          return (
                            <td key={dia} className="p-2 align-top"
                              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: '1px solid rgba(255,255,255,0.04)', minWidth: 120 }}>
                              {!slot ? (
                                // No slot - show add button
                                <button onClick={() => toggleSlot(dia, h.id)}
                                  className="w-full h-20 rounded-lg flex items-center justify-center transition-all hover:bg-white/[0.03]"
                                  style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
                                  <Plus size={16} style={{ color: 'rgba(253,251,247,0.15)' }} />
                                </button>
                              ) : !slotActive ? (
                                // Disabled slot
                                <div className="w-full h-20 rounded-lg flex flex-col items-center justify-center gap-1"
                                  style={{ backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                  <EyeOff size={14} style={{ color: 'rgba(253,251,247,0.1)' }} />
                                  <div className="flex gap-1">
                                    <button onClick={() => toggleSlot(dia, h.id)} className="p-1 rounded"
                                      style={{ color: 'rgba(253,251,247,0.2)' }} title="Ativar">
                                      <Eye size={12} />
                                    </button>
                                    <button onClick={() => confirmDeleteSlot(slot)} className="p-1 rounded"
                                      style={{ color: 'rgba(253,251,247,0.15)' }} title="Excluir">
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // Active slot
                                <div className="rounded-lg p-2 space-y-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: `1px solid ${slot.status === 'conduzido' ? 'rgba(34,197,94,0.2)' : slot.status === 'cancelado' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}` }}>
                                  {/* Status badge */}
                                  <div className="flex items-center justify-between">
                                    <StatusDropdown status={slot.status} onChange={(s) => updateSlotStatus(slot.id, s)} />
                                    <div className="flex gap-0.5">
                                      <button onClick={() => toggleSlot(dia, h.id)} className="p-0.5 rounded"
                                        style={{ color: 'rgba(253,251,247,0.2)' }} title="Desativar">
                                        <EyeOff size={10} />
                                      </button>
                                      <button onClick={() => confirmDeleteSlot(slot)} className="p-0.5 rounded"
                                        style={{ color: 'rgba(253,251,247,0.15)' }} title="Excluir">
                                        <Trash2 size={10} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Atividade dropdown */}
                                  <DarkSelect
                                    value={slot.atividade_nome || ''}
                                    onChange={v => setSlotAtividade(slot.id, v || null)}
                                    placeholder="— atividade —"
                                    options={atividades.filter(a => a.ativo).map(a => ({ value: a.nome, label: a.nome }))}
                                    activeColor={slot.atividade_nome ? '#C84B31' : undefined}
                                    size="xs"
                                  />

                                  {/* Condutores */}
                                  <div className="space-y-1">
                                    {slotAlocs.map(aloc => (
                                      <div key={aloc.id} className="flex items-center gap-1 group">
                                        <span className="font-dm text-[11px] flex-1 truncate" style={{ color: 'rgba(253,251,247,0.7)' }}>
                                          {aloc.certificado_condutores?.nome}
                                        </span>
                                        {aloc.certificado_condutores?.telefone && (
                                          <a href={`https://wa.me/55${aloc.certificado_condutores.telefone.replace(/\D/g, '')}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="WhatsApp">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                          </a>
                                        )}
                                        <button onClick={() => removeAlocacao(aloc.id)}
                                          className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                          style={{ color: 'rgba(253,251,247,0.2)' }} title="Remover">
                                          <X size={10} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Add condutor */}
                                  {addingCondutor === slot.id ? (
                                    <DarkSelect
                                      value=""
                                      onChange={v => { if (v) addAlocacao(slot.id, v) }}
                                      onClose={() => setAddingCondutor(null)}
                                      placeholder="Selecionar..."
                                      options={condutores
                                        .filter(c => !slotAlocs.some(a => a.condutor_id === c.id))
                                        .map(c => ({ value: c.id, label: c.nome }))}
                                      size="xs"
                                      autoOpen
                                    />
                                  ) : (
                                    <button onClick={() => setAddingCondutor(slot.id)}
                                      className="w-full font-dm text-[10px] py-1 rounded transition-all hover:bg-white/[0.03] flex items-center justify-center gap-1"
                                      style={{ color: 'rgba(253,251,247,0.2)', border: '1px dashed rgba(255,255,255,0.06)' }}>
                                      <Plus size={10} /> Condutor
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Horários ────────────────────────────────────────── */}
        {subTab === 'horarios' && (
          <motion.div key="horarios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card title="Gerenciar Horários" icon={<Clock size={16} />}>
              <div className="flex gap-2 mb-6">
                <input value={newHora} onChange={e => setNewHora(e.target.value)}
                  placeholder="Ex: 14:00"
                  onKeyDown={e => e.key === 'Enter' && addHorario()}
                  className="font-dm flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.9)' }} />
                <button onClick={addHorario} className="px-4 py-3 rounded-xl font-dm text-sm font-bold"
                  style={{ backgroundColor: '#C84B31', color: '#fff' }}>
                  <Plus size={16} />
                </button>
              </div>
              {horarios.length > 0 ? (
                <div className="space-y-2">
                  {horarios.sort((a, b) => a.ordem - b.ordem).map(h => (
                    <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <Clock size={14} style={{ color: '#C84B31' }} />
                      <span className="font-dm text-sm flex-1 font-medium"
                        style={{ color: h.ativo ? 'rgba(253,251,247,0.7)' : 'rgba(253,251,247,0.25)' }}>
                        {h.hora}
                      </span>
                      <button onClick={async () => { await api({ action: 'update_horario', id: h.id, ativo: !h.ativo }); loadData() }}
                        className="p-1.5 rounded-lg transition-all" style={{ color: h.ativo ? '#C84B31' : 'rgba(253,251,247,0.2)' }}>
                        {h.ativo ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={() => confirmDeleteHorario(h)}
                        className="p-1.5 rounded-lg transition-all hover:bg-red-500/10" style={{ color: 'rgba(253,251,247,0.2)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyBox icon={<Clock size={36} />} message="Nenhum horário cadastrado" hint="Adicione horários como 14:00, 16:00, 19:00" />
              )}
            </Card>
          </motion.div>
        )}

        {/* ─── Cronograma Auto-gerado ──────────────────────────── */}
        {subTab === 'cronograma' && (
          <motion.div key="cronograma" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card title="Cronograma — Gerado Automaticamente" icon={<ImageIcon size={16} />}>
              <p className="font-dm text-xs mb-4" style={{ color: 'rgba(253,251,247,0.3)' }}>
                A arte é gerada a partir dos dados do calendário. Defina a atividade de cada grupo na aba Calendário.
              </p>

              {cronogramaData.length > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <canvas ref={cronogramaCanvasRef} className="w-full h-auto" style={{ maxWidth: '100%', display: 'block' }} />
                  </div>
                  <CronogramaAutoRender canvasRef={cronogramaCanvasRef} draw={drawCronograma} deps={[cronogramaData, logoRef.current]} />
                  <button onClick={downloadCronograma}
                    className="w-full font-dm text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                    style={{ backgroundColor: '#C84B31', color: '#fff', boxShadow: '0 4px 20px rgba(200,75,49,0.35)' }}>
                    <Download size={16} /> Baixar Cronograma (PNG)
                  </button>
                </div>
              ) : (
                <EmptyBox icon={<ImageIcon size={36} />}
                  message="Nenhum grupo com atividade definida"
                  hint="Vá na aba Calendário e defina a atividade de cada grupo para gerar o cronograma" />
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Helper Components ─────────────────────────────────────────────

function StatusDropdown({ status, onChange }: { status: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false)
  const st = STATUS_CONFIG[status] || STATUS_CONFIG.pendente

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-dm font-medium transition-all"
        style={{ backgroundColor: st.bg, color: st.color }}>
        {st.icon}
        <span className="hidden sm:inline">{st.label}</span>
        <ChevronDown size={8} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 rounded-lg py-1 min-w-[130px]"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button key={key} onClick={() => { onChange(key); setOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-1.5 font-dm text-xs transition-all hover:bg-white/[0.04]"
                style={{ color: cfg.color }}>
                {cfg.icon} {cfg.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
      <span className="font-fraunces font-bold text-xl" style={{ color }}>{value}</span>
      <p className="font-dm text-[10px] mt-0.5" style={{ color: 'rgba(253,251,247,0.3)' }}>{label}</p>
    </div>
  )
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2 mb-5">
        <span style={{ color: '#C84B31' }}>{icon}</span>
        <h3 className="font-dm text-sm font-medium" style={{ color: 'rgba(253,251,247,0.6)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function CronogramaAutoRender({ draw, deps }: { canvasRef: React.RefObject<HTMLCanvasElement | null>; draw: () => void; deps: unknown[] }) {
  useEffect(() => { draw() }, deps) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

function EmptyBox({ icon, message, hint }: { icon: React.ReactNode; message: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-xl"
      style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ color: 'rgba(253,251,247,0.08)' }}>{icon}</span>
      <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>{message}</p>
      {hint && <p className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.15)' }}>{hint}</p>}
    </div>
  )
}

function DarkSelect({ value, onChange, onClose, placeholder, options, activeColor, size = 'xs', autoOpen = false }: {
  value: string; onChange: (v: string) => void; onClose?: () => void
  placeholder: string; options: { value: string; label: string }[]
  activeColor?: string; size?: 'xs' | 'sm'; autoOpen?: boolean
}) {
  const [open, setOpen] = useState(autoOpen)
  const selected = options.find(o => o.value === value)
  const fontSize = size === 'xs' ? 'text-[10px]' : 'text-xs'
  const py = size === 'xs' ? 'py-0.5 px-1.5' : 'py-1.5 px-3'

  return (
    <div className="relative w-full">
      <button onClick={() => setOpen(!open)}
        className={`w-full font-dm ${fontSize} ${py} rounded outline-none cursor-pointer truncate text-left flex items-center justify-between gap-1`}
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: activeColor || (selected && value ? 'rgba(253,251,247,0.7)' : 'rgba(253,251,247,0.2)') }}>
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown size={size === 'xs' ? 8 : 10} className="flex-shrink-0" style={{ opacity: 0.4 }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => { setOpen(false); onClose?.() }} />
          <div className="absolute top-full left-0 mt-1 z-20 w-full max-h-40 overflow-y-auto rounded-lg py-1"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
            {!autoOpen && (
              <button onClick={() => { onChange(''); setOpen(false); onClose?.() }}
                className={`w-full text-left font-dm ${fontSize} px-3 py-1.5 transition-all hover:bg-white/[0.06]`}
                style={{ color: 'rgba(253,251,247,0.3)' }}>
                {placeholder}
              </button>
            )}
            {options.map(o => (
              <button key={o.value} onClick={() => { onChange(o.value); setOpen(false); onClose?.() }}
                className={`w-full text-left font-dm ${fontSize} px-3 py-1.5 transition-all hover:bg-white/[0.06]`}
                style={{ color: o.value === value ? '#C84B31' : 'rgba(253,251,247,0.7)' }}>
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
