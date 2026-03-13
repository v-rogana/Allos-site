'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, Users, FileText, Star, TrendingUp,
  Plus, Trash2, Eye, EyeOff, ChevronRight,
  Award, MessageSquare, Search, Download, CheckSquare, Square,
  X, AlertTriangle, RefreshCw, Filter, Check, Edit3, Phone, ChevronDown,
  Upload
} from 'lucide-react'
const CertificateGenerator = dynamic(() => import('./CertificateGenerator'), { ssr: false })
import FormacaoBase from './FormacaoBase'

// ─── Types ─────────────────────────────────────────────────────────

interface Submission {
  id: string
  nome_completo: string
  nome_social: string | null
  email: string
  atividade_nome: string
  nota_grupo: number
  condutores: string[]
  nota_condutor: number
  relato: string | null
  created_at: string
}

interface Atividade {
  id: string
  nome: string
  ativo: boolean
}

interface Condutor {
  id: string
  nome: string
  ativo: boolean
  telefone: string | null
  observacoes: string | null
}

type Tab = 'dashboard' | 'condutores' | 'atividades' | 'envios' | 'formacao'
type TimeFilter = 'month' | 'quarter' | 'semester' | 'year' | 'all'

const TAB_LABELS: Record<Tab, string> = {
  dashboard: 'Dashboard',
  condutores: 'Condutores',
  atividades: 'Atividades',
  envios: 'Envios',
  formacao: 'Formação',
}

const TIME_LABELS: Record<TimeFilter, string> = {
  month: 'Este Mês',
  quarter: 'Trimestre',
  semester: 'Semestre',
  year: 'Ano',
  all: 'Todos',
}

function getFilterDate(filter: TimeFilter): Date | null {
  const now = new Date()
  switch (filter) {
    case 'month': return new Date(now.getFullYear(), now.getMonth(), 1)
    case 'quarter': return new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
    case 'semester': return new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1)
    case 'year': return new Date(now.getFullYear(), 0, 1)
    case 'all': return null
  }
}

const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// ─── Main Component ────────────────────────────────────────────────

export default function AdminCertificados() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [condutores, setCondutores] = useState<Condutor[]>([])
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month')
  const [loading, setLoading] = useState(true)

  // Envios state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [filterAtividade, setFilterAtividade] = useState('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [certificatePreview, setCertificatePreview] = useState<Submission | null>(null)

  // Condutores state
  const [editingCondutor, setEditingCondutor] = useState<Condutor | null>(null)
  const [newCondutorNome, setNewCondutorNome] = useState('')
  const [selectedCondutor, setSelectedCondutor] = useState<string | null>(null)

  // Atividades state
  const [newAtividade, setNewAtividade] = useState('')

  // Import CSV state
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // UI state
  const [confirmModal, setConfirmModal] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }, [])

  const adminApi = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch('/api/certificados/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.json()
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    const [subRes, atRes, coRes] = await Promise.all([
      fetch('/api/certificados/admin?type=submissions').then(r => r.json()),
      fetch('/api/certificados/admin?type=atividades').then(r => r.json()),
      fetch('/api/certificados/admin?type=condutores').then(r => r.json()),
    ])
    if (Array.isArray(subRes)) setSubmissions(subRes)
    if (Array.isArray(atRes)) setAtividades(atRes)
    if (Array.isArray(coRes)) setCondutores(coRes)
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // ─── Filtered data ─────────────────────────────────────────────
  const filteredSubmissions = useMemo(() => {
    const d = getFilterDate(timeFilter)
    if (!d) return submissions
    return submissions.filter(s => new Date(s.created_at) >= d)
  }, [submissions, timeFilter])

  const visibleSubmissions = useMemo(() => {
    let list = submissions
    if (searchTerm) {
      const t = searchTerm.toLowerCase()
      list = list.filter(s => s.nome_completo.toLowerCase().includes(t) || s.email.toLowerCase().includes(t))
    }
    if (filterAtividade !== 'all') list = list.filter(s => s.atividade_nome === filterAtividade)
    if (filterDateFrom) list = list.filter(s => s.created_at.split('T')[0] >= filterDateFrom)
    if (filterDateTo) list = list.filter(s => s.created_at.split('T')[0] <= filterDateTo)
    return list
  }, [submissions, searchTerm, filterAtividade, filterDateFrom, filterDateTo])

  // ─── Dashboard metrics ─────────────────────────────────────────
  const allTimeMetrics = useMemo(() => {
    const s = submissions
    const total = s.length
    const avgGroup = total > 0 ? s.reduce((a, x) => a + x.nota_grupo, 0) / total : 0
    const avgCond = total > 0 ? s.reduce((a, x) => a + x.nota_condutor, 0) / total : 0
    const relatos = s.filter(x => x.relato).length
    return { total, avgGroup, avgCond, relatos }
  }, [submissions])

  const metrics = useMemo(() => {
    const s = filteredSubmissions
    const total = s.length
    const avgGroup = total > 0 ? s.reduce((a, x) => a + x.nota_grupo, 0) / total : 0
    const avgCond = total > 0 ? s.reduce((a, x) => a + x.nota_condutor, 0) / total : 0
    const relatos = s.filter(x => x.relato).length

    // Conductor ranking with Bayesian average:
    // score = (C * m + sum_ratings) / (C + count)
    // C = minimum confidence (we use median count), m = global avg rating
    const cMap = new Map<string, { sum: number; count: number }>()
    s.forEach(x => x.condutores?.forEach(c => {
      const e = cMap.get(c) || { sum: 0, count: 0 }
      e.sum += x.nota_condutor; e.count++
      cMap.set(c, e)
    }))
    const allCounts = Array.from(cMap.values()).map(d => d.count).sort((a, b) => a - b)
    const C = allCounts.length > 0 ? allCounts[Math.floor(allCounts.length / 2)] : 1
    const globalAvg = avgCond
    const conductorRanking = Array.from(cMap.entries())
      .map(([name, d]) => {
        const avg = d.sum / d.count
        const score = (C * globalAvg + d.sum) / (C + d.count)
        return { name, avg, count: d.count, score }
      })
      .sort((a, b) => b.score - a.score || b.count - a.count)

    // Activity distribution
    const aMap = new Map<string, number>()
    s.forEach(x => aMap.set(x.atividade_nome, (aMap.get(x.atividade_nome) || 0) + 1))
    const activityDist = Array.from(aMap.entries()).map(([n, c]) => ({ name: n, count: c })).sort((a, b) => b.count - a.count)

    // Period comparison: how this period compares to the previous equivalent period
    const filterDate = getFilterDate(timeFilter)
    let prevTotal = 0
    let prevAvgGroup = 0
    let prevAvgCond = 0
    if (filterDate && timeFilter !== 'all') {
      const now = new Date()
      const periodMs = now.getTime() - filterDate.getTime()
      const prevStart = new Date(filterDate.getTime() - periodMs)
      const prevSubs = submissions.filter(x => {
        const d = new Date(x.created_at)
        return d >= prevStart && d < filterDate
      })
      prevTotal = prevSubs.length
      prevAvgGroup = prevSubs.length > 0 ? prevSubs.reduce((a, x) => a + x.nota_grupo, 0) / prevSubs.length : 0
      prevAvgCond = prevSubs.length > 0 ? prevSubs.reduce((a, x) => a + x.nota_condutor, 0) / prevSubs.length : 0
    }

    return { total, avgGroup, avgCond, relatos, conductorRanking, activityDist, prevTotal, prevAvgGroup, prevAvgCond }
  }, [filteredSubmissions, submissions, timeFilter])

  // ─── Conductor detail ──────────────────────────────────────────
  const conductorDetail = useMemo(() => {
    if (!selectedCondutor) return null
    const s = filteredSubmissions.filter(x => x.condutores?.includes(selectedCondutor))
    const avg = s.length > 0 ? s.reduce((a, x) => a + x.nota_condutor, 0) / s.length : 0
    const relatos = s.filter(x => x.relato).map(x => ({ text: x.relato!, date: x.created_at }))
    return { name: selectedCondutor, avg, total: s.length, relatos }
  }, [selectedCondutor, filteredSubmissions])

  // ─── Sync atividades from feedbacks ────────────────────────────
  async function syncAtividades() {
    const res = await adminApi({ action: 'sync_atividades' })
    loadData()
    if (res.added > 0) showToast(`${res.added} atividade${res.added > 1 ? 's' : ''} importada${res.added > 1 ? 's' : ''} (desativadas — publique as que quiser)`)
    else showToast('Todas as atividades já estão cadastradas')
  }

  // ─── CRUD: Atividades ──────────────────────────────────────────
  async function addAtividade() {
    if (!newAtividade.trim()) return
    await adminApi({ action: 'create_atividade', nome: newAtividade.trim() })
    setNewAtividade('')
    loadData()
    showToast('Atividade adicionada')
  }

  async function toggleAtividade(id: string, ativo: boolean) {
    await adminApi({ action: 'toggle_atividade', id, ativo: !ativo })
    loadData()
  }

  function confirmDeleteAtividade(id: string, nome: string) {
    setConfirmModal({
      title: 'Excluir Atividade',
      message: `Excluir "${nome}"?`,
      onConfirm: async () => { await adminApi({ action: 'delete_atividade', id }); setConfirmModal(null); loadData(); showToast('Excluída') },
    })
  }

  // ─── CRUD: Condutores ──────────────────────────────────────────
  async function syncCondutores() {
    const res = await adminApi({ action: 'sync_condutores' })
    loadData()
    if (res.added > 0) showToast(`${res.added} condutor${res.added > 1 ? 'es' : ''} importado${res.added > 1 ? 's' : ''} dos feedbacks`)
    else showToast('Todos os condutores já estão cadastrados')
  }

  async function addCondutor() {
    if (!newCondutorNome.trim()) return
    await adminApi({ action: 'create_condutor', nome: newCondutorNome.trim() })
    setNewCondutorNome('')
    loadData()
    showToast('Condutor adicionado')
  }

  async function saveCondutor() {
    if (!editingCondutor) return
    await adminApi({
      action: 'update_condutor',
      id: editingCondutor.id,
      nome: editingCondutor.nome.trim(),
      telefone: editingCondutor.telefone?.trim() || null,
      observacoes: editingCondutor.observacoes?.trim() || null,
    })
    setEditingCondutor(null)
    loadData()
    showToast('Condutor atualizado')
  }

  async function toggleCondutor(id: string, ativo: boolean) {
    await adminApi({ action: 'toggle_condutor', id, ativo: !ativo })
    loadData()
  }

  function confirmDeleteCondutor(id: string, nome: string) {
    setConfirmModal({
      title: 'Excluir Condutor',
      message: `Excluir "${nome}"?`,
      onConfirm: async () => { await adminApi({ action: 'delete_condutor', id }); setConfirmModal(null); loadData(); showToast('Excluído') },
    })
  }

  // ─── Submissions ───────────────────────────────────────────────
  function confirmDeleteSubmission(id: string, nome: string) {
    setConfirmModal({
      title: 'Excluir Envio',
      message: `Excluir envio de "${nome}"?`,
      onConfirm: async () => {
        setActionLoading(true)
        await adminApi({ action: 'delete_submissions', ids: [id] })
        setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n })
        setConfirmModal(null); setActionLoading(false); loadData(); showToast('Excluído')
      },
    })
  }

  function confirmBulkDelete() {
    const c = selectedIds.size
    if (!c) return
    setConfirmModal({
      title: `Excluir ${c} envio${c > 1 ? 's' : ''}`,
      message: `Excluir ${c} envio${c > 1 ? 's' : ''} selecionado${c > 1 ? 's' : ''}?`,
      onConfirm: async () => {
        setActionLoading(true)
        await adminApi({ action: 'delete_submissions', ids: Array.from(selectedIds) })
        setSelectedIds(new Set()); setConfirmModal(null); setActionLoading(false); loadData(); showToast(`${c} excluído${c > 1 ? 's' : ''}`)
      },
    })
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }

  function exportCSV() {
    const esc = (v: string) => v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v
    const h = 'Nome,Email,Atividade,Nota Grupo,Condutores,Nota Condutor,Relato,Data'
    const rows = visibleSubmissions.map(s => [esc(s.nome_completo), esc(s.email), esc(s.atividade_nome), s.nota_grupo, esc((s.condutores || []).join('; ')), s.nota_condutor, esc(s.relato || ''), new Date(s.created_at).toLocaleDateString('pt-BR')].join(','))
    const blob = new Blob(['\uFEFF' + h + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `envios_${new Date().toISOString().split('T')[0]}.csv`; a.click()
    showToast('CSV exportado')
  }

  // ─── Import CSV from Google Forms ─────────────────────────────
  function parseCSV(text: string): Record<string, string>[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim())
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase())
    const rows: Record<string, string>[] = []
    for (let i = 1; i < lines.length; i++) {
      const values: string[] = []
      let current = ''
      let inQuotes = false
      for (const ch of lines[i]) {
        if (ch === '"') { inQuotes = !inQuotes }
        else if (ch === ',' && !inQuotes) { values.push(current.trim()); current = '' }
        else { current += ch }
      }
      values.push(current.trim())
      const row: Record<string, string> = {}
      headers.forEach((h, idx) => { row[h] = (values[idx] || '').replace(/^"|"$/g, '') })
      rows.push(row)
    }
    return rows
  }

  function findColumn(row: Record<string, string>, keywords: string[]): string {
    for (const key of Object.keys(row)) {
      const k = key.toLowerCase()
      if (keywords.some(kw => k.includes(kw))) return row[key]
    }
    return ''
  }

  async function handleImportCSV(file: File) {
    setImporting(true)
    setImportResult(null)
    try {
      const text = await file.text()
      const rows = parseCSV(text)
      if (rows.length === 0) { showToast('Arquivo vazio ou formato inválido'); setImporting(false); return }

      let success = 0
      let errors = 0

      for (const row of rows) {
        const nome = findColumn(row, ['nome completo', 'nome_completo', 'nome', 'name', 'full name'])
        const email = findColumn(row, ['email', 'e-mail', 'mail'])
        const atividade = findColumn(row, ['atividade', 'activity', 'grupo', 'group'])
        const notaGrupoStr = findColumn(row, ['nota grupo', 'nota_grupo', 'group rating', 'nota do grupo', 'formato do grupo'])
        const notaCondStr = findColumn(row, ['nota condutor', 'nota_condutor', 'conductor rating', 'nota do condutor', 'conduziu'])
        const condutoresStr = findColumn(row, ['condutor', 'condutores', 'quem conduziu'])
        const relato = findColumn(row, ['relato', 'experiência', 'experiencia', 'feedback', 'comentário', 'comentario', 'sugest'])

        if (!nome && !email) { errors++; continue }

        const notaGrupo = parseInt(notaGrupoStr) || 0
        const notaCondutor = parseInt(notaCondStr) || 0
        const condutores = condutoresStr ? condutoresStr.split(/[;,]/).map(c => c.trim()).filter(Boolean) : []

        try {
          await adminApi({
            action: 'import_submission',
            nome_completo: nome.trim(),
            email: (email || '').trim().toLowerCase(),
            atividade_nome: atividade.trim() || 'Importado',
            nota_grupo: Math.min(notaGrupo, 10),
            nota_condutor: Math.min(notaCondutor, 10),
            condutores,
            relato: relato.trim() || null,
          })
          success++
        } catch {
          errors++
        }
      }

      setImportResult({ success, errors })
      showToast(`Importados: ${success} | Erros: ${errors}`)
      loadData()
    } catch {
      showToast('Erro ao processar arquivo')
    } finally {
      setImporting(false)
    }
  }

  const uniqueAtividades = useMemo(() => Array.from(new Set(submissions.map(s => s.atividade_nome))).sort(), [submissions])
  const hasFilters = filterAtividade !== 'all' || filterDateFrom || filterDateTo

  // ─── Render ────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A1A1A' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(200,75,49,0.3)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#1A1A1A' }}>
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
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl p-6 space-y-4"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} style={{ color: '#C84B31' }} />
                <h3 className="font-fraunces font-bold" style={{ color: 'rgba(253,251,247,0.9)' }}>{confirmModal.title}</h3>
              </div>
              <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.5)' }}>{confirmModal.message}</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmModal(null)} disabled={actionLoading} className="font-dm text-sm px-4 py-2 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(253,251,247,0.5)' }}>Cancelar</button>
                <button onClick={confirmModal.onConfirm} disabled={actionLoading} className="font-dm text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2"
                  style={{ backgroundColor: '#C84B31', color: '#fff' }}>
                  {actionLoading && <RefreshCw size={14} className="animate-spin" />} Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {certificatePreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setCertificatePreview(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-3xl rounded-2xl p-6 space-y-4"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-fraunces font-bold" style={{ color: 'rgba(253,251,247,0.9)' }}>Certificado</h3>
                <button onClick={() => setCertificatePreview(null)} style={{ color: 'rgba(253,251,247,0.4)' }}><X size={18} /></button>
              </div>
              <CertificateGenerator data={{ nomeParticipante: certificatePreview.nome_completo, atividade: certificatePreview.atividade_nome, data: certificatePreview.created_at.split('T')[0] }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Condutor Modal */}
      <AnimatePresence>
        {editingCondutor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setEditingCondutor(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-2xl p-6 space-y-4"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="font-fraunces font-bold" style={{ color: 'rgba(253,251,247,0.9)' }}>Editar Condutor</h3>
              <div className="space-y-3">
                <div>
                  <label className="font-dm text-xs mb-1 block" style={{ color: 'rgba(253,251,247,0.3)' }}>Nome</label>
                  <input value={editingCondutor.nome} onChange={e => setEditingCondutor({ ...editingCondutor, nome: e.target.value })}
                    className="w-full font-dm text-sm px-4 py-2.5 rounded-xl outline-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.9)' }} />
                </div>
                <div>
                  <label className="font-dm text-xs mb-1 block" style={{ color: 'rgba(253,251,247,0.3)' }}>Telefone</label>
                  <input value={editingCondutor.telefone || ''} onChange={e => setEditingCondutor({ ...editingCondutor, telefone: e.target.value })}
                    placeholder="31999999999"
                    className="w-full font-dm text-sm px-4 py-2.5 rounded-xl outline-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.9)' }} />
                </div>
                <div>
                  <label className="font-dm text-xs mb-1 block" style={{ color: 'rgba(253,251,247,0.3)' }}>Observações</label>
                  <textarea value={editingCondutor.observacoes || ''} onChange={e => setEditingCondutor({ ...editingCondutor, observacoes: e.target.value })}
                    rows={3} placeholder="Observações sobre o condutor..."
                    className="w-full font-dm text-sm px-4 py-2.5 rounded-xl outline-none resize-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.9)' }} />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditingCondutor(null)} className="font-dm text-sm px-4 py-2 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(253,251,247,0.5)' }}>Cancelar</button>
                <button onClick={saveCondutor} className="font-dm text-sm font-bold px-4 py-2 rounded-xl"
                  style={{ backgroundColor: '#C84B31', color: '#fff' }}>Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-fraunces font-bold text-lg" style={{ color: 'rgba(253,251,247,0.9)' }}>Admin</h1>
          <button onClick={() => { sessionStorage.removeItem('certificados_admin'); window.location.reload() }}
            className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>Sair</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b overflow-x-auto" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
            <button key={t} onClick={() => { setTab(t); setSelectedCondutor(null) }}
              className="font-dm text-sm px-4 py-3 whitespace-nowrap relative"
              style={{ color: tab === t ? '#C84B31' : 'rgba(253,251,247,0.4)' }}>
              {TAB_LABELS[t]}
              {tab === t && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#C84B31' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Time filter for dashboard */}
        {tab === 'dashboard' && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(TIME_LABELS) as TimeFilter[]).map(f => (
              <button key={f} onClick={() => setTimeFilter(f)} className="font-dm text-xs px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: timeFilter === f ? 'rgba(200,75,49,0.12)' : 'rgba(255,255,255,0.03)',
                  color: timeFilter === f ? '#C84B31' : 'rgba(253,251,247,0.4)',
                  border: `1px solid ${timeFilter === f ? 'rgba(200,75,49,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}>{TIME_LABELS[f]}</button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ─── Dashboard ──────────────────────────────────────── */}
          {tab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatWithDelta icon={<FileText size={16} />} label="Feedbacks" value={metrics.total} prev={metrics.prevTotal} isCount timeFilter={timeFilter} />
                <StatWithDelta icon={<Star size={16} />} label="Nota Grupo" value={metrics.avgGroup} prev={metrics.prevAvgGroup} suffix="/10" timeFilter={timeFilter} />
                <StatWithDelta icon={<Users size={16} />} label="Nota Condutores" value={metrics.avgCond} prev={metrics.prevAvgCond} suffix="/10" timeFilter={timeFilter} />
                <Stat icon={<MessageSquare size={16} />} label="Relatos" value={`${metrics.relatos}/${metrics.total}`} suffix={metrics.total > 0 ? `(${Math.round(metrics.relatos / metrics.total * 100)}%)` : ''} />
              </div>

              {timeFilter !== 'all' && (
                <div className="px-4 py-2.5 rounded-xl font-dm text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: 'rgba(253,251,247,0.3)' }}>
                  Mostrando {metrics.total} de {allTimeMetrics.total} feedbacks ({TIME_LABELS[timeFilter].toLowerCase()}) · Média geral histórica: grupo {allTimeMetrics.avgGroup.toFixed(1)}, condutores {allTimeMetrics.avgCond.toFixed(1)}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Atividades" icon={<Award size={16} />}>
                  {metrics.activityDist.length > 0 ? metrics.activityDist.map(a => {
                    const pct = metrics.total > 0 ? (a.count / metrics.total) * 100 : 0
                    return (
                      <div key={a.name} className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.6)' }}>{a.name}</span>
                          <span className="font-dm text-xs font-bold" style={{ color: '#C84B31' }}>{a.count} <span style={{ color: 'rgba(253,251,247,0.25)' }}>({pct.toFixed(0)}%)</span></span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: 'rgba(200,75,49,0.5)' }} />
                        </div>
                      </div>
                    )
                  }) : <Empty message="Sem dados" />}
                </Card>

                <Card title="Ranking Condutores" icon={<TrendingUp size={16} />}>
                  {metrics.conductorRanking.length > 0 ? metrics.conductorRanking.slice(0, 10).map((c, i) => (
                    <button key={c.name} onClick={() => { setSelectedCondutor(c.name); setTab('condutores') }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.02]">
                      <span className="font-dm text-sm font-bold w-5" style={{ color: i < 3 ? '#C84B31' : 'rgba(253,251,247,0.3)' }}>{i + 1}</span>
                      <span className="font-dm text-sm flex-1 text-left" style={{ color: 'rgba(253,251,247,0.7)' }}>{c.name}</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#C84B31" stroke="#C84B31" />
                        <span className="font-dm text-sm font-bold" style={{ color: '#C84B31' }}>{c.avg.toFixed(1)}</span>
                      </div>
                      <span className="font-dm text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(253,251,247,0.4)' }}>{c.count}x</span>
                    </button>
                  )) : <Empty message="Sem dados" />}
                  {metrics.conductorRanking.length > 0 && (
                    <p className="font-dm text-[10px] mt-2 pt-2" style={{ color: 'rgba(253,251,247,0.15)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      Ranking pondera nota e volume de avaliações
                    </p>
                  )}
                </Card>
              </div>
            </motion.div>
          )}

          {/* ─── Condutores (unified) ───────────────────────────── */}
          {tab === 'condutores' && (
            <motion.div key="cond" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Conductor detail view */}
              {selectedCondutor && conductorDetail ? (
                <div className="space-y-4">
                  <button onClick={() => setSelectedCondutor(null)} className="font-dm text-xs flex items-center gap-1"
                    style={{ color: 'rgba(253,251,247,0.4)' }}>
                    <ChevronRight size={12} className="rotate-180" /> Voltar
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-fraunces font-bold text-lg"
                      style={{ backgroundColor: 'rgba(200,75,49,0.12)', color: '#C84B31' }}>{conductorDetail.name[0]}</div>
                    <div>
                      <h2 className="font-fraunces font-bold" style={{ color: 'rgba(253,251,247,0.9)' }}>{conductorDetail.name}</h2>
                      <div className="flex items-center gap-2">
                        <Star size={12} fill="#C84B31" stroke="#C84B31" />
                        <span className="font-dm text-sm font-bold" style={{ color: '#C84B31' }}>{conductorDetail.avg.toFixed(1)}</span>
                        <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>{conductorDetail.total} feedbacks</span>
                      </div>
                    </div>
                  </div>
                  <Card title="Relatos" icon={<MessageSquare size={16} />}>
                    {conductorDetail.relatos.length > 0 ? conductorDetail.relatos.map((r, i) => (
                      <div key={i} className="p-3 rounded-lg mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <p className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.6)' }}>&ldquo;{r.text}&rdquo;</p>
                        <p className="font-dm text-xs mt-1" style={{ color: 'rgba(253,251,247,0.2)' }}>{new Date(r.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )) : <Empty message="Nenhum relato" />}
                  </Card>
                </div>
              ) : (
                <>
                  {/* Add new */}
                  <div className="flex gap-2">
                    <input value={newCondutorNome} onChange={e => setNewCondutorNome(e.target.value)}
                      placeholder="Novo condutor..." onKeyDown={e => e.key === 'Enter' && addCondutor()}
                      className="font-dm flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.9)' }} />
                    <button onClick={addCondutor} className="px-4 py-3 rounded-xl" style={{ backgroundColor: '#C84B31', color: '#fff' }}>
                      <Plus size={16} />
                    </button>
                    <button onClick={syncCondutores} className="font-dm text-xs px-4 py-3 rounded-xl flex items-center gap-1.5"
                      style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(253,251,247,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
                      title="Importar condutores que aparecem nos feedbacks">
                      <RefreshCw size={14} /> Sincronizar dos feedbacks
                    </button>
                  </div>

                  {/* List */}
                  <div className="space-y-2">
                    {condutores.map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', opacity: c.ativo ? 1 : 0.4 }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-dm text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: 'rgba(200,75,49,0.12)', color: '#C84B31' }}>{c.nome[0]}</div>
                        <div className="flex-1 min-w-0">
                          <span className="font-dm text-sm font-medium block truncate" style={{ color: 'rgba(253,251,247,0.8)' }}>{c.nome}</span>
                          {c.telefone && (
                            <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>{c.telefone}</span>
                          )}
                          {c.observacoes && (
                            <span className="font-dm text-xs block truncate italic" style={{ color: 'rgba(253,251,247,0.2)' }}>{c.observacoes}</span>
                          )}
                        </div>
                        {/* WhatsApp */}
                        {c.telefone && (
                          <a href={`https://wa.me/55${c.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-green-500/10 flex-shrink-0" title="WhatsApp">
                            {WA_ICON}
                          </a>
                        )}
                        {/* Ranking link */}
                        <button onClick={() => setSelectedCondutor(c.nome)} className="p-1.5 rounded-lg hover:bg-white/[0.04] flex-shrink-0"
                          style={{ color: 'rgba(253,251,247,0.2)' }} title="Ver feedbacks">
                          <BarChart3 size={14} />
                        </button>
                        {/* Edit */}
                        <button onClick={() => setEditingCondutor({ ...c })} className="p-1.5 rounded-lg hover:bg-white/[0.04] flex-shrink-0"
                          style={{ color: 'rgba(253,251,247,0.2)' }} title="Editar">
                          <Edit3 size={14} />
                        </button>
                        {/* Toggle */}
                        <button onClick={() => toggleCondutor(c.id, c.ativo)} className="p-1.5 rounded-lg flex-shrink-0"
                          style={{ color: c.ativo ? '#C84B31' : 'rgba(253,251,247,0.2)' }}>
                          {c.ativo ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        {/* Delete */}
                        <button onClick={() => confirmDeleteCondutor(c.id, c.nome)} className="p-1.5 rounded-lg hover:bg-red-500/10 flex-shrink-0"
                          style={{ color: 'rgba(253,251,247,0.15)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {condutores.length === 0 && <Empty message="Nenhum condutor" />}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ─── Atividades ─────────────────────────────────────── */}
          {tab === 'atividades' && (
            <motion.div key="ativ" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex gap-2">
                <input value={newAtividade} onChange={e => setNewAtividade(e.target.value)}
                  placeholder="Nova atividade..." onKeyDown={e => e.key === 'Enter' && addAtividade()}
                  className="font-dm flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.9)' }} />
                <button onClick={addAtividade} className="px-4 py-3 rounded-xl" style={{ backgroundColor: '#C84B31', color: '#fff' }}>
                  <Plus size={16} />
                </button>
                <button onClick={syncAtividades} className="font-dm text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 whitespace-nowrap"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(253,251,247,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
                  title="Importar atividades dos feedbacks (desativadas por padrão)">
                  <RefreshCw size={14} /> Sincronizar dos feedbacks
                </button>
              </div>
              <p className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.25)' }}>
                <Eye size={11} className="inline mb-0.5" style={{ color: '#C84B31' }} /> = publicada no formulário de certificação &nbsp;
                <EyeOff size={11} className="inline mb-0.5" /> = oculta (não aparece no formulário)
              </p>
              <div className="space-y-2">
                {atividades.map(a => {
                  const feedbackCount = submissions.filter(s => s.atividade_nome === a.nome).length
                  return (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="font-dm text-sm flex-1" style={{ color: a.ativo ? 'rgba(253,251,247,0.7)' : 'rgba(253,251,247,0.25)' }}>{a.nome}</span>
                    {feedbackCount > 0 && (
                      <span className="font-dm text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(200,75,49,0.08)', color: 'rgba(200,75,49,0.6)' }}>
                        {feedbackCount} feedback{feedbackCount > 1 ? 's' : ''}
                      </span>
                    )}
                    <button onClick={() => toggleAtividade(a.id, a.ativo)} className="p-1.5 rounded-lg"
                      style={{ color: a.ativo ? '#C84B31' : 'rgba(253,251,247,0.2)' }}>
                      {a.ativo ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => confirmDeleteAtividade(a.id, a.nome)} className="p-1.5 rounded-lg hover:bg-red-500/10"
                      style={{ color: 'rgba(253,251,247,0.15)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  )
                })}
                {atividades.length === 0 && <Empty message="Nenhuma atividade" />}
              </div>
            </motion.div>
          )}

          {/* ─── Envios ─────────────────────────────────────────── */}
          {tab === 'envios' && (
            <motion.div key="envios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Search + Filters */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Search size={14} style={{ color: 'rgba(253,251,247,0.3)' }} />
                <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar..."
                  className="flex-1 bg-transparent font-dm text-sm outline-none" style={{ color: 'rgba(253,251,247,0.8)' }} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DarkSelect
                  value={filterAtividade}
                  onChange={v => setFilterAtividade(v)}
                  placeholder="Todas atividades"
                  options={[
                    { value: 'all', label: 'Todas atividades' },
                    ...uniqueAtividades.map(a => ({ value: a, label: a })),
                  ]}
                  size="sm"
                />
                <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
                  className="font-dm text-xs px-2 py-1.5 rounded-lg outline-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.7)' }} />
                <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>até</span>
                <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
                  className="font-dm text-xs px-2 py-1.5 rounded-lg outline-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.7)' }} />
                {hasFilters && (
                  <button onClick={() => { setFilterAtividade('all'); setFilterDateFrom(''); setFilterDateTo('') }}
                    className="font-dm text-xs flex items-center gap-1" style={{ color: '#C84B31' }}>
                    <X size={12} /> Limpar
                  </button>
                )}
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={selectedIds.size === visibleSubmissions.length && visibleSubmissions.length > 0 ? () => setSelectedIds(new Set()) : () => setSelectedIds(new Set(visibleSubmissions.map(s => s.id)))}
                  className="font-dm text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(253,251,247,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {selectedIds.size > 0 ? <CheckSquare size={12} /> : <Square size={12} />}
                  {selectedIds.size > 0 ? `${selectedIds.size} selecionados` : 'Selecionar'}
                </button>
                {selectedIds.size > 0 && (
                  <button onClick={confirmBulkDelete} className="font-dm text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#ef4444' }}>
                    <Trash2 size={12} /> Excluir
                  </button>
                )}
                <label className="font-dm text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer ml-auto"
                  style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#C84B31', border: '1px solid rgba(200,75,49,0.2)' }}>
                  <Upload size={12} /> {importing ? 'Importando...' : 'Importar Forms'}
                  <input type="file" accept=".csv" className="hidden" ref={fileInputRef}
                    disabled={importing}
                    onChange={e => { const f = e.target.files?.[0]; if (f) { handleImportCSV(f); if (fileInputRef.current) fileInputRef.current.value = '' } }} />
                </label>
                <button onClick={exportCSV} className="font-dm text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(253,251,247,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Download size={12} /> CSV
                </button>
              </div>

              {/* List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {visibleSubmissions.map(s => (
                  <div key={s.id} className="flex gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: selectedIds.has(s.id) ? 'rgba(200,75,49,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedIds.has(s.id) ? 'rgba(200,75,49,0.15)' : 'rgba(255,255,255,0.04)'}` }}>
                    <button onClick={() => toggleSelect(s.id)} className="flex-shrink-0 mt-0.5"
                      style={{ color: selectedIds.has(s.id) ? '#C84B31' : 'rgba(253,251,247,0.15)' }}>
                      {selectedIds.has(s.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-dm text-sm font-medium truncate" style={{ color: 'rgba(253,251,247,0.8)' }}>{s.nome_completo}</span>
                        <span className="font-dm text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#C84B31' }}>{s.atividade_nome}</span>
                      </div>
                      <p className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>{s.email} · {new Date(s.created_at).toLocaleDateString('pt-BR')}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>Grupo: {s.nota_grupo}/10</span>
                        <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>Condutor: {s.nota_condutor}/10</span>
                        {s.condutores?.length > 0 && <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.2)' }}>{s.condutores.join(', ')}</span>}
                      </div>
                      {s.relato && <p className="font-dm text-xs mt-1 italic" style={{ color: 'rgba(253,251,247,0.3)' }}>&ldquo;{s.relato}&rdquo;</p>}
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button onClick={() => setCertificatePreview(s)} className="p-1 rounded-lg hover:bg-white/[0.05]"
                        style={{ color: 'rgba(253,251,247,0.3)' }} title="Certificado"><Download size={13} /></button>
                      <button onClick={() => confirmDeleteSubmission(s.id, s.nome_completo)} className="p-1 rounded-lg hover:bg-red-500/10"
                        style={{ color: 'rgba(253,251,247,0.15)' }} title="Excluir"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
                {visibleSubmissions.length === 0 && <Empty message={hasFilters || searchTerm ? 'Nenhum resultado' : 'Nenhum envio'} />}
              </div>
            </motion.div>
          )}

          {/* ─── Formação ───────────────────────────────────────── */}
          {tab === 'formacao' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FormacaoBase atividades={atividades} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Helpers ───────────────────────────────────────────────────────

function Stat({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: string | number; suffix?: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2 mb-2" style={{ color: '#C84B31' }}>
        {icon}
        <span className="font-dm text-xs uppercase tracking-wider" style={{ color: 'rgba(253,251,247,0.3)' }}>{label}</span>
      </div>
      <span className="font-fraunces font-bold text-2xl" style={{ color: 'rgba(253,251,247,0.9)' }}>{value}</span>
      {suffix && <span className="font-dm text-sm ml-1" style={{ color: 'rgba(253,251,247,0.3)' }}>{suffix}</span>}
    </div>
  )
}

function StatWithDelta({ icon, label, value, prev, suffix, isCount, timeFilter }: {
  icon: React.ReactNode; label: string; value: number; prev: number; suffix?: string; isCount?: boolean; timeFilter: TimeFilter
}) {
  const display = isCount ? value : value.toFixed(1)
  const delta = prev > 0 ? ((value - prev) / prev) * 100 : 0
  const showDelta = timeFilter !== 'all' && prev > 0
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2 mb-2" style={{ color: '#C84B31' }}>
        {icon}
        <span className="font-dm text-xs uppercase tracking-wider" style={{ color: 'rgba(253,251,247,0.3)' }}>{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-fraunces font-bold text-2xl" style={{ color: 'rgba(253,251,247,0.9)' }}>{display}</span>
        {suffix && <span className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>{suffix}</span>}
      </div>
      {showDelta && (
        <div className="flex items-center gap-1 mt-1.5">
          <TrendingUp size={11} style={{ color: delta >= 0 ? '#22c55e' : '#ef4444', transform: delta < 0 ? 'scaleY(-1)' : 'none' }} />
          <span className="font-dm text-[10px] font-medium" style={{ color: delta >= 0 ? '#22c55e' : '#ef4444' }}>
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
          </span>
          <span className="font-dm text-[10px]" style={{ color: 'rgba(253,251,247,0.2)' }}>vs período anterior</span>
        </div>
      )}
    </div>
  )
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: '#C84B31' }}>{icon}</span>
        <h3 className="font-dm text-sm font-medium" style={{ color: 'rgba(253,251,247,0.6)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Empty({ message }: { message: string }) {
  return <p className="font-dm text-sm text-center py-8" style={{ color: 'rgba(253,251,247,0.2)' }}>{message}</p>
}

function DarkSelect({ value, onChange, placeholder, options, size = 'sm' }: {
  value: string; onChange: (v: string) => void
  placeholder: string; options: { value: string; label: string }[]
  size?: 'xs' | 'sm'
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)
  const fontSize = size === 'xs' ? 'text-[10px]' : 'text-xs'
  const py = size === 'xs' ? 'py-0.5 px-1.5' : 'py-1.5 px-3'

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={`font-dm ${fontSize} ${py} rounded-lg outline-none cursor-pointer flex items-center gap-1.5`}
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.7)' }}>
        <span>{selected?.label || placeholder}</span>
        <ChevronDown size={10} style={{ opacity: 0.4 }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 min-w-full max-h-48 overflow-y-auto rounded-lg py-1"
            style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
            {options.map(o => (
              <button key={o.value} onClick={() => { onChange(o.value); setOpen(false) }}
                className={`w-full text-left font-dm ${fontSize} px-3 py-1.5 whitespace-nowrap transition-all hover:bg-white/[0.06]`}
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
