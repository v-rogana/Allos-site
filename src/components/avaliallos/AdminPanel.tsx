'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuadroSemanal from './QuadroSemanal'
import AtmosphericBg from './AtmosphericBg'
import AvaliacaoTool from './AvaliacaoTool'
import StatsPanel from './StatsPanel'

interface Av { id: string; nome: string }
interface DFx { id: string; avaliador_id: string; avaliadores: Av }
interface DAv { id: string; avaliador_id: string; avaliadores: Av }
interface BkI { id: string; avaliado_id: string; avaliados: { id: string; nome_completo: string; telefone: string; categoria: string; status: string } }
interface SFx { id: string; dia_semana: string; hora: string; ativo: boolean; avaliador_disp_fixo: DFx[] }
interface SAv { id: string; data: string; hora: string; ativo: boolean; max_avaliadores: number; max_avaliados: number; no_formulario: boolean; criado_por: string|null; avaliador_disponibilidade: DAv[]; bookings: BkI[] }
interface Avdo { id: string; nome_completo: string; telefone: string; ja_participou: boolean; categoria: string; observacoes: string|null; status: string; fixos_escolhidos: string; criado_em: string; bookings: { id: string; slot_id: string; slots: { id: string; data: string; hora: string } }[] }
interface Msg { id: number; tipo: string; titulo: string; template: string }
interface AvReg { id: string; nome: string; telefone: string|null; capacidade_semanal: number; observacoes: string|null; ativo: boolean; criado_em: string; disp_fixos: { id: string; slot_fixo_id: string; slots_fixos: { id: string; dia_semana: string; hora: string } }[]; disp_avulsos: { id: string; slot_id: string; slots: { id: string; data: string; hora: string } }[] }

const ST: Record<string, { bg: string; tx: string; lb: string }> = {
  aguardando: { bg: 'rgba(212,133,74,0.12)', tx: '#D4854A', lb: 'Aguardando' },
  em_confirmacao: { bg: 'rgba(234,140,0,0.12)', tx: '#EA8C00', lb: 'Em confirmação' },
  confirmado: { bg: 'rgba(34,197,94,0.12)', tx: '#22c55e', lb: 'Confirmado' },
  remarcar: { bg: 'rgba(139,92,246,0.12)', tx: '#8B5CF6', lb: 'Remarcar' },
  removido: { bg: 'rgba(92,92,92,0.12)', tx: '#5C5C5C', lb: 'Removido' },
  avaliacao_realizada: { bg: 'rgba(253,251,247,0.04)', tx: 'rgba(253,251,247,0.35)', lb: 'Avaliação já realizada' },
}

const DIAS: Record<string,string> = { segunda:'Segunda-feira', terca:'Terça-feira', quarta:'Quarta-feira', quinta:'Quinta-feira', sexta:'Sexta-feira', sabado:'Sábado', domingo:'Domingo' }
const DIAS_ORDER = ['segunda','terca','quarta','quinta','sexta','sabado','domingo']
const DIAS_SHORT: Record<string,string> = { segunda:'Seg', terca:'Ter', quarta:'Qua', quinta:'Qui', sexta:'Sex', sabado:'Sáb', domingo:'Dom' }
const T = '#0EA5A0', C = 'rgba(255,255,255,0.04)', B = 'rgba(255,255,255,0.09)', X = 'rgba(253,251,247,0.95)', X2 = 'rgba(253,251,247,0.55)', X3 = 'rgba(253,251,247,0.32)'

type Tab = 'quadro' | 'avaliadores' | 'fixos' | 'avulsos' | 'fila' | 'avaliacoes' | 'msgs' | 'stats'

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('quadro')
  const [fixos, setFixos] = useState<SFx[]>([])
  const [avulsos, setAvulsos] = useState<SAv[]>([])
  const [avaliados, setAvaliados] = useState<Avdo[]>([])
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [avalReg, setAvalReg] = useState<AvReg[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [statsKey, setStatsKey] = useState(0)
  const [filtro, setFiltro] = useState<string|null>(null)
  const [busca, setBusca] = useState('')
  const [filtroFixo, setFiltroFixo] = useState<string|null>(null)

  // New fixo
  const [showNF, setShowNF] = useState(false)
  const [nfDia, setNfDia] = useState('segunda')
  const [nfHora, setNfHora] = useState('')
  // New avulso
  const [showNA, setShowNA] = useState(false)
  const [naData, setNaData] = useState('')
  const [naHora, setNaHora] = useState('')
  const [naMaxAv, setNaMaxAv] = useState(2)
  const [naMaxAd, setNaMaxAd] = useState(2)
  // Assign modal
  const [assigning, setAssigning] = useState<Avdo|null>(null)
  // Edit msg
  const [editMsg, setEditMsg] = useState<Msg|null>(null)
  const [editTpl, setEditTpl] = useState('')
  // Avaliadores registry
  const [showNewAval, setShowNewAval] = useState(false)
  const [newAval, setNewAval] = useState({ nome: '', telefone: '', capacidade_semanal: 3, observacoes: '' })
  const [editingAval, setEditingAval] = useState<AvReg|null>(null)
  const [editAval, setEditAval] = useState({ nome: '', telefone: '', capacidade_semanal: 3, observacoes: '' })

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [fr,ar,avr,mr,avlr] = await Promise.all([
        fetch('/api/avaliallos/slots-fixos').then(r=>r.json()), fetch('/api/avaliallos/slots').then(r=>r.json()),
        fetch('/api/avaliallos/avaliados').then(r=>r.json()), fetch('/api/avaliallos/mensagens').then(r=>r.json()),
        fetch('/api/avaliallos/avaliadores').then(r=>r.json())
      ])
      setFixos(Array.isArray(fr) ? fr : []); setAvulsos(Array.isArray(ar) ? ar : []); setAvaliados(Array.isArray(avr) ? avr : []); setMsgs(Array.isArray(mr) ? mr : []); setAvalReg(Array.isArray(avlr) ? avlr : [])
    } catch { flash('Erro') } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Fixos CRUD
  const criarFixo = async () => {
    if (!nfHora) return flash('Preencha a hora')
    await fetch('/api/avaliallos/slots-fixos', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ dia_semana: nfDia, hora: nfHora }) })
    flash('Fixo criado!'); setShowNF(false); setNfHora(''); fetchAll()
  }
  const delFixo = async (id: string) => { if (!confirm('Remover?')) return; await fetch(`/api/avaliallos/slots-fixos?id=${id}`, { method:'DELETE' }); flash('Removido'); fetchAll() }
  const toggleFixo = async (s: SFx) => { await fetch('/api/avaliallos/slots-fixos', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id: s.id, ativo: !s.ativo }) }); fetchAll() }

  // Avulsos CRUD
  const criarAvulso = async () => {
    if (!naData || !naHora) return flash('Preencha')
    await fetch('/api/avaliallos/slots', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ data: naData, hora: naHora, max_avaliadores: naMaxAv, max_avaliados: naMaxAd, no_formulario: false }) })
    flash('Avulso criado!'); setShowNA(false); setNaData(''); setNaHora(''); fetchAll()
  }
  const delAvulso = async (id: string) => { if (!confirm('Remover?')) return; await fetch(`/api/avaliallos/slots?id=${id}`, { method:'DELETE' }); flash('Removido'); fetchAll() }
  const toggleAvulso = async (s: SAv) => { await fetch('/api/avaliallos/slots', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id: s.id, ativo: !s.ativo }) }); fetchAll() }
  const toggleFormulario = async (s: SAv) => { await fetch('/api/avaliallos/slots', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id: s.id, no_formulario: !s.no_formulario }) }); fetchAll(); flash(s.no_formulario ? 'Removido do formulário' : 'Publicado no formulário') }

  // Avaliados
  const updStatus = async (id: string, s: string) => { await fetch('/api/avaliallos/avaliados', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id, status: s }) }); fetchAll(); flash(ST[s]?.lb||s) }
  const delAval = async (id: string) => { if (!confirm('Remover?')) return; await fetch(`/api/avaliallos/avaliados?id=${id}`, { method:'DELETE' }); flash('Removido'); fetchAll() }
  const assign = async (slotId: string) => {
    if (!assigning) return
    await fetch('/api/avaliallos/bookings', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ avaliado_id: assigning.id, slot_id: slotId }) })
    flash(`${assigning.nome_completo} alocado!`); setAssigning(null); fetchAll()
  }
  const rmBooking = async (id: string) => { await fetch(`/api/avaliallos/bookings?id=${id}`, { method:'DELETE' }); flash('Desalocado'); fetchAll() }

  // Msgs
  const saveMsg = async () => { if (!editMsg) return; await fetch('/api/avaliallos/mensagens', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ tipo: editMsg.tipo, template: editTpl }) }); flash('Salvo!'); setEditMsg(null); fetchAll() }

  // Avaliadores registry
  const criarAval = async () => {
    if (!newAval.nome) return flash('Preencha o nome')
    await fetch('/api/avaliallos/avaliadores', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(newAval) })
    flash('Avaliador cadastrado!'); setShowNewAval(false); setNewAval({ nome:'', telefone:'', capacidade_semanal:3, observacoes:'' }); fetchAll()
  }
  const salvarEditAval = async () => {
    if (!editingAval) return
    await fetch('/api/avaliallos/avaliadores', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id: editingAval.id, ...editAval }) })
    flash('Atualizado!'); setEditingAval(null); fetchAll()
  }
  const delAvalReg = async (id: string) => {
    if (!confirm('Remover avaliador? Isso remove todas as disponibilidades associadas.')) return
    await fetch(`/api/avaliallos/avaliadores?id=${id}`, { method:'DELETE' }); flash('Removido'); fetchAll()
  }
  const toggleAvalAtivo = async (a: AvReg) => {
    await fetch('/api/avaliallos/avaliadores', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id: a.id, ativo: !a.ativo }) })
    flash(a.ativo ? 'Desativado' : 'Ativado'); fetchAll()
  }

  const REAPROVEITAR_DEFAULT = 'Olá, {nome}! Tudo bem? 😊\n\nEstamos entrando em contato porque gostaríamos de convidá-lo(a) para realizar uma nova avaliação no AvaliAllos.\n\nNeste momento, estamos priorizando pessoas que já passaram por uma primeira avaliação para tentarem novamente — e seria ótimo contar com a sua participação!\n\nSe tiver interesse, é só acessar o link abaixo e escolher um horário:\n{link}\n\nQualquer dúvida, estamos à disposição!'
  const waLink = (tel: string, nome: string, tipo: string, data?: string, hora?: string) => {
    const m = msgs.find(x => x.tipo === tipo)
    const template = m ? m.template : (tipo === 'reaproveitar' ? REAPROVEITAR_DEFAULT : '')
    if (!template) return
    const t = template.replace(/{nome}/g, nome).replace(/{data}/g, data||'').replace(/{hora}/g, hora||'').replace(/{link}/g, typeof window !== 'undefined' ? `${window.location.origin}/avaliallos` : '')
    const num = tel.replace(/\D/g, '')
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(t)}`, '_blank')
  }

  const csv = () => {
    const h = 'Nome,Telefone,Categoria,Status,Fixos,Avulso,Obs\n'
    const r = filtered.map(a => { const bk = a.bookings?.[0]; let fxs = ''; try { const ids = JSON.parse(a.fixos_escolhidos||'[]'); fxs = ids.map((id:string) => { const f = fixos.find(x => x.id===id); return f ? `${DIAS_SHORT[f.dia_semana]} ${f.hora}` : id }).join('; ') } catch {} return `"${a.nome_completo}","${a.telefone}","${a.categoria}","${a.status}","${fxs}","${bk?.slots ? bk.slots.data+' '+bk.slots.hora : ''}","${a.observacoes||''}"` }).join('\n')
    const bl = new Blob([h+r], { type:'text/csv;charset=utf-8;' }); const u = URL.createObjectURL(bl); const a = document.createElement('a'); a.href=u; a.download=`avaliallos_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(u)
  }

  const filtered = avaliados.filter(a => {
    if (!a.telefone || a.telefone.replace(/\D/g, '').length < 8) return false
    if (filtro && a.status !== filtro) return false
    if (busca) {
      const q = busca.toLowerCase()
      if (!a.nome_completo.toLowerCase().includes(q) && !a.telefone.includes(q)) return false
    }
    if (filtroFixo) {
      try { const ids = JSON.parse(a.fixos_escolhidos || '[]'); if (!ids.includes(filtroFixo)) return false } catch { return false }
    }
    return true
  })
  const fmtD = (s: string) => new Date(s+'T00:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' })
  const fmtDL = (s: string) => new Date(s+'T00:00:00').toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })
  const sCounts = Object.keys(ST).reduce<Record<string,number>>((a,k) => { a[k]=avaliados.filter(x=>x.status===k).length; return a }, {})
  const fixosByDia = fixos.reduce<Record<string,SFx[]>>((a,s) => { if(!a[s.dia_semana]) a[s.dia_semana]=[]; a[s.dia_semana].push(s); return a }, {})
  const avulsosByDate = avulsos.reduce<Record<string,SAv[]>>((a,s) => { if(!a[s.data]) a[s.data]=[]; a[s.data].push(s); return a }, {})

  const getFixoLabel = (id: string) => { const f = fixos.find(x=>x.id===id); return f ? `${DIAS_SHORT[f.dia_semana]} ${f.hora}` : id }

  return (
    <div className="min-h-screen relative">
      <AtmosphericBg />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-10">

      {/* Header with glass card */}
      <div className="rounded-3xl p-6 mb-8" style={{ background:'linear-gradient(135deg, rgba(14,165,160,0.06), rgba(14,165,160,0.02))', border:'1px solid rgba(14,165,160,0.12)', backdropFilter:'blur(20px)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:'linear-gradient(135deg, #0EA5A0, #1BBAB0)', boxShadow:'0 4px 20px rgba(14,165,160,0.25)' }}>
              <span className="font-fraunces text-lg font-bold italic text-white">A</span>
            </div>
            <div>
              <span className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color:T }}>Admin</span>
              <h1 className="font-fraunces text-2xl" style={{ color:X }}>Avali<em className="italic" style={{ color:T }}>Allos</em></h1>
            </div>
          </div>
          <button onClick={() => { fetchAll(); setRefreshKey(k => k + 1) }} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-lg" style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${B}`, backdropFilter:'blur(10px)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={X2} strokeWidth="2" strokeLinecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          </button>
        </div>
      </div>

      {/* Tabs with glass effect */}
      <div className="flex gap-1.5 mb-8 p-1.5 rounded-2xl overflow-x-auto" style={{ background:'rgba(255,255,255,0.03)', border:`1px solid rgba(255,255,255,0.06)`, backdropFilter:'blur(12px)' }}>
        {([
          { k:'quadro' as Tab, l:'Quadro', emoji:'📋' },
          { k:'avaliadores' as Tab, l:`Avaliadores (${avalReg.filter(a => a.ativo !== false).length})`, emoji:'👥' },
          { k:'fixos' as Tab, l:'Fixos', emoji:'🕐' },
          { k:'avulsos' as Tab, l:'Avulsos', emoji:'📅' },
          { k:'fila' as Tab, l:`Fila (${avaliados.filter(a => a.telefone && a.telefone.replace(/\D/g, '').length >= 8).length})`, emoji:'📊' },
          { k:'avaliacoes' as Tab, l:'Avaliações', emoji:'📝' },
          { k:'msgs' as Tab, l:'Mensagens', emoji:'💬' },
          { k:'stats' as Tab, l:'Estatísticas', emoji:'📊' },
        ]).map(t => <button key={t.k} onClick={() => setTab(t.k)} className="font-dm text-xs sm:text-sm flex-1 py-3 rounded-xl transition-all duration-300 font-medium whitespace-nowrap px-2 sm:px-3" style={{ background: tab===t.k ? 'linear-gradient(135deg, rgba(14,165,160,0.15), rgba(14,165,160,0.05))' : 'transparent', color: tab===t.k ? T : X3, border: tab===t.k ? '1px solid rgba(14,165,160,0.2)' : '1px solid transparent', boxShadow: tab===t.k ? '0 2px 12px rgba(14,165,160,0.1)' : 'none' }}>{t.l}</button>)}
      </div>

      {loading ? (
        <div className="py-16 text-center"><div className="w-8 h-8 rounded-full border-2 border-t-transparent mx-auto animate-spin" style={{ borderColor:B, borderTopColor:'transparent' }} /></div>
      ) : tab === 'quadro' ? (
        /* ===== QUADRO ===== */
        <QuadroSemanal key={refreshKey} />

      ) : tab === 'avaliadores' ? (
        /* ===== AVALIADORES ===== */
        <div>
          <p className="font-dm text-sm mb-4" style={{ color:X2 }}>Cadastro interno de avaliadores. Só o admin vê.</p>
          <button onClick={() => setShowNewAval(!showNewAval)} className="font-dm text-sm px-5 py-3 rounded-xl text-white font-medium mb-6 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2" style={{ backgroundColor:T }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>Cadastrar avaliador</button>

          <AnimatePresence>{showNewAval && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="overflow-hidden mb-8">
              <div className="rounded-3xl p-6" style={{ backgroundColor:C, border:`1.5px solid ${B}` }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Nome *</label><input type="text" value={newAval.nome} onChange={e => setNewAval({...newAval, nome:e.target.value})} placeholder="Nome do avaliador" className="font-dm text-sm w-full px-4 py-3 rounded-xl placeholder:text-white/20" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X }} /></div>
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Telefone (WhatsApp)</label><input type="tel" value={newAval.telefone} onChange={e => setNewAval({...newAval, telefone:e.target.value})} placeholder="(31) 99999-9999" className="font-dm text-sm w-full px-4 py-3 rounded-xl placeholder:text-white/20" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X }} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Capacidade semanal</label><input type="number" min={1} max={5} value={newAval.capacidade_semanal} onChange={e => setNewAval({...newAval, capacidade_semanal:+e.target.value})} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X, colorScheme:'dark' }} /></div>
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Observações</label><input type="text" value={newAval.observacoes} onChange={e => setNewAval({...newAval, observacoes:e.target.value})} placeholder="Notas internas..." className="font-dm text-sm w-full px-4 py-3 rounded-xl placeholder:text-white/20" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X }} /></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={criarAval} className="font-dm text-sm px-5 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor:T }}>Cadastrar</button>
                  <button onClick={() => setShowNewAval(false)} className="font-dm text-sm px-5 py-2.5 rounded-xl" style={{ color:X3 }}>Cancelar</button>
                </div>
              </div>
            </motion.div>
          )}</AnimatePresence>

          {/* Edit modal */}
          <AnimatePresence>{editingAval && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 flex items-center justify-center z-50 p-5" style={{ backgroundColor:'rgba(0,0,0,0.6)' }} onClick={() => setEditingAval(null)}>
              <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} onClick={e => e.stopPropagation()} className="rounded-3xl p-6 max-w-md w-full" style={{ backgroundColor:'#1A1A1A', border:`1.5px solid ${B}` }}>
                <h3 className="font-fraunces text-xl mb-4" style={{ color:X }}>Editar avaliador</h3>
                <div className="space-y-4 mb-4">
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Nome</label><input type="text" value={editAval.nome} onChange={e => setEditAval({...editAval, nome:e.target.value})} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X }} /></div>
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Telefone</label><input type="tel" value={editAval.telefone} onChange={e => setEditAval({...editAval, telefone:e.target.value})} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X }} /></div>
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Capacidade semanal (1-5)</label><input type="number" min={1} max={5} value={editAval.capacidade_semanal} onChange={e => setEditAval({...editAval, capacidade_semanal:+e.target.value})} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X, colorScheme:'dark' }} /></div>
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Observações</label><textarea value={editAval.observacoes} onChange={e => setEditAval({...editAval, observacoes:e.target.value})} rows={3} className="font-dm text-sm w-full px-4 py-3 rounded-xl resize-none" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X }} /></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={salvarEditAval} className="font-dm text-sm px-5 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor:T }}>Salvar</button>
                  <button onClick={() => setEditingAval(null)} className="font-dm text-sm px-5 py-2.5 rounded-xl" style={{ color:X3 }}>Cancelar</button>
                </div>
              </motion.div>
            </motion.div>
          )}</AnimatePresence>

          {avalReg.length === 0 ? (
            <div className="py-16 text-center rounded-3xl" style={{ border:`1.5px dashed ${B}` }}><p className="font-dm text-sm" style={{ color:X3 }}>Nenhum avaliador cadastrado.</p></div>
          ) : (() => {
            const ativos = avalReg.filter(a => a.ativo !== false)
            const inativos = avalReg.filter(a => a.ativo === false)
            const renderAval = (a: AvReg) => {
              const isAtivo = a.ativo !== false
              const fixoLabels = (a.disp_fixos || []).map(d => d.slots_fixos ? `${DIAS_SHORT[d.slots_fixos.dia_semana]} ${d.slots_fixos.hora}` : '?')
              const avulsoCount = (a.disp_avulsos || []).length
              return (
                <div key={a.id} className="rounded-2xl p-5 transition-all" style={{ backgroundColor:C, border:`1.5px solid ${isAtivo ? B : 'rgba(92,92,92,0.08)'}`, borderLeftWidth:'4px', borderLeftColor: isAtivo ? T : 'rgba(92,92,92,0.2)', opacity: isAtivo ? 1 : 0.55 }}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-dm text-base font-bold" style={{ color: isAtivo ? X : X3 }}>{a.nome}</span>
                        <span className="font-dm text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: isAtivo ? 'rgba(14,165,160,0.1)' : 'rgba(92,92,92,0.1)', color: isAtivo ? T : '#5C5C5C' }}>
                          {a.capacidade_semanal}/sem
                        </span>
                        {!isAtivo && <span className="font-dm text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ backgroundColor:'rgba(92,92,92,0.1)', color:'#5C5C5C' }}>Desativado</span>}
                      </div>

                      {a.telefone && (
                        <a href={`https://wa.me/${a.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-dm text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl mb-2 transition-all hover:-translate-y-0.5" style={{ backgroundColor:'#25D36620', color:'#25D366' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          {a.telefone}
                        </a>
                      )}

                      {fixoLabels.length > 0 && (
                        <div className="mb-1.5">
                          <span className="font-dm text-xs" style={{ color:X3 }}>Fixos marcados: </span>
                          {fixoLabels.map((l,i) => <span key={i} className="font-dm text-xs px-2 py-0.5 rounded-full mr-1" style={{ backgroundColor:'rgba(14,165,160,0.08)', color:T }}>{l}</span>)}
                        </div>
                      )}

                      {avulsoCount > 0 && (
                        <p className="font-dm text-xs" style={{ color:'#D4854A' }}>{avulsoCount} avulso(s) marcado(s)</p>
                      )}

                      {a.observacoes && (
                        <p className="font-dm text-xs mt-1.5 italic" style={{ color:X3 }}>&ldquo;{a.observacoes}&rdquo;</p>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => toggleAvalAtivo(a)} className="font-dm text-xs px-3 py-2 rounded-xl font-medium" style={{ backgroundColor: isAtivo ? 'rgba(92,92,92,0.08)' : 'rgba(14,165,160,0.08)', color: isAtivo ? '#5C5C5C' : T }}>{isAtivo ? 'Desativar' : 'Ativar'}</button>
                      <button onClick={() => { setEditingAval(a); setEditAval({ nome: a.nome, telefone: a.telefone || '', capacidade_semanal: a.capacidade_semanal, observacoes: a.observacoes || '' }) }} className="font-dm text-xs px-3 py-2 rounded-xl font-medium" style={{ backgroundColor:'rgba(14,165,160,0.08)', color:T }}>Editar</button>
                      <button onClick={() => delAvalReg(a.id)} className="font-dm text-xs px-3 py-2 rounded-xl font-medium" style={{ backgroundColor:'rgba(200,75,49,0.06)', color:'#C84B31' }}>Excluir</button>
                    </div>
                  </div>
                </div>
              )
            }
            return (
              <div className="space-y-3">
                {ativos.map(renderAval)}
                {inativos.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 pt-4">
                      <div className="flex-1 h-px" style={{ backgroundColor:B }} />
                      <span className="font-dm text-xs font-medium" style={{ color:'#5C5C5C' }}>Desativados ({inativos.length})</span>
                      <div className="flex-1 h-px" style={{ backgroundColor:B }} />
                    </div>
                    {inativos.map(renderAval)}
                  </>
                )}
              </div>
            )
          })()}
        </div>

      ) : tab === 'fixos' ? (
        /* ===== FIXOS ===== */
        <div>
          <p className="font-dm text-sm mb-4" style={{ color:X2 }}>Horários recorrentes semanais que aparecem no formulário do candidato.</p>
          <button onClick={() => setShowNF(!showNF)} className="font-dm text-sm px-5 py-3 rounded-xl text-white font-medium mb-6 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2" style={{ backgroundColor:T }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Novo horário fixo</button>

          <AnimatePresence>{showNF && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="overflow-hidden mb-8">
              <div className="rounded-3xl p-6" style={{ backgroundColor:C, border:`1.5px solid ${B}` }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Dia da semana</label>
                    <select value={nfDia} onChange={e => setNfDia(e.target.value)} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'#1A1A1A', border:`1.5px solid ${B}`, color:X, colorScheme:'dark' }}>
                      {DIAS_ORDER.map(d => <option key={d} value={d} style={{ backgroundColor:'#1A1A1A', color:'#FDFBF7' }}>{DIAS[d]}</option>)}
                    </select></div>
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Hora</label>
                    <input type="time" value={nfHora} onChange={e => setNfHora(e.target.value)} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X, colorScheme:'dark' }} /></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={criarFixo} className="font-dm text-sm px-5 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor:T }}>Criar</button>
                  <button onClick={() => setShowNF(false)} className="font-dm text-sm px-5 py-2.5 rounded-xl" style={{ color:X3 }}>Cancelar</button>
                </div>
              </div>
            </motion.div>
          )}</AnimatePresence>

          {Object.keys(fixosByDia).length === 0 ? (
            <div className="py-16 text-center rounded-3xl" style={{ border:`1.5px dashed ${B}` }}><p className="font-dm text-sm" style={{ color:X3 }}>Nenhum fixo.</p></div>
          ) : (
            <div className="space-y-6">
              {DIAS_ORDER.filter(d => fixosByDia[d]).map(dia => (
                <div key={dia}>
                  <div className="flex items-center gap-3 mb-3"><div className="w-2 h-2 rounded-full" style={{ backgroundColor:T }} /><h4 className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color:T }}>{DIAS[dia]}</h4><div className="flex-1 h-px" style={{ backgroundColor:B }} /></div>
                  <div className="flex flex-wrap gap-3">
                    {fixosByDia[dia].sort((a,b) => a.hora.localeCompare(b.hora)).map(s => (
                      <div key={s.id} className="rounded-2xl px-5 py-4 flex items-center gap-4" style={{ backgroundColor: s.ativo ? C : 'rgba(92,92,92,0.03)', border:`1.5px solid ${s.ativo ? B : 'rgba(92,92,92,0.05)'}`, opacity: s.ativo ? 1 : 0.4 }}>
                        <span className="font-dm text-xl font-bold" style={{ color:X }}>{s.hora}</span>
                        <span className="font-dm text-xs" style={{ color:X3 }}>{s.avaliador_disp_fixo?.length||0} aval.</span>
                        <button onClick={() => toggleFixo(s)} className="font-dm text-xs px-2 py-1 rounded-lg" style={{ color:X3 }}>{s.ativo ? 'Desativar' : 'Ativar'}</button>
                        <button onClick={() => delFixo(s.id)} className="font-dm text-xs px-2 py-1 rounded-lg" style={{ color:'#C84B31' }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      ) : tab === 'avulsos' ? (
        /* ===== AVULSOS ===== */
        <div>
          <p className="font-dm text-sm mb-4" style={{ color:X2 }}>Horários específicos. Use &ldquo;Publicar&rdquo; para mostrar no formulário do candidato.</p>
          <button onClick={() => setShowNA(!showNA)} className="font-dm text-sm px-5 py-3 rounded-xl text-white font-medium mb-6 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2" style={{ background:'linear-gradient(135deg, #C84B31, #D4854A)', boxShadow:'0 4px 16px rgba(200,75,49,0.25)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>Novo horário avulso</button>

          <AnimatePresence>{showNA && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="overflow-hidden mb-8">
              <div className="rounded-3xl p-6" style={{ backgroundColor:C, border:`1.5px solid ${B}` }}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Data</label><input type="date" value={naData} onChange={e => setNaData(e.target.value)} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X, colorScheme:'dark' }} /></div>
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Hora</label><input type="time" value={naHora} onChange={e => setNaHora(e.target.value)} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X, colorScheme:'dark' }} /></div>
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Máx aval.</label><input type="number" min={1} max={4} value={naMaxAv} onChange={e => setNaMaxAv(+e.target.value)} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X, colorScheme:'dark' }} /></div>
                  <div><label className="font-dm text-xs block mb-1.5" style={{ color:X3 }}>Máx avdos</label><input type="number" min={1} max={4} value={naMaxAd} onChange={e => setNaMaxAd(+e.target.value)} className="font-dm text-sm w-full px-4 py-3 rounded-xl" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${B}`, color:X, colorScheme:'dark' }} /></div>
                </div>
                <div className="flex gap-3"><button onClick={criarAvulso} className="font-dm text-sm px-5 py-2.5 rounded-xl text-white font-medium" style={{ backgroundColor:'#C84B31' }}>Criar</button><button onClick={() => setShowNA(false)} className="font-dm text-sm px-5 py-2.5 rounded-xl" style={{ color:X3 }}>Cancelar</button></div>
              </div>
            </motion.div>
          )}</AnimatePresence>

          {Object.keys(avulsosByDate).length === 0 ? (
            <div className="py-16 text-center rounded-3xl" style={{ border:`1.5px dashed ${B}` }}><p className="font-dm text-sm" style={{ color:X3 }}>Nenhum avulso.</p></div>
          ) : (
            <div className="space-y-10">
              {Object.entries(avulsosByDate).sort(([a],[b]) => a.localeCompare(b)).map(([data, ds]) => (
                <div key={data}>
                  <div className="flex items-center gap-3 mb-4"><div className="w-2 h-2 rounded-full" style={{ backgroundColor:'#C84B31' }} /><h4 className="font-dm text-xs font-bold tracking-widest uppercase" style={{ color:'#C84B31' }}>{fmtDL(data)}</h4><div className="flex-1 h-px" style={{ backgroundColor:B }} /></div>
                  <div className="space-y-3">
                    {ds.sort((a,b) => a.hora.localeCompare(b.hora)).map(s => (
                      <div key={s.id} className="rounded-2xl p-5" style={{ backgroundColor: s.ativo ? C : 'rgba(92,92,92,0.03)', border:`1.5px solid ${s.ativo ? B : 'rgba(92,92,92,0.05)'}`, borderLeftWidth:'4px', borderLeftColor: s.no_formulario ? '#D4854A' : s.ativo ? '#C84B31' : B, opacity: s.ativo ? 1 : 0.4 }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-dm text-2xl font-bold" style={{ color:X }}>{s.hora}</span>
                              {s.no_formulario && <span className="font-dm text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1" style={{ backgroundColor:'rgba(212,133,74,0.12)', color:'#D4854A' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>No formulário</span>}
                              {s.criado_por && <span className="font-dm text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1" style={{ backgroundColor:'rgba(139,92,246,0.1)', color:'#8B5CF6' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>{s.criado_por}</span>}
                            </div>
                            <div className="mb-2"><span className="font-dm text-xs font-bold" style={{ color:T }}>Avaliadores ({s.avaliador_disponibilidade?.length||0}/{s.max_avaliadores})</span>
                              <div className="flex flex-wrap gap-1 mt-1">{s.avaliador_disponibilidade?.length>0 ? s.avaliador_disponibilidade.map(d => <span key={d.id} className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:'rgba(14,165,160,0.1)', color:T }}>{d.avaliadores?.nome}</span>) : <span className="font-dm text-xs italic" style={{ color:X3 }}>—</span>}</div>
                            </div>
                            <div><span className="font-dm text-xs font-bold" style={{ color:'#D4854A' }}>Avaliados ({s.bookings?.length||0}/{s.max_avaliados})</span>
                              <div className="space-y-1 mt-1">{s.bookings?.length>0 ? s.bookings.map(b => (
                                <div key={b.id} className="flex items-center gap-2 flex-wrap">
                                  <span className="font-dm text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:'rgba(212,133,74,0.1)', color:'#D4854A' }}>{b.avaliados?.nome_completo}</span>
                                  {['confirmacao','cobranca','remocao'].map(tipo => {
                                    const col: Record<string,string> = { confirmacao:T, cobranca:'#D4854A', remocao:'#C84B31' }
                                    const lb: Record<string,string> = { confirmacao:'✓ Confirmar', cobranca:'⏰ Cobrar', remocao:'✕ Remover' }
                                    return <button key={tipo} onClick={() => waLink(b.avaliados?.telefone||'', b.avaliados?.nome_completo||'', tipo, data, s.hora)} className="font-dm text-xs px-2 py-0.5 rounded-lg font-medium cursor-pointer" style={{ backgroundColor:`${col[tipo]}15`, color:col[tipo] }}>{lb[tipo]}</button>
                                  })}
                                  <button onClick={() => rmBooking(b.id)} className="font-dm text-xs px-2 py-0.5 rounded-lg" style={{ color:'#C84B31' }}>Desalocar</button>
                                </div>
                              )) : <span className="font-dm text-xs italic" style={{ color:X3 }}>—</span>}</div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <button onClick={() => toggleFormulario(s)} className="font-dm text-xs px-3 py-2 rounded-xl font-medium" style={{ backgroundColor: s.no_formulario ? 'rgba(212,133,74,0.1)' : C, color: s.no_formulario ? '#D4854A' : X3, border:`1px solid ${B}` }}>{s.no_formulario ? 'Despublicar' : 'Publicar'}</button>
                            <button onClick={() => toggleAvulso(s)} className="font-dm text-xs px-3 py-2 rounded-xl" style={{ backgroundColor:C, color:X3, border:`1px solid ${B}` }}>{s.ativo ? 'Desativar' : 'Ativar'}</button>
                            <button onClick={() => delAvulso(s.id)} className="font-dm text-xs px-3 py-2 rounded-xl" style={{ backgroundColor:'rgba(200,75,49,0.06)', color:'#C84B31' }}>Excluir</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      ) : tab === 'fila' ? (
        /* ===== FILA ===== */
        <div>
          {/* Busca */}
          <div className="mb-4">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(253,251,247,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome ou telefone..." className="font-dm w-full pl-11 pr-4 py-3 rounded-2xl text-sm outline-none transition-all placeholder:text-white/20" style={{ backgroundColor:C, border:`1.5px solid ${B}`, color:X }} onFocus={e => { e.target.style.borderColor = 'rgba(14,165,160,0.4)' }} onBlur={e => { e.target.style.borderColor = B }} />
              {busca && <button onClick={() => setBusca('')} className="absolute right-4 top-1/2 -translate-y-1/2 font-dm text-xs" style={{ color:X3 }}>✕</button>}
            </div>
          </div>

          {/* Filtro por status */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
            <button onClick={() => setFiltro(null)} className="font-dm text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-medium" style={{ backgroundColor: !filtro ? X : C, color: !filtro ? '#1A1A1A' : X3 }}>Todos ({avaliados.length})</button>
            {Object.entries(ST).map(([k,v]) => { const c = sCounts[k]||0; if (!c) return null; return <button key={k} onClick={() => setFiltro(filtro===k?null:k)} className="font-dm text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-medium transition-all" style={{ backgroundColor: filtro===k ? v.tx : v.bg, color: filtro===k ? '#fff' : v.tx }}>{v.lb} ({c})</button> })}
          </div>

          {/* Filtro por horário fixo */}
          {fixos.length > 0 && (
            <div className="mb-4">
              <p className="font-dm text-xs mb-2" style={{ color:X3 }}>Filtrar por disponibilidade:</p>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setFiltroFixo(null)} className="font-dm text-xs px-3 py-1.5 rounded-lg font-medium transition-all" style={{ backgroundColor: !filtroFixo ? 'rgba(14,165,160,0.15)' : C, color: !filtroFixo ? T : X3, border: `1px solid ${!filtroFixo ? 'rgba(14,165,160,0.3)' : B}` }}>Todos</button>
                {fixos.filter(f => f.ativo).map(f => {
                  const sel = filtroFixo === f.id
                  const label = `${DIAS_SHORT[f.dia_semana]} ${f.hora}`
                  return <button key={f.id} onClick={() => setFiltroFixo(sel ? null : f.id)} className="font-dm text-xs px-3 py-1.5 rounded-lg font-medium transition-all" style={{ backgroundColor: sel ? T : C, color: sel ? '#fff' : X2, border: `1px solid ${sel ? T : B}` }}>{label}</button>
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <p className="font-dm text-xs" style={{ color:X3 }}>{filtered.length} resultado(s)</p>
            <button onClick={csv} className="font-dm text-xs px-4 py-2.5 rounded-xl text-white font-medium inline-flex items-center gap-1.5" style={{ backgroundColor:T }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>CSV</button>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center rounded-3xl" style={{ border:`1.5px dashed ${B}` }}><p className="font-dm text-sm" style={{ color:X3 }}>Nenhum candidato.</p></div>
          ) : (
            <div className="space-y-3">
              {/* Sort: active statuses first, then removido/avaliacao_realizada at bottom */}
              {[...filtered].sort((a, b) => {
                const inactiveA = a.status === 'removido' || a.status === 'avaliacao_realizada' ? 1 : 0
                const inactiveB = b.status === 'removido' || b.status === 'avaliacao_realizada' ? 1 : 0
                return inactiveA - inactiveB
              }).map(a => {
                const bk = a.bookings?.[0]; const sc = ST[a.status]||ST.aguardando
                let fxLabels: string[] = []; try { fxLabels = JSON.parse(a.fixos_escolhidos||'[]').map((id:string) => getFixoLabel(id)) } catch {}
                const isDone = a.status === 'removido' || a.status === 'avaliacao_realizada'
                return (
                <motion.div key={a.id} layout className="rounded-2xl p-4 sm:p-5 transition-all" style={{
                  backgroundColor: isDone ? 'rgba(255,255,255,0.015)' : C,
                  border: `1.5px solid ${isDone ? 'rgba(255,255,255,0.04)' : B}`,
                  borderLeftWidth: '4px',
                  borderLeftColor: sc.tx,
                  opacity: isDone ? 0.5 : 1,
                }}>
                  <div className="flex flex-col gap-3">
                    {/* Header: name + status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-dm text-sm sm:text-base font-bold truncate" style={{ color: isDone ? X3 : X }}>{a.nome_completo}</span>
                          <span className="font-dm text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ backgroundColor:sc.bg, color:sc.tx }}>{sc.lb}</span>
                        </div>
                        <p className="font-dm text-[11px] sm:text-xs mb-0.5" style={{ color: isDone ? X3 : X2 }}>{a.categoria}</p>
                        {fxLabels.length > 0 && <p className="font-dm text-[11px] sm:text-xs" style={{ color:T }}>Disponibilidade: {fxLabels.join(', ')}</p>}
                        {bk?.slots && <p className="font-dm text-[11px] sm:text-xs font-medium" style={{ color:'#D4854A' }}>Alocado: {fmtD(bk.slots.data)} às {bk.slots.hora}</p>}
                        {a.ja_participou && <p className="font-dm text-[11px] sm:text-xs" style={{ color:'#8B5CF6' }}>Já participou de grupo</p>}
                        {a.observacoes && <p className="font-dm text-[11px] sm:text-xs mt-1 italic" style={{ color:X3 }}>&ldquo;{a.observacoes}&rdquo;</p>}
                      </div>
                    </div>

                    {/* Action buttons: WhatsApp messages */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      {/* Confirmar */}
                      <button onClick={() => waLink(a.telefone, a.nome_completo, 'confirmacao', bk?.slots?.data, bk?.slots?.hora)} className="font-dm text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-all hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-1.5" style={{ backgroundColor:'rgba(37,211,102,0.12)', color:'#25D366' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Confirmar
                      </button>
                      {/* Cobrar */}
                      <button onClick={() => waLink(a.telefone, a.nome_completo, 'cobranca', bk?.slots?.data, bk?.slots?.hora)} className="font-dm text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-all hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-1.5" style={{ backgroundColor:'rgba(212,133,74,0.12)', color:'#D4854A' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Cobrar
                      </button>
                      {/* Remover */}
                      <button onClick={() => waLink(a.telefone, a.nome_completo, 'remocao', bk?.slots?.data, bk?.slots?.hora)} className="font-dm text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-all hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-1.5" style={{ backgroundColor:'rgba(200,75,49,0.12)', color:'#C84B31' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Remover
                      </button>
                      {/* Reaproveitar */}
                      <button onClick={() => waLink(a.telefone, a.nome_completo, 'reaproveitar')} className="font-dm text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-all hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-1.5" style={{ backgroundColor:'rgba(139,92,246,0.12)', color:'#8B5CF6' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                        Reaproveitar
                      </button>
                      {/* WhatsApp direto */}
                      <a href={`https://wa.me/${a.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-dm text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl font-medium transition-all hover:-translate-y-0.5 inline-flex items-center gap-1.5 cursor-pointer" style={{ backgroundColor:'rgba(37,211,102,0.08)', color:'#25D366' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                    </div>

                    {/* Status change + actions */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-2" style={{ borderTop:`1px solid ${isDone ? 'rgba(255,255,255,0.03)' : B}` }}>
                      {Object.entries(ST).filter(([k]) => k !== a.status).map(([k,v]) => <button key={k} onClick={() => updStatus(a.id, k)} className="font-dm text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg font-medium" style={{ backgroundColor:v.bg, color:v.tx }}>{v.lb}</button>)}
                      {!bk && !isDone && <button onClick={() => setAssigning(a)} className="font-dm text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg font-medium text-white inline-flex items-center gap-1" style={{ backgroundColor:T }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>Alocar</button>}
                      {bk && <button onClick={() => rmBooking(bk.id)} className="font-dm text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg font-medium" style={{ color:'#C84B31', backgroundColor:'rgba(200,75,49,0.06)' }}>Desalocar</button>}
                      <button onClick={() => delAval(a.id)} className="font-dm text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg font-medium" style={{ backgroundColor:'rgba(200,75,49,0.06)', color:'#C84B31' }}>Excluir</button>
                    </div>
                  </div>
                </motion.div>
              )})}
            </div>
          )}
        </div>

      ) : tab === 'avaliacoes' ? (
        /* ===== AVALIAÇÕES ===== */
        <AvaliacaoTool key={refreshKey} avaliadorNome="Admin" onDataChange={() => setStatsKey(k => k + 1)} />

      ) : tab === 'stats' ? (
        /* ===== ESTATÍSTICAS ===== */
        <StatsPanel key={statsKey} isAdmin />

      ) : (
        /* ===== MENSAGENS ===== */
        <div className="space-y-6">
          <p className="font-dm text-sm" style={{ color:X2 }}>Variáveis: <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor:'rgba(253,251,247,0.06)', color:T }}>{'{nome}'}</code> <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor:'rgba(253,251,247,0.06)', color:T }}>{'{data}'}</code> <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor:'rgba(253,251,247,0.06)', color:T }}>{'{hora}'}</code> <code className="px-1.5 py-0.5 rounded text-xs" style={{ backgroundColor:'rgba(253,251,247,0.06)', color:T }}>{'{link}'}</code></p>
          {msgs.map(m => { const ed = editMsg?.tipo === m.tipo; const col: Record<string,string> = { confirmacao:T, cobranca:'#D4854A', remocao:'#C84B31', reaproveitar:'#8B5CF6' }; const ic: Record<string,string> = { confirmacao:'✓', cobranca:'⏰', remocao:'✕', reaproveitar:'↻' }; return (
            <div key={m.tipo} className="rounded-2xl p-6" style={{ backgroundColor:C, border:`1.5px solid ${B}` }}>
              <div className="flex items-center gap-3 mb-4"><div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor:`${col[m.tipo]||'#5C5C5C'}20`, color:col[m.tipo]||'#5C5C5C' }}>{ic[m.tipo]||'?'}</div><div><h3 className="font-dm text-sm font-bold" style={{ color:X }}>{m.titulo}</h3><p className="font-dm text-xs" style={{ color:X3 }}>{m.tipo}</p></div></div>
              {ed ? (<div><textarea value={editTpl} onChange={e => setEditTpl(e.target.value)} rows={4} className="font-dm text-sm w-full px-4 py-3 rounded-xl outline-none resize-none mb-3" style={{ backgroundColor:'rgba(253,251,247,0.04)', border:`1.5px solid ${T}`, color:X }} /><div className="flex gap-2"><button onClick={saveMsg} className="font-dm text-sm px-5 py-2 rounded-xl text-white font-medium" style={{ backgroundColor:T }}>Salvar</button><button onClick={() => setEditMsg(null)} className="font-dm text-sm px-5 py-2 rounded-xl" style={{ color:X3 }}>Cancelar</button></div></div>
              ) : (<div><p className="font-dm text-sm mb-3 leading-relaxed px-4 py-3 rounded-xl" style={{ color:X2, backgroundColor:'rgba(253,251,247,0.03)' }}>{m.template}</p><button onClick={() => { setEditMsg(m); setEditTpl(m.template) }} className="font-dm text-xs px-4 py-2 rounded-xl font-medium" style={{ backgroundColor:'rgba(14,165,160,0.1)', color:T }}>Editar</button></div>)}
            </div>
          )})}
        </div>
      )}

      {/* Modal alocar */}
      <AnimatePresence>{assigning && (() => {
        // Get candidate's fixo day preferences
        let prefDias: string[] = []
        try {
          const ids = JSON.parse(assigning.fixos_escolhidos || '[]') as string[]
          prefDias = ids.map(id => { const f = fixos.find(x => x.id === id); return f?.dia_semana || '' }).filter(Boolean)
        } catch {}

        // Map date to dia_semana
        const getDiaSemana = (dateStr: string) => {
          const d = new Date(dateStr + 'T00:00:00').getDay()
          return ['domingo','segunda','terca','quarta','quinta','sexta','sabado'][d]
        }

        const activeSlots = avulsos.filter(s => s.ativo).sort((a,b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`))
        const matching = activeSlots.filter(s => prefDias.includes(getDiaSemana(s.data)))
        const others = activeSlots.filter(s => !prefDias.includes(getDiaSemana(s.data)))

        return (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 flex items-center justify-center z-50 p-5" style={{ backgroundColor:'rgba(0,0,0,0.6)' }} onClick={() => setAssigning(null)}>
          <motion.div initial={{ scale:0.95, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.95 }} onClick={e => e.stopPropagation()} className="rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" style={{ backgroundColor:'#1A1A1A', border:`1.5px solid ${B}` }}>
            <h3 className="font-fraunces text-xl mb-1" style={{ color:X }}>Alocar candidato</h3>
            <p className="font-dm text-sm mb-2" style={{ color:X2 }}>Horário avulso para <strong style={{ color:X }}>{assigning.nome_completo}</strong></p>
            {prefDias.length > 0 && (
              <p className="font-dm text-xs mb-4 px-3 py-2 rounded-xl" style={{ backgroundColor:'rgba(14,165,160,0.08)', color:T }}>
                <svg className="inline mr-1.5 -mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                Disponibilidade: {prefDias.map(d => DIAS_SHORT[d]).filter((v,i,a) => a.indexOf(v) === i).join(', ')}
              </p>
            )}

            {matching.length > 0 && (
              <div className="mb-4">
                <p className="font-dm text-xs font-bold mb-2" style={{ color:T }}>Horários compatíveis</p>
                <div className="space-y-2">{matching.map(s => (
                  <button key={s.id} onClick={() => assign(s.id)} className="font-dm text-sm w-full text-left px-5 py-3.5 rounded-2xl transition-all hover:opacity-80" style={{ backgroundColor:'rgba(14,165,160,0.06)', border:`1.5px solid rgba(14,165,160,0.25)`, color:X }}>
                    <span className="font-bold">{fmtD(s.data)}</span> — {s.hora} <span className="text-xs ml-2" style={{ color: (s.bookings?.length||0)>=s.max_avaliados ? '#C84B31' : T }}>({s.bookings?.length||0}/{s.max_avaliados})</span>
                    <span className="font-dm text-xs ml-2 px-1.5 py-0.5 rounded" style={{ backgroundColor:'rgba(14,165,160,0.1)', color:T }}>compatível</span>
                  </button>
                ))}</div>
              </div>
            )}

            {others.length > 0 && (
              <div>
                {matching.length > 0 && <p className="font-dm text-xs font-bold mb-2" style={{ color:X3 }}>Outros horários</p>}
                <div className="space-y-2">{others.map(s => (
                  <button key={s.id} onClick={() => assign(s.id)} className="font-dm text-sm w-full text-left px-5 py-3.5 rounded-2xl transition-all hover:opacity-80" style={{ backgroundColor:C, border:`1.5px solid ${B}`, color:X }}>
                    <span className="font-bold">{fmtD(s.data)}</span> — {s.hora} <span className="text-xs ml-2" style={{ color: (s.bookings?.length||0)>=s.max_avaliados ? '#C84B31' : X3 }}>({s.bookings?.length||0}/{s.max_avaliados})</span>
                  </button>
                ))}</div>
              </div>
            )}

            {activeSlots.length === 0 && <p className="font-dm text-sm py-6 text-center" style={{ color:X3 }}>Nenhum horário avulso ativo.</p>}

            <button onClick={() => setAssigning(null)} className="font-dm text-sm mt-4 w-full py-2.5 rounded-xl" style={{ backgroundColor:C, color:X3 }}>Cancelar</button>
          </motion.div>
        </motion.div>
        )
      })()}</AnimatePresence>

      <AnimatePresence>{toast && <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 font-dm text-sm px-5 py-3 rounded-2xl shadow-xl z-50 font-medium" style={{ backgroundColor:'rgba(253,251,247,0.95)', color:'#1A1A1A' }}>{toast}</motion.div>}</AnimatePresence>
      </div>
    </div>
  )
}
