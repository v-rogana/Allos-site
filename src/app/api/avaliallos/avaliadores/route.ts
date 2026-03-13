import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const sb = getSupabaseAdmin()

  const { data: avaliadores, error: e1 } = await sb.from('avaliadores').select('*').order('nome')
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 })

  // Buscar disponibilidades fixas
  const { data: dispFixos } = await sb.from('avaliador_disp_fixo').select('*, slots_fixos ( id, dia_semana, hora )')
  // Buscar disponibilidades avulsas
  const { data: dispAvulsos } = await sb.from('avaliador_disponibilidade').select('*, slots ( id, data, hora )')

  const result = (avaliadores || []).map(a => ({
    ...a,
    disp_fixos: (dispFixos || []).filter(d => d.avaliador_id === a.id),
    disp_avulsos: (dispAvulsos || []).filter(d => d.avaliador_id === a.id),
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()

  // Merge action: move all avaliacoes from source to target, then delete source
  if (body.action === 'merge') {
    const { source_id, target_id } = body
    if (!source_id || !target_id) return NextResponse.json({ error: 'source_id e target_id necessários' }, { status: 400 })

    // Update all avaliacoes pointing to source
    const { error: e1, count } = await sb.from('avaliacoes').update({ avaliador_id: target_id }, { count: 'exact' }).eq('avaliador_id', source_id)
    if (e1) return NextResponse.json({ error: e1.message }, { status: 500 })

    // Update disponibilidades
    await sb.from('avaliador_disp_fixo').update({ avaliador_id: target_id }).eq('avaliador_id', source_id)
    await sb.from('avaliador_disponibilidade').update({ avaliador_id: target_id }).eq('avaliador_id', source_id)

    // Delete source avaliador
    const { error: e2 } = await sb.from('avaliadores').delete().eq('id', source_id)
    if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })

    return NextResponse.json({ success: true, merged_avaliacoes: count })
  }

  let telefone = body.telefone?.replace(/\D/g, '') || ''
  if (telefone && !telefone.startsWith('+')) {
    telefone = telefone.startsWith('55') ? '+' + telefone : '+55' + telefone
  }

  const { data, error } = await sb.from('avaliadores').insert({
    nome: body.nome,
    telefone: telefone || null,
    capacidade_semanal: body.capacidade_semanal ?? 3,
    observacoes: body.observacoes || null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const { id, ...updates } = await req.json()

  if (updates.telefone) {
    let tel = updates.telefone.replace(/\D/g, '')
    if (!tel.startsWith('+')) tel = tel.startsWith('55') ? '+' + tel : '+55' + tel
    updates.telefone = tel
  }

  const { data, error } = await sb.from('avaliadores').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })
  const { error } = await sb.from('avaliadores').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
