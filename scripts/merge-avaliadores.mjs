const API_URL = 'http://localhost:3000/api/avaliallos'

async function main() {
  // Step 1: Fetch all avaliadores
  console.log('Fetching avaliadores...')
  const avaliadores = await fetch(`${API_URL}/avaliadores`).then(r => r.json())
  console.log(`Found ${avaliadores.length} avaliadores\n`)

  // Step 2: Normalize names and find duplicates
  // Strategy: group by surname (last word of nome), then check if first names match
  const normalize = (name) => name.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents

  // Group by surname
  const bySurname = new Map()
  for (const a of avaliadores) {
    const parts = normalize(a.nome).split(/\s+/)
    const surname = parts[parts.length - 1]
    const firstName = parts[0]
    const key = `${firstName}_${surname}`
    if (!bySurname.has(key)) bySurname.set(key, [])
    bySurname.get(key).push(a)
  }

  // Find groups with duplicates
  const duplicates = []
  for (const [key, group] of bySurname) {
    if (group.length > 1) {
      duplicates.push({ key, group })
    }
  }

  if (duplicates.length === 0) {
    console.log('No duplicate avaliadores found!')
    return
  }

  console.log(`Found ${duplicates.length} potential duplicate groups:\n`)
  for (const { key, group } of duplicates) {
    console.log(`  Group "${key}":`)
    for (const a of group) {
      console.log(`    - "${a.nome}" (id: ${a.id})`)
    }
    console.log()
  }

  // Step 3: Merge - keep the one with the longest name (most complete)
  console.log('Merging...\n')
  let totalMerged = 0

  for (const { key, group } of duplicates) {
    // Sort by name length descending - keep the longest
    const sorted = [...group].sort((a, b) => b.nome.length - a.nome.length)
    const target = sorted[0]
    const sources = sorted.slice(1)

    for (const source of sources) {
      console.log(`  Merging "${source.nome}" → "${target.nome}"`)
      const res = await fetch(`${API_URL}/avaliadores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'merge', source_id: source.id, target_id: target.id }),
      })
      const result = await res.json()
      if (result.success) {
        console.log(`    ✓ Merged ${result.merged_avaliacoes} avaliações`)
        totalMerged++
      } else {
        console.log(`    ✗ Error: ${result.error}`)
      }
    }
  }

  console.log(`\nDone! Merged ${totalMerged} duplicate avaliadores.`)
}

main().catch(console.error)
