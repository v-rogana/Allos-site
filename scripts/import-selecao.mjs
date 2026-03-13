import { readFileSync } from 'fs'

const CSV_PATH = 'C:\\Users\\gabri\\OneDrive\\Desktop\\selecao_export.csv'
const API_URL = 'http://localhost:3000/api/avaliallos/importar'

// Proper CSV parser that handles quoted multiline fields
function parseCSV(text) {
  const rows = []
  let headers = null
  let currentRow = []
  let currentField = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        // Escaped quote
        currentField += '"'
        i++
      } else if (ch === '"') {
        // End of quoted field
        inQuotes = false
      } else {
        currentField += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        currentRow.push(currentField.trim())
        currentField = ''
      } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
        if (ch === '\r') i++ // skip \n after \r
        currentRow.push(currentField.trim())
        currentField = ''

        if (!headers) {
          headers = currentRow
        } else if (currentRow.some(f => f !== '')) {
          const obj = {}
          headers.forEach((h, j) => { obj[h] = currentRow[j] || '' })
          rows.push(obj)
        }
        currentRow = []
      } else {
        currentField += ch
      }
    }
  }

  // Last row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim())
    if (headers && currentRow.some(f => f !== '')) {
      const obj = {}
      headers.forEach((h, j) => { obj[h] = currentRow[j] || '' })
      rows.push(obj)
    }
  }

  return rows
}

async function main() {
  // Step 1: Delete previous import
  console.log('Deleting previous import...')
  const delRes = await fetch(API_URL, { method: 'DELETE' })
  const delResult = await delRes.json()
  console.log(`Deleted: ${delResult.deleted_avaliacoes} avaliacoes, ${delResult.deleted_avaliados} avaliados`)

  // Step 2: Parse CSV
  console.log('\nReading CSV...')
  const text = readFileSync(CSV_PATH, 'utf-8')
  const rows = parseCSV(text)
  console.log(`Parsed ${rows.length} rows`)

  // Validate first row
  const first = rows[0]
  console.log('First row fields:', Object.keys(first).join(', '))
  console.log('First avaliado:', first.associado_avaliado || first.nome)
  console.log('First avaliador:', first.terapeuta_avaliador)
  console.log('First scores:', first.estagio_mudanca, first.estrutura, first.acolhimento)

  // Step 3: Import in batches
  const batchSize = 50
  let totalImported = 0
  let totalSkipped = 0
  const allErrors = []
  const allAvaliadores = []

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    console.log(`\nBatch ${Math.floor(i / batchSize) + 1} (${batch.length} rows)...`)

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows: batch }),
    })

    const result = await res.json()
    console.log(`  imported: ${result.imported}, skipped: ${result.skipped}`)

    if (result.criadosAvaliadores?.length) {
      console.log(`  New avaliadores: ${result.criadosAvaliadores.join(', ')}`)
      allAvaliadores.push(...result.criadosAvaliadores)
    }

    if (result.errors?.length) {
      result.errors.forEach(e => console.log(`  ERROR: ${e}`))
      allErrors.push(...result.errors)
    }

    totalImported += result.imported || 0
    totalSkipped += result.skipped || 0
  }

  console.log('\n=== DONE ===')
  console.log(`Total imported: ${totalImported}`)
  console.log(`Total skipped: ${totalSkipped}`)
  if (allAvaliadores.length) console.log(`New avaliadores created: ${allAvaliadores.join(', ')}`)
  if (allErrors.length) console.log(`Errors: ${allErrors.length}`)
}

main().catch(console.error)
