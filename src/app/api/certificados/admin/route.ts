import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

const sb = () => getSupabaseAdmin()

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')

  if (type === 'submissions') {
    const { data, error } = await sb().from('certificado_submissions').select('*').order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (type === 'atividades') {
    const { data, error } = await sb().from('certificado_atividades').select('*').order('nome')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (type === 'condutores') {
    const { data, error } = await sb().from('certificado_condutores').select('*').order('nome')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  return NextResponse.json({ error: 'type param required' }, { status: 400 })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  // ─── Atividades ─────────────────────────────────────────────
  if (action === 'create_atividade') {
    const { nome } = body
    const { data, error } = await sb().from('certificado_atividades').insert({ nome }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (action === 'toggle_atividade') {
    const { id, ativo } = body
    const { error } = await sb().from('certificado_atividades').update({ ativo }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === 'delete_atividade') {
    const { id } = body
    const { error } = await sb().from('certificado_atividades').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // ─── Condutores ─────────────────────────────────────────────
  if (action === 'create_condutor') {
    const { nome } = body
    const { data, error } = await sb().from('certificado_condutores').insert({ nome }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  if (action === 'update_condutor') {
    const { id, nome, telefone, observacoes } = body
    const updates: Record<string, unknown> = {}
    if (nome !== undefined) updates.nome = nome
    if (telefone !== undefined) updates.telefone = telefone
    if (observacoes !== undefined) updates.observacoes = observacoes
    const { error } = await sb().from('certificado_condutores').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === 'toggle_condutor') {
    const { id, ativo } = body
    const { error } = await sb().from('certificado_condutores').update({ ativo }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === 'delete_condutor') {
    const { id } = body
    const { error } = await sb().from('certificado_condutores').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // ─── Submissions bulk delete ────────────────────────────────
  if (action === 'delete_submissions') {
    const { ids } = body
    if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: 'ids required' }, { status: 400 })
    const { error } = await sb().from('certificado_submissions').delete().in('id', ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, deleted: ids.length })
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
