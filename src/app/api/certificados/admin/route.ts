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

  // ─── Import submission (from Google Forms CSV) ─────────────
  if (action === 'import_submission') {
    const { nome_completo, email, atividade_nome, nota_grupo, nota_condutor, condutores, relato } = body
    if (!nome_completo && !email) return NextResponse.json({ error: 'nome or email required' }, { status: 400 })
    const { data, error } = await sb().from('certificado_submissions').insert({
      nome_completo: nome_completo || '',
      email: email || '',
      atividade_nome: atividade_nome || 'Importado',
      nota_grupo: nota_grupo || 0,
      nota_condutor: nota_condutor || 0,
      condutores: condutores || [],
      relato: relato || null,
      certificado_gerado: false,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  // ─── Submissions bulk delete ────────────────────────────────
  if (action === 'delete_submissions') {
    const { ids } = body
    if (!Array.isArray(ids) || ids.length === 0) return NextResponse.json({ error: 'ids required' }, { status: 400 })
    const { error } = await sb().from('certificado_submissions').delete().in('id', ids)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, deleted: ids.length })
  }

  // ─── Sync condutores from submissions ───────────────────────
  if (action === 'sync_condutores') {
    const { data: subs } = await sb().from('certificado_submissions').select('condutores')
    const { data: existing } = await sb().from('certificado_condutores').select('nome')
    const existingNames = new Set((existing || []).map((c: { nome: string }) => c.nome.toLowerCase()))
    const allNames = new Set<string>()
    ;(subs || []).forEach((s: { condutores: string[] | null }) => {
      ;(s.condutores || []).forEach(c => { if (c.trim()) allNames.add(c.trim()) })
    })
    const missing = Array.from(allNames).filter(n => !existingNames.has(n.toLowerCase()))
    if (missing.length > 0) {
      const { error } = await sb().from('certificado_condutores').insert(missing.map(nome => ({ nome })))
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, added: missing.length, names: missing })
  }

  // ─── Sync atividades from submissions ─────────────────────
  if (action === 'sync_atividades') {
    const { data: subs } = await sb().from('certificado_submissions').select('atividade_nome')
    const { data: existing } = await sb().from('certificado_atividades').select('nome')
    const existingNames = new Set((existing || []).map((a: { nome: string }) => a.nome.toLowerCase()))
    const allNames = new Set<string>()
    ;(subs || []).forEach((s: { atividade_nome: string }) => {
      if (s.atividade_nome?.trim()) allNames.add(s.atividade_nome.trim())
    })
    const missing = Array.from(allNames).filter(n => !existingNames.has(n.toLowerCase()))
    if (missing.length > 0) {
      // Import with ativo=false so admin must explicitly publish
      const { error } = await sb().from('certificado_atividades').insert(missing.map(nome => ({ nome, ativo: false })))
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, added: missing.length, names: missing })
  }

  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
