import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const avaliador_id = new URL(req.url).searchParams.get('avaliador_id')

  const { data: avaliacoes, error } = await sb.from('avaliacoes').select('*').order('data', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get avaliadores and avaliados for names
  const { data: avaliadores } = await sb.from('avaliadores').select('id, nome')
  const { data: avaliados } = await sb.from('avaliados').select('id, nome_completo')

  const result = (avaliacoes || [])
    .filter(a => !avaliador_id || a.avaliador_id === avaliador_id)
    .map(a => ({
      ...a,
      avaliador_nome: (avaliadores || []).find(x => x.id === a.avaliador_id)?.nome || 'N/A',
      avaliado_nome: (avaliados || []).find(x => x.id === a.avaliado_id)?.nome_completo || null,
    }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const body = await req.json()
  // Clean empty strings to null for UUID fields
  if (body.avaliador_id === '') body.avaliador_id = null
  if (body.avaliado_id === '') body.avaliado_id = null
  const { data, error } = await sb.from('avaliacoes').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const { id, ...updates } = await req.json()
  // Clean empty strings to null for UUID fields
  if (updates.avaliador_id === '') updates.avaliador_id = null
  if (updates.avaliado_id === '') updates.avaliado_id = null
  const { data, error } = await sb.from('avaliacoes').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID necessário' }, { status: 400 })
  const { error } = await sb.from('avaliacoes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
