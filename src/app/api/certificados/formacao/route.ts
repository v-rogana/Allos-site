import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const sb = () => getSupabaseAdmin()

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')

  if (type === 'horarios') {
    const { data, error } = await sb().from('formacao_horarios').select('*').order('ordem')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (type === 'slots') {
    const { data, error } = await sb().from('formacao_slots').select('*, formacao_horarios(hora, ordem)')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (type === 'alocacoes') {
    const { data, error } = await sb().from('formacao_alocacoes').select('*, certificado_condutores(id, nome, telefone)')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (type === 'condutores') {
    const { data, error } = await sb().from('certificado_condutores').select('*').eq('ativo', true).order('nome')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (type === 'cronograma') {
    const { data, error } = await sb().from('formacao_cronograma').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || null)
  }

  // All events (admin)
  if (type === 'eventos') {
    const { data, error } = await sb().from('certificado_eventos').select('*').order('data_inicio', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  // Active events only (public - filtered by date)
  if (type === 'eventos_ativos') {
    const now = new Date().toISOString()
    const { data, error } = await sb()
      .from('certificado_eventos')
      .select('*')
      .eq('ativo', true)
      .lte('data_inicio', now)
      .gte('data_fim', now)
      .order('data_fim')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  return NextResponse.json({ error: 'type param required' }, { status: 400 })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  // Horários
  if (action === 'create_horario') {
    const { hora } = body
    const maxOrdem = await sb().from('formacao_horarios').select('ordem').order('ordem', { ascending: false }).limit(1)
    const ordem = (maxOrdem.data?.[0]?.ordem || 0) + 1
    const { data, error } = await sb().from('formacao_horarios').insert({ hora, ordem }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (action === 'update_horario') {
    const { id, hora, ativo } = body
    const updates: Record<string, unknown> = {}
    if (hora !== undefined) updates.hora = hora
    if (ativo !== undefined) updates.ativo = ativo
    const { error } = await sb().from('formacao_horarios').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === 'delete_horario') {
    const { id } = body
    const { error } = await sb().from('formacao_horarios').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Slots
  if (action === 'create_slot') {
    const { dia_semana, horario_id } = body
    const { data, error } = await sb().from('formacao_slots').insert({ dia_semana, horario_id }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (action === 'update_slot') {
    const { id, ativo, status, atividade_nome } = body
    const updates: Record<string, unknown> = {}
    if (ativo !== undefined) updates.ativo = ativo
    if (status !== undefined) updates.status = status
    if (atividade_nome !== undefined) updates.atividade_nome = atividade_nome
    const { error } = await sb().from('formacao_slots').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === 'delete_slot') {
    const { id } = body
    const { error } = await sb().from('formacao_slots').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Alocações
  if (action === 'add_alocacao') {
    const { slot_id, condutor_id } = body
    const { data, error } = await sb().from('formacao_alocacoes').insert({ slot_id, condutor_id }).select('*, certificado_condutores(id, nome, telefone)').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (action === 'remove_alocacao') {
    const { id } = body
    const { error } = await sb().from('formacao_alocacoes').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Condutor telefone
  if (action === 'update_condutor_telefone') {
    const { id, telefone } = body
    const { error } = await sb().from('certificado_condutores').update({ telefone }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // Cronograma imagem
  if (action === 'update_cronograma_img') {
    const { imagem_base64 } = body
    // Upsert: update first row or insert
    const { data: existing } = await sb().from('formacao_cronograma').select('id').limit(1).single()
    if (existing) {
      const { error } = await sb().from('formacao_cronograma').update({ imagem_base64, updated_at: new Date().toISOString() }).eq('id', existing.id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      const { error } = await sb().from('formacao_cronograma').insert({ imagem_base64 })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  // Reset all statuses to pendente
  if (action === 'reset_statuses') {
    const { error } = await sb().from('formacao_slots').update({ status: 'pendente' }).neq('status', 'pendente')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // ── Eventos ──────────────────────────────────────────────
  if (action === 'create_evento') {
    const { titulo, descricao, data_inicio, data_fim } = body
    const { data, error } = await sb().from('certificado_eventos')
      .insert({ titulo, descricao: descricao || null, data_inicio, data_fim })
      .select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (action === 'update_evento') {
    const { id, titulo, descricao, data_inicio, data_fim, ativo } = body
    const updates: Record<string, unknown> = {}
    if (titulo !== undefined) updates.titulo = titulo
    if (descricao !== undefined) updates.descricao = descricao || null
    if (data_inicio !== undefined) updates.data_inicio = data_inicio
    if (data_fim !== undefined) updates.data_fim = data_fim
    if (ativo !== undefined) updates.ativo = ativo
    const { error } = await sb().from('certificado_eventos').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === 'delete_evento') {
    const { id } = body
    const { error } = await sb().from('certificado_eventos').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
