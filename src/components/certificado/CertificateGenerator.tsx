'use client'

import { useRef, useEffect, useCallback } from 'react'

interface CertificateData {
  nomeParticipante: string
  nomeSocial?: string
  atividade: string
  data: string
}

interface CertificateGeneratorProps {
  data: CertificateData
  onReady?: () => void
}

function formatDatePtBR(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ]
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`
}

export default function CertificateGenerator({ data, onReady }: CertificateGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawCertificate = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, h)

    // Decorative border
    drawBorder(ctx, w, h)

    const cx = w / 2
    const displayName = data.nomeSocial || data.nomeParticipante

    // Allos header
    ctx.textAlign = 'center'

    // Allos icon (circles)
    drawAllosIcon(ctx, cx, 100, 28)

    // Association name
    ctx.font = 'bold 28px Georgia, serif'
    ctx.fillStyle = '#1A1A1A'
    ctx.fillText('ASSOCIAÇÃO ALLOS', cx, 155)

    ctx.font = '13px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#5C5C5C'
    ctx.letterSpacing = '3px'
    ctx.fillText('PSICOLOGIA  •  FORMAÇÃO  •  PESQUISA', cx, 178)

    // Divider line
    ctx.beginPath()
    ctx.moveTo(cx - 120, 200)
    ctx.lineTo(cx + 120, 200)
    ctx.strokeStyle = '#C84B31'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Certificate title
    ctx.font = 'bold 36px Georgia, serif'
    ctx.fillStyle = '#1A1A1A'
    ctx.fillText('CERTIFICADO', cx, 258)
    ctx.font = '16px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#5C5C5C'
    ctx.fillText('DE PARTICIPAÇÃO', cx, 282)

    // Body text
    const bodyY = 340
    ctx.font = '16px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText('Certificamos que', cx, bodyY)

    // Participant name
    ctx.font = 'bold italic 30px Georgia, serif'
    ctx.fillStyle = '#C84B31'
    ctx.fillText(displayName, cx, bodyY + 50)

    // Decorative line under name
    const nameWidth = ctx.measureText(displayName).width
    ctx.beginPath()
    ctx.moveTo(cx - nameWidth / 2 - 20, bodyY + 62)
    ctx.lineTo(cx + nameWidth / 2 + 20, bodyY + 62)
    ctx.strokeStyle = 'rgba(200,75,49,0.3)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Activity text
    ctx.font = '16px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText('participou da atividade', cx, bodyY + 100)

    ctx.font = 'bold 22px Georgia, serif'
    ctx.fillStyle = '#1A1A1A'
    ctx.fillText(`"${data.atividade}"`, cx, bodyY + 135)

    // Details
    ctx.font = '16px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText('promovida pela Associação Allos, com carga horária de', cx, bodyY + 175)

    ctx.font = 'bold 18px Georgia, serif'
    ctx.fillStyle = '#1A1A1A'
    ctx.fillText('2 (duas) horas', cx, bodyY + 205)

    // Date
    ctx.font = '16px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText(`realizada em ${formatDatePtBR(data.data)}.`, cx, bodyY + 240)

    // Belo Horizonte date
    ctx.font = 'italic 14px Georgia, serif'
    ctx.fillStyle = '#5C5C5C'
    ctx.fillText(`Belo Horizonte, ${formatDatePtBR(data.data)}`, cx, bodyY + 290)

    // Signature area
    const sigY = h - 160

    // Signature line
    ctx.beginPath()
    ctx.moveTo(cx - 130, sigY)
    ctx.lineTo(cx + 130, sigY)
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 0.8
    ctx.stroke()

    // Signature text
    ctx.font = 'bold 14px Georgia, serif'
    ctx.fillStyle = '#1A1A1A'
    ctx.textAlign = 'center'
    ctx.fillText('João de Bragança e Moreira', cx, sigY + 20)

    ctx.font = '12px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#5C5C5C'
    ctx.fillText('Secretário Geral', cx, sigY + 38)
    ctx.fillText('CRP-04/75654', cx, sigY + 54)

    // CNPJ
    ctx.font = '11px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#888888'
    ctx.fillText('CNPJ Emissor: 50.990.346/0001-52', cx, sigY + 82)

  }, [data])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = 1122
    const h = 794
    canvas.width = w
    canvas.height = h

    drawCertificate(ctx, w, h)
    onReady?.()
  }, [data, drawCertificate, onReady])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    const displayName = data.nomeSocial || data.nomeParticipante
    link.download = `Certificado_Allos_${displayName.replace(/\s+/g, '_')}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ maxWidth: '100%', display: 'block' }}
        />
      </div>
      <button
        onClick={handleDownload}
        className="w-full font-dm font-bold text-sm py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
        style={{
          backgroundColor: '#C84B31',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(200,75,49,0.35)',
        }}
      >
        Baixar Certificado
      </button>
    </div>
  )
}

function drawAllosIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.strokeStyle = '#2E9E8F'

  // Outer dashed circle
  ctx.setLineDash([6, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  // Middle circle
  ctx.setLineDash([])
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2)
  ctx.stroke()

  // Center dot
  ctx.fillStyle = '#2E9E8F'
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.15, 0, Math.PI * 2)
  ctx.fill()
}

function drawBorder(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const m = 30
  const m2 = 38
  const m3 = 42

  // Outer border
  ctx.strokeStyle = '#4A7BA7'
  ctx.lineWidth = 2
  ctx.strokeRect(m, m, w - m * 2, h - m * 2)

  // Middle decorative border
  ctx.strokeStyle = '#6B9DC4'
  ctx.lineWidth = 0.8
  ctx.setLineDash([12, 4])
  ctx.strokeRect(m2, m2, w - m2 * 2, h - m2 * 2)
  ctx.setLineDash([])

  // Inner border
  ctx.strokeStyle = '#4A7BA7'
  ctx.lineWidth = 1.5
  ctx.strokeRect(m3, m3, w - m3 * 2, h - m3 * 2)

  // Corner decorations
  const corners = [
    [m + 5, m + 5],
    [w - m - 5, m + 5],
    [m + 5, h - m - 5],
    [w - m - 5, h - m - 5],
  ]

  corners.forEach(([x, y]) => {
    ctx.fillStyle = '#4A7BA7'
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()
  })

  // Guilloche-like decorative lines (top and bottom)
  drawGuilloche(ctx, w, m, h, m)
}

function drawGuilloche(ctx: CanvasRenderingContext2D, w: number, topM: number, h: number, bottomM: number) {
  ctx.save()
  ctx.globalAlpha = 0.08

  // Subtle wave patterns along borders
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.strokeStyle = '#4A7BA7'
    ctx.lineWidth = 0.5
    for (let x = 50; x < w - 50; x += 2) {
      const y = topM + 4 + Math.sin((x + i * 30) * 0.03) * 3
      if (x === 50) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.strokeStyle = '#4A7BA7'
    ctx.lineWidth = 0.5
    for (let x = 50; x < w - 50; x += 2) {
      const y = h - bottomM - 4 + Math.sin((x + i * 30) * 0.03) * 3
      if (x === 50) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // Diagonal decorative lines in corners
  const size = 60
  const positions = [
    { x: 50, y: 50, dx: 1, dy: 1 },
    { x: w - 50, y: 50, dx: -1, dy: 1 },
    { x: 50, y: h - 50, dx: 1, dy: -1 },
    { x: w - 50, y: h - 50, dx: -1, dy: -1 },
  ]

  positions.forEach(({ x, y, dx, dy }) => {
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.strokeStyle = '#C84B31'
      ctx.lineWidth = 0.4
      ctx.moveTo(x, y + dy * i * 4)
      ctx.lineTo(x + dx * size, y + dy * (size + i * 4))
      ctx.stroke()
    }
  })

  ctx.restore()
}
