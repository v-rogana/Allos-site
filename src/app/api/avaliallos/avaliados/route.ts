import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const status = new URL(req.url).searchParams.get('status')

  let q = sb.from('avaliados').select('*').order('criado_em', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data: avaliados, error: e1 } = await q
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 })

  const { data: bks } = await sb.from('bookings').select('*, slots ( id, data, hora )')

  const result = (avaliados || []).map(a => ({
    ...a,
    bookings: (bks || []).filter(b => b.avaliado_id === a.id),
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()
  let tel = body.telefone.replace(/\D/g, '')
  if (!tel.startsWith('+')) tel = tel.startsWith('55') ? '+' + tel : '+55' + tel
  const insert: Record<string, unknown> = {
    nome_completo: body.nome_completo, telefone: tel,
    ja_participou: body.ja_participou ?? false, categoria: body.categoria,
    observacoes: body.observacoes || null, status: 'aguardando',
    fixos_escolhidos: body.fixos_escolhidos || '[]',
    slot_preferencia: body.slot_preferencia || null,
  }
  const { data, error } = await sb.from('avaliados').insert(insert).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Se escolheu avulso, criar booking
  if (body.avulso_slot_id) {
    await sb.from('bookings').insert({ avaliado_id: data.id, slot_id: body.avulso_slot_id })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const { id, ...updates } = await req.json()
  const { data, error } = await sb.from('avaliados').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })
  const { error } = await sb.from('avaliados').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
