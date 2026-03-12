'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { jsPDF } from 'jspdf'

interface CertificateData {
  nomeParticipante: string
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
  const templateRef = useRef<HTMLImageElement | null>(null)
  const [templateLoaded, setTemplateLoaded] = useState(false)

  // Pre-load template image (PDF rendered as PNG)
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      templateRef.current = img
      setTemplateLoaded(true)
    }
    img.src = '/certificado-template.png'
  }, [])

  const drawCertificate = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const tpl = templateRef.current
    if (!tpl) return

    // Draw the full PDF template as background (border + signature + everything)
    ctx.drawImage(tpl, 0, 0, w, h)

    const cx = w / 2
    const displayName = data.nomeParticipante

    ctx.textAlign = 'center'

    // -- Dynamic content on top of the template --

    // Allos icon (circles)
    drawAllosIcon(ctx, cx, h * 0.095, 32)

    // Association name
    ctx.font = 'bold 32px Georgia, serif'
    ctx.fillStyle = '#1A1A1A'
    ctx.fillText('ASSOCIAÇÃO ALLOS', cx, h * 0.145)

    ctx.font = '14px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#5C5C5C'
    ctx.letterSpacing = '3px'
    ctx.fillText('PSICOLOGIA  •  FORMAÇÃO  •  PESQUISA', cx, h * 0.17)

    // Accent divider
    ctx.beginPath()
    ctx.moveTo(cx - 120, h * 0.19)
    ctx.lineTo(cx + 120, h * 0.19)
    ctx.strokeStyle = '#C84B31'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Certificate title
    ctx.font = 'bold 40px Georgia, serif'
    ctx.fillStyle = '#1A1A1A'
    ctx.fillText('CERTIFICADO', cx, h * 0.25)
    ctx.font = '17px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#5C5C5C'
    ctx.fillText('DE PARTICIPAÇÃO', cx, h * 0.28)

    // Body
    const bodyY = h * 0.35
    ctx.font = '17px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText('Certificamos que', cx, bodyY)

    // Participant name
    ctx.font = 'bold italic 34px Georgia, serif'
    ctx.fillStyle = '#C84B31'
    ctx.fillText(displayName, cx, bodyY + h * 0.055)

    // Decorative line under name
    const nameWidth = ctx.measureText(displayName).width
    ctx.beginPath()
    ctx.moveTo(cx - nameWidth / 2 - 20, bodyY + h * 0.07)
    ctx.lineTo(cx + nameWidth / 2 + 20, bodyY + h * 0.07)
    ctx.strokeStyle = 'rgba(200,75,49,0.3)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Activity
    ctx.font = '17px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText('participou da atividade', cx, bodyY + h * 0.115)

    ctx.font = 'bold 24px Georgia, serif'
    ctx.fillStyle = '#1A1A1A'
    ctx.fillText(`\u201C${data.atividade}\u201D`, cx, bodyY + h * 0.155)

    // Details
    ctx.font = '17px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText('promovida pela Associação Allos, com carga horária de', cx, bodyY + h * 0.2)

    ctx.font = 'bold 20px Georgia, serif'
    ctx.fillStyle = '#1A1A1A'
    ctx.fillText('2 (duas) horas', cx, bodyY + h * 0.235)

    // Date
    ctx.font = '17px "Helvetica Neue", Arial, sans-serif'
    ctx.fillStyle = '#333333'
    ctx.fillText(`realizada em ${formatDatePtBR(data.data)}.`, cx, bodyY + h * 0.275)

    // Belo Horizonte
    ctx.font = 'italic 15px Georgia, serif'
    ctx.fillStyle = '#5C5C5C'
    ctx.fillText(`Belo Horizonte, ${formatDatePtBR(data.data)}`, cx, bodyY + h * 0.32)

    // Signature area is already in the template image - no need to draw it!

  }, [data, templateLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!templateLoaded) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Match template resolution
    const tpl = templateRef.current
    if (!tpl) return
    const w = tpl.naturalWidth
    const h = tpl.naturalHeight
    canvas.width = w
    canvas.height = h

    drawCertificate(ctx, w, h)
    onReady?.()
  }, [data, drawCertificate, onReady, templateLoaded])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const displayName = data.nomeParticipante

    // Create landscape PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = pdf.internal.pageSize.getHeight()

    const imgData = canvas.toDataURL('image/png', 1.0)
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
    pdf.save(`Certificado_Allos_${displayName.replace(/\s+/g, '_')}.pdf`)
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
        Baixar Certificado (PDF)
      </button>
    </div>
  )
}

function drawAllosIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.strokeStyle = '#2E9E8F'

  ctx.setLineDash([6, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  ctx.setLineDash([])
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = '#2E9E8F'
  ctx.beginPath()
  ctx.arc(cx, cy, r * 0.15, 0, Math.PI * 2)
  ctx.fill()
}
