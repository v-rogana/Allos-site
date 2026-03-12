import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin()

  // Single delete via query param
  const id = req.nextUrl.searchParams.get('id')
  if (id) {
    const { error } = await sb.from('certificado_submissions').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, deleted: 1 })
  }

  // Bulk delete via body
  const body = await req.json().catch(() => null)
  if (!body?.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: 'ids array required' }, { status: 400 })
  }

  const { error } = await sb.from('certificado_submissions').delete().in('id', body.ids)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, deleted: body.ids.length })
}
