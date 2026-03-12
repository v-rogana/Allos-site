'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, Users, FileText, Settings, Star, TrendingUp,
  Plus, Trash2, Eye, EyeOff, ChevronDown, ChevronRight,
  Award, MessageSquare, Search
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  created_at: string
}

interface Condutor {
  id: string
  nome: string
  ativo: boolean
  created_at: string
}

type Tab = 'dashboard' | 'condutores-view' | 'atividades' | 'condutores' | 'submissions'
type TimeFilter = 'day' | 'month' | 'quarter' | 'semester' | 'year' | 'all'

const TAB_LABELS: Record<Tab, string> = {
  'dashboard': 'Dashboard',
  'condutores-view': 'Condutores',
  'atividades': 'Atividades',
  'condutores': 'Gestão Condutores',
  'submissions': 'Envios',
}

const TIME_LABELS: Record<TimeFilter, string> = {
  'day': 'Hoje',
  'month': 'Este Mês',
  'quarter': 'Trimestre',
  'semester': 'Semestre',
  'year': 'Ano',
  'all': 'Todos',
}

function getFilterDate(filter: TimeFilter): Date | null {
  const now = new Date()
  switch (filter) {
    case 'day': return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    case 'month': return new Date(now.getFullYear(), now.getMonth(), 1)
    case 'quarter': {
      const q = Math.floor(now.getMonth() / 3) * 3
      return new Date(now.getFullYear(), q, 1)
    }
    case 'semester': {
      const s = now.getMonth() < 6 ? 0 : 6
      return new Date(now.getFullYear(), s, 1)
    }
    case 'year': return new Date(now.getFullYear(), 0, 1)
    case 'all': return null
  }
}

export default function AdminCertificados() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [condutoresList, setCondutoresList] = useState<Condutor[]>([])
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month')
  const [loading, setLoading] = useState(true)
  const [selectedCondutor, setSelectedCondutor] = useState<string | null>(null)
  const [newAtividade, setNewAtividade] = useState('')
  const [newCondutor, setNewCondutor] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    const [subRes, atRes, coRes] = await Promise.all([
      supabase.from('certificado_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('certificado_atividades').select('*').order('nome'),
      supabase.from('certificado_condutores').select('*').order('nome'),
    ])
    if (subRes.data) setSubmissions(subRes.data)
    if (atRes.data) setAtividades(atRes.data)
    if (coRes.data) setCondutoresList(coRes.data)
    setLoading(false)
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filteredSubmissions = useMemo(() => {
    const filterDate = getFilterDate(timeFilter)
    if (!filterDate) return submissions
    return submissions.filter(s => new Date(s.created_at) >= filterDate)
  }, [submissions, timeFilter])

  // ─── Dashboard Metrics ───────────────────────────────────────────
  const metrics = useMemo(() => {
    const subs = filteredSubmissions
    const totalSubmissions = subs.length
    const avgGroupRating = subs.length > 0
      ? subs.reduce((sum, s) => sum + s.nota_grupo, 0) / subs.length
      : 0
    const avgConductorRating = subs.length > 0
      ? subs.reduce((sum, s) => sum + s.nota_condutor, 0) / subs.length
      : 0
    const totalFeedbacks = subs.filter(s => s.relato).length

    // Per conductor metrics
    const conductorMap = new Map<string, { ratings: number[]; count: number }>()
    subs.forEach(s => {
      s.condutores?.forEach(c => {
        const existing = conductorMap.get(c) || { ratings: [], count: 0 }
        existing.ratings.push(s.nota_condutor)
        existing.count++
        conductorMap.set(c, existing)
      })
    })

    const conductorMetrics = Array.from(conductorMap.entries())
      .map(([name, data]) => ({
        name,
        avgRating: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
        count: data.count,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)

    // Activity distribution
    const activityMap = new Map<string, number>()
    subs.forEach(s => activityMap.set(s.atividade_nome, (activityMap.get(s.atividade_nome) || 0) + 1))
    const activityDist = Array.from(activityMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Daily submissions (last 30 days)
    const dailyMap = new Map<string, number>()
    subs.forEach(s => {
      const day = s.created_at.split('T')[0]
      dailyMap.set(day, (dailyMap.get(day) || 0) + 1)
    })
    const dailyData = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)

    return {
      totalSubmissions,
      avgGroupRating,
      avgConductorRating,
      totalFeedbacks,
      conductorMetrics,
      activityDist,
      dailyData,
    }
  }, [filteredSubmissions])

  // ─── Conductor detail view ───────────────────────────────────────
  const conductorDetail = useMemo(() => {
    if (!selectedCondutor) return null
    const subs = filteredSubmissions.filter(s => s.condutores?.includes(selectedCondutor))
    const ratings = subs.map(s => s.nota_condutor)
    const avg = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
    const relatos = subs.filter(s => s.relato).map(s => ({ relato: s.relato!, date: s.created_at }))

    // Monthly trend
    const monthlyMap = new Map<string, number[]>()
    subs.forEach(s => {
      const month = s.created_at.substring(0, 7)
      const existing = monthlyMap.get(month) || []
      existing.push(s.nota_condutor)
      monthlyMap.set(month, existing)
    })
    const trend = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, r]) => ({
        month,
        avg: r.reduce((a, b) => a + b, 0) / r.length,
        count: r.length,
      }))

    return { name: selectedCondutor, avgRating: avg, totalFeedbacks: subs.length, relatos, trend }
  }, [selectedCondutor, filteredSubmissions])

  // ─── CRUD operations ─────────────────────────────────────────────
  async function addAtividade() {
    if (!newAtividade.trim()) return
    await supabase.from('certificado_atividades').insert({ nome: newAtividade.trim() })
    setNewAtividade('')
    loadData()
  }

  async function toggleAtividade(id: string, ativo: boolean) {
    await supabase.from('certificado_atividades').update({ ativo: !ativo }).eq('id', id)
    loadData()
  }

  async function deleteAtividade(id: string) {
    await supabase.from('certificado_atividades').delete().eq('id', id)
    loadData()
  }

  async function addCondutor() {
    if (!newCondutor.trim()) return
    await supabase.from('certificado_condutores').insert({ nome: newCondutor.trim() })
    setNewCondutor('')
    loadData()
  }

  async function toggleCondutor(id: string, ativo: boolean) {
    await supabase.from('certificado_condutores').update({ ativo: !ativo }).eq('id', id)
    loadData()
  }

  async function deleteCondutor(id: string) {
    await supabase.from('certificado_condutores').delete().eq('id', id)
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1A1A1A' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(200,75,49,0.3)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#1A1A1A' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-dm text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#C84B31', border: '1px solid rgba(200,75,49,0.2)' }}>
              Certificados
            </span>
            <h1 className="font-fraunces font-bold text-lg" style={{ color: 'rgba(253,251,247,0.9)' }}>
              Painel Administrativo
            </h1>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem('certificados_admin'); window.location.reload() }}
            className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b overflow-x-auto" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelectedCondutor(null) }}
              className="font-dm text-sm px-4 py-3 transition-all whitespace-nowrap relative"
              style={{ color: tab === t ? '#C84B31' : 'rgba(253,251,247,0.4)' }}
            >
              {TAB_LABELS[t]}
              {tab === t && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: '#C84B31' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Time filter (for dashboard and conductor views) */}
        {(tab === 'dashboard' || tab === 'condutores-view') && (
          <div className="flex flex-wrap gap-2 mb-8">
            {(Object.keys(TIME_LABELS) as TimeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className="font-dm text-xs px-4 py-2 rounded-full transition-all"
                style={{
                  backgroundColor: timeFilter === f ? 'rgba(200,75,49,0.12)' : 'rgba(255,255,255,0.03)',
                  color: timeFilter === f ? '#C84B31' : 'rgba(253,251,247,0.4)',
                  border: `1px solid ${timeFilter === f ? 'rgba(200,75,49,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {TIME_LABELS[f]}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ─── Dashboard Tab ─────────────────────────────────────── */}
          {tab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard icon={<FileText size={18} />} label="Certificados" value={metrics.totalSubmissions} />
                <MetricCard icon={<Star size={18} />} label="Nota Grupo" value={metrics.avgGroupRating.toFixed(1)} suffix="/5" />
                <MetricCard icon={<Users size={18} />} label="Nota Condutores" value={metrics.avgConductorRating.toFixed(1)} suffix="/5" />
                <MetricCard icon={<MessageSquare size={18} />} label="Relatos" value={metrics.totalFeedbacks} />
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Daily submissions chart */}
                <Card title="Envios por Dia" icon={<BarChart3 size={16} />}>
                  {metrics.dailyData.length > 0 ? (
                    <div className="flex items-end gap-1 h-32">
                      {metrics.dailyData.map(([date, count]) => {
                        const maxCount = Math.max(...metrics.dailyData.map(([, c]) => c))
                        const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                        return (
                          <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                            <div
                              className="w-full rounded-t transition-all"
                              style={{
                                height: `${height}%`,
                                minHeight: '4px',
                                backgroundColor: 'rgba(200,75,49,0.6)',
                              }}
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 rounded text-xs font-dm whitespace-nowrap"
                              style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff' }}>
                              {date.slice(5)}: {count}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="font-dm text-sm text-center py-8" style={{ color: 'rgba(253,251,247,0.3)' }}>
                      Sem dados no período
                    </p>
                  )}
                </Card>

                {/* Activity distribution */}
                <Card title="Atividades" icon={<Award size={16} />}>
                  <div className="space-y-3">
                    {metrics.activityDist.map((a) => {
                      const pct = metrics.totalSubmissions > 0 ? (a.count / metrics.totalSubmissions) * 100 : 0
                      return (
                        <div key={a.name}>
                          <div className="flex justify-between mb-1">
                            <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.6)' }}>{a.name}</span>
                            <span className="font-dm text-xs font-bold" style={{ color: '#C84B31' }}>{a.count}</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: 'rgba(200,75,49,0.5)' }} />
                          </div>
                        </div>
                      )
                    })}
                    {metrics.activityDist.length === 0 && (
                      <p className="font-dm text-sm text-center py-4" style={{ color: 'rgba(253,251,247,0.3)' }}>Sem dados</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Conductor rankings */}
              <Card title="Ranking de Condutores" icon={<TrendingUp size={16} />}>
                <div className="space-y-2">
                  {metrics.conductorMetrics.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => { setSelectedCondutor(c.name); setTab('condutores-view') }}
                      className="w-full flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/[0.02]"
                    >
                      <span className="font-dm text-sm font-bold w-6" style={{ color: i < 3 ? '#C84B31' : 'rgba(253,251,247,0.3)' }}>
                        {i + 1}
                      </span>
                      <span className="font-dm text-sm flex-1 text-left" style={{ color: 'rgba(253,251,247,0.7)' }}>
                        {c.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#C84B31" stroke="#C84B31" />
                        <span className="font-dm text-sm font-bold" style={{ color: '#C84B31' }}>
                          {c.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>
                        {c.count} feedback{c.count !== 1 ? 's' : ''}
                      </span>
                      <ChevronRight size={14} style={{ color: 'rgba(253,251,247,0.2)' }} />
                    </button>
                  ))}
                  {metrics.conductorMetrics.length === 0 && (
                    <p className="font-dm text-sm text-center py-8" style={{ color: 'rgba(253,251,247,0.3)' }}>
                      Sem dados de condutores no período
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ─── Conductor Detail Tab ──────────────────────────────── */}
          {tab === 'condutores-view' && (
            <motion.div key="condutores-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {selectedCondutor && conductorDetail ? (
                <div className="space-y-6">
                  <button onClick={() => setSelectedCondutor(null)} className="font-dm text-sm flex items-center gap-2"
                    style={{ color: 'rgba(253,251,247,0.4)' }}>
                    <ChevronDown size={14} className="rotate-90" /> Voltar ao ranking
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-fraunces font-bold text-xl"
                      style={{ backgroundColor: 'rgba(200,75,49,0.12)', color: '#C84B31' }}>
                      {conductorDetail.name[0]}
                    </div>
                    <div>
                      <h2 className="font-fraunces font-bold text-xl" style={{ color: 'rgba(253,251,247,0.9)' }}>
                        {conductorDetail.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Star size={14} fill="#C84B31" stroke="#C84B31" />
                          <span className="font-dm text-sm font-bold" style={{ color: '#C84B31' }}>
                            {conductorDetail.avgRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>
                          {conductorDetail.totalFeedbacks} feedback{conductorDetail.totalFeedbacks !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trend */}
                  {conductorDetail.trend.length > 1 && (
                    <Card title="Evolução das Avaliações" icon={<TrendingUp size={16} />}>
                      <div className="flex items-end gap-3 h-32">
                        {conductorDetail.trend.map((t) => {
                          const height = (t.avg / 5) * 100
                          return (
                            <div key={t.month} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full rounded-t-lg" style={{ height: `${height}%`, backgroundColor: 'rgba(200,75,49,0.5)' }} />
                              <span className="font-dm text-[10px]" style={{ color: 'rgba(253,251,247,0.3)' }}>
                                {t.month.slice(5)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </Card>
                  )}

                  {/* Feedback list */}
                  <Card title="Relatos Recebidos" icon={<MessageSquare size={16} />}>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {conductorDetail.relatos.length > 0 ? conductorDetail.relatos.map((r, i) => (
                        <div key={i} className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <p className="font-dm text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.6)' }}>
                            &ldquo;{r.relato}&rdquo;
                          </p>
                          <p className="font-dm text-xs mt-2" style={{ color: 'rgba(253,251,247,0.2)' }}>
                            {new Date(r.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )) : (
                        <p className="font-dm text-sm text-center py-8" style={{ color: 'rgba(253,251,247,0.3)' }}>
                          Nenhum relato escrito
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              ) : (
                /* Conductor list/ranking */
                <Card title="Todos os Condutores" icon={<Users size={16} />}>
                  <div className="space-y-2">
                    {metrics.conductorMetrics.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedCondutor(c.name)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/[0.02]"
                      >
                        <span className="font-dm text-sm font-bold w-6" style={{ color: i < 3 ? '#C84B31' : 'rgba(253,251,247,0.3)' }}>
                          {i + 1}
                        </span>
                        <span className="font-dm text-sm flex-1 text-left" style={{ color: 'rgba(253,251,247,0.7)' }}>
                          {c.name}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star size={12} fill="#C84B31" stroke="#C84B31" />
                          <span className="font-dm text-sm font-bold" style={{ color: '#C84B31' }}>{c.avgRating.toFixed(1)}</span>
                        </div>
                        <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>
                          {c.count} feedbacks
                        </span>
                        <ChevronRight size={14} style={{ color: 'rgba(253,251,247,0.2)' }} />
                      </button>
                    ))}
                    {metrics.conductorMetrics.length === 0 && (
                      <p className="font-dm text-sm text-center py-8" style={{ color: 'rgba(253,251,247,0.3)' }}>
                        Sem dados no período selecionado
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {/* ─── Activities Management Tab ─────────────────────────── */}
          {tab === 'atividades' && (
            <motion.div key="atividades" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <Card title="Gerenciar Atividades" icon={<Settings size={16} />}>
                <div className="flex gap-2 mb-6">
                  <input
                    value={newAtividade}
                    onChange={(e) => setNewAtividade(e.target.value)}
                    placeholder="Nova atividade..."
                    onKeyDown={(e) => e.key === 'Enter' && addAtividade()}
                    className="font-dm flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.9)' }}
                  />
                  <button onClick={addAtividade} className="px-4 py-3 rounded-xl font-dm text-sm font-bold"
                    style={{ backgroundColor: '#C84B31', color: '#fff' }}>
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {atividades.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span className="font-dm text-sm flex-1" style={{ color: a.ativo ? 'rgba(253,251,247,0.7)' : 'rgba(253,251,247,0.25)' }}>
                        {a.nome}
                      </span>
                      <button onClick={() => toggleAtividade(a.id, a.ativo)}
                        className="p-1.5 rounded-lg transition-all" style={{ color: a.ativo ? '#C84B31' : 'rgba(253,251,247,0.2)' }}>
                        {a.ativo ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={() => deleteAtividade(a.id)}
                        className="p-1.5 rounded-lg transition-all" style={{ color: 'rgba(253,251,247,0.2)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ─── Conductors Management Tab ─────────────────────────── */}
          {tab === 'condutores' && (
            <motion.div key="condutores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <Card title="Gerenciar Condutores" icon={<Users size={16} />}>
                <div className="flex gap-2 mb-6">
                  <input
                    value={newCondutor}
                    onChange={(e) => setNewCondutor(e.target.value)}
                    placeholder="Novo condutor..."
                    onKeyDown={(e) => e.key === 'Enter' && addCondutor()}
                    className="font-dm flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(253,251,247,0.9)' }}
                  />
                  <button onClick={addCondutor} className="px-4 py-3 rounded-xl font-dm text-sm font-bold"
                    style={{ backgroundColor: '#C84B31', color: '#fff' }}>
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-2">
                  {condutoresList.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span className="font-dm text-sm flex-1" style={{ color: c.ativo ? 'rgba(253,251,247,0.7)' : 'rgba(253,251,247,0.25)' }}>
                        {c.nome}
                      </span>
                      <button onClick={() => toggleCondutor(c.id, c.ativo)}
                        className="p-1.5 rounded-lg transition-all" style={{ color: c.ativo ? '#C84B31' : 'rgba(253,251,247,0.2)' }}>
                        {c.ativo ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={() => deleteCondutor(c.id)}
                        className="p-1.5 rounded-lg transition-all" style={{ color: 'rgba(253,251,247,0.2)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ─── Submissions Tab ───────────────────────────────────── */}
          {tab === 'submissions' && (
            <motion.div key="submissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Search */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Search size={16} style={{ color: 'rgba(253,251,247,0.3)' }} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome ou email..."
                  className="flex-1 bg-transparent font-dm text-sm outline-none"
                  style={{ color: 'rgba(253,251,247,0.8)' }}
                />
              </div>

              <Card title={`Envios Recentes (${submissions.length} total)`} icon={<FileText size={16} />}>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {submissions
                    .filter(s => {
                      if (!searchTerm) return true
                      const term = searchTerm.toLowerCase()
                      return s.nome_completo.toLowerCase().includes(term) ||
                        s.email.toLowerCase().includes(term) ||
                        (s.nome_social && s.nome_social.toLowerCase().includes(term))
                    })
                    .map((s) => (
                      <div key={s.id} className="p-4 rounded-xl"
                        style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-dm text-sm font-medium truncate" style={{ color: 'rgba(253,251,247,0.8)' }}>
                                {s.nome_social || s.nome_completo}
                              </span>
                              {s.nome_social && (
                                <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>
                                  ({s.nome_completo})
                                </span>
                              )}
                            </div>
                            <p className="font-dm text-xs truncate" style={{ color: 'rgba(253,251,247,0.3)' }}>{s.email}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="font-dm text-xs px-2 py-1 rounded-full"
                              style={{ backgroundColor: 'rgba(200,75,49,0.1)', color: '#C84B31' }}>
                              {s.atividade_nome}
                            </span>
                            <p className="font-dm text-xs mt-1" style={{ color: 'rgba(253,251,247,0.2)' }}>
                              {new Date(s.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>Grupo:</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(n => (
                                <Star key={n} size={10}
                                  fill={n <= s.nota_grupo ? '#C84B31' : 'transparent'}
                                  stroke={n <= s.nota_grupo ? '#C84B31' : 'rgba(253,251,247,0.15)'}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>Condutor:</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(n => (
                                <Star key={n} size={10}
                                  fill={n <= s.nota_condutor ? '#C84B31' : 'transparent'}
                                  stroke={n <= s.nota_condutor ? '#C84B31' : 'rgba(253,251,247,0.15)'}
                                />
                              ))}
                            </div>
                          </div>
                          {s.condutores?.length > 0 && (
                            <span className="font-dm text-xs" style={{ color: 'rgba(253,251,247,0.3)' }}>
                              {s.condutores.join(', ')}
                            </span>
                          )}
                        </div>
                        {s.relato && (
                          <p className="font-dm text-xs mt-3 leading-relaxed italic"
                            style={{ color: 'rgba(253,251,247,0.4)' }}>
                            &ldquo;{s.relato}&rdquo;
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Helper Components ─────────────────────────────────────────────

function MetricCard({ icon, label, value, suffix }: {
  icon: React.ReactNode; label: string; value: string | number; suffix?: string
}) {
  return (
    <div className="p-5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2 mb-3" style={{ color: '#C84B31' }}>
        {icon}
        <span className="font-dm text-xs uppercase tracking-wider" style={{ color: 'rgba(253,251,247,0.3)' }}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-fraunces font-bold text-2xl" style={{ color: 'rgba(253,251,247,0.9)' }}>{value}</span>
        {suffix && <span className="font-dm text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>{suffix}</span>}
      </div>
    </div>
  )
}

function Card({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode
}) {
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
