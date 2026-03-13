import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// DELETE: clean up imported data
export async function DELETE() {
  const sb = getSupabaseAdmin()

  // Delete avaliacoes with nome_sessao = 'Processo Seletivo'
  const { error: e1, count: c1 } = await sb
    .from('avaliacoes')
    .delete({ count: 'exact' })
    .eq('nome_sessao', 'Processo Seletivo')

  // Delete avaliados with status = 'avaliacao_realizada'
  const { error: e2, count: c2 } = await sb
    .from('avaliados')
    .delete({ count: 'exact' })
    .eq('status', 'avaliacao_realizada')

  if (e1 || e2) return NextResponse.json({ error: e1?.message || e2?.message }, { status: 500 })
  return NextResponse.json({ deleted_avaliacoes: c1, deleted_avaliados: c2 })
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin()
  const { rows } = await req.json() as { rows: Record<string, string>[] }

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
  }

  // Load existing avaliadores
  const { data: avaliadores } = await sb.from('avaliadores').select('id, nome')
  const avaliadorMap = new Map<string, string>()
  ;(avaliadores || []).forEach(a => avaliadorMap.set(a.nome.trim().toLowerCase(), a.id))

  // Load existing avaliados
  const { data: avaliadosExist } = await sb.from('avaliados').select('id, nome_completo')
  const avaliadoMap = new Map<string, string>()
  ;(avaliadosExist || []).forEach(a => avaliadoMap.set(a.nome_completo.trim().toLowerCase(), a.id))

  let imported = 0
  let skipped = 0
  const errors: string[] = []
  const criadosAvaliadores: string[] = []

  for (const row of rows) {
    try {
      // Determine avaliado name: associado_avaliado OR nome
      const avaliadoNome = (row.associado_avaliado || row.nome || '').trim()
      if (!avaliadoNome) { skipped++; continue }

      // Find or create avaliado
      const avaliadoKey = avaliadoNome.toLowerCase()
      let avaliadoId = avaliadoMap.get(avaliadoKey)

      if (!avaliadoId) {
        const { data: created, error: err } = await sb.from('avaliados')
          .insert({
            nome_completo: avaliadoNome,
            telefone: '',
            categoria: 'Avaliação já realizada',
            status: 'avaliacao_realizada',
            ja_participou: true,
            fixos_escolhidos: '[]',
          })
          .select('id')
          .single()

        if (err || !created) {
          errors.push(`Avaliado "${avaliadoNome}": ${err?.message}`)
          skipped++
          continue
        }
        avaliadoId = created.id
        avaliadoMap.set(avaliadoKey, created.id)
      }

      // Find or create avaliador
      const avaliadorNome = (row.terapeuta_avaliador || '').trim()
      let avaliadorId: string | null = null

      if (avaliadorNome) {
        const existing = avaliadorMap.get(avaliadorNome.toLowerCase())
        if (existing) {
          avaliadorId = existing
        } else {
          const { data: created, error: err } = await sb.from('avaliadores')
            .insert({ nome: avaliadorNome })
            .select('id')
            .single()

          if (err || !created) {
            errors.push(`Avaliador "${avaliadorNome}": ${err?.message}`)
          } else {
            avaliadorId = created.id
            avaliadorMap.set(avaliadorNome.toLowerCase(), created.id)
            criadosAvaliadores.push(avaliadorNome)
          }
        }
      }

      // Parse date
      const createdAt = row.created_at || ''
      const data = createdAt ? createdAt.split(' ')[0] : new Date().toISOString().split('T')[0]

      // Insert avaliacao — NO observacoes
      const { error: insertErr } = await sb.from('avaliacoes').insert({
        data,
        avaliador_id: avaliadorId,
        avaliado_id: avaliadoId,
        nome_sessao: 'Processo Seletivo',
        estagio_mudanca: parseInt(row.estagio_mudanca) || 0,
        estrutura_coerencia: parseInt(row.estrutura) || 0,
        encerramento_abertura: parseInt(row.encerramento) || 0,
        acolhimento: parseInt(row.acolhimento) || 0,
        seguranca_terapeuta: parseInt(row.seguranca_terapeuta) || 0,
        seguranca_metodo: parseInt(row.seguranca_metodo) || 0,
        aprofundamento: parseInt(row.aprofundar) || 0,
        hipoteses: parseInt(row.hipoteses) || 0,
        interpretacao: parseInt(row.interpretacao) || 0,
        frase_timing: parseInt(row.frase_timing) || 0,
        corpo_setting: parseInt(row.corpo_setting) || 0,
        insight_potencia: parseInt(row.insight_potencia) || 0,
        observacoes: null,
      })

      if (insertErr) {
        errors.push(`Avaliação "${avaliadoNome}": ${insertErr.message}`)
        skipped++
      } else {
        imported++
      }
    } catch (e) {
      errors.push(`Erro: ${e}`)
      skipped++
    }
  }

  return NextResponse.json({ imported, skipped, criadosAvaliadores, errors: errors.slice(0, 30) })
}
