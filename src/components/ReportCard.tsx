'use client'

import { useEffect, useRef } from 'react'
import type { AnalysisResult } from '@/lib/types'
import { getGrade, getVerdict } from '@/lib/grades'

interface Props {
  result: AnalysisResult
  onClose: () => void
}

export default function ReportCard({ result, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 640
    const H = 400
    canvas.width = W
    canvas.height = H

    const { grade, label, color } = getGrade(result.score, result.claim_level)
    const verdict = getVerdict(result.score, result.claim_level)

    // Background
    ctx.fillStyle = '#f5c9a8'
    ctx.fillRect(0, 0, W, H)

    // Outer border
    ctx.strokeStyle = '#c03800'
    ctx.lineWidth = 8
    ctx.strokeRect(4, 4, W - 8, H - 8)

    // Inner border
    ctx.lineWidth = 3
    ctx.strokeRect(14, 14, W - 28, H - 28)

    // Text column left margin (shifted toward center)
    const textX = 50

    // Load and draw CORROBOFIER logo (top-left)
    const logo = new Image()
    logo.src = '/CORROBOFIER.png'
    logo.onload = () => {
      const logoW = 220
      const logoH = (logo.height / logo.width) * logoW
      ctx.drawImage(logo, 24, 24, logoW, logoH)

      // Company name field
      ctx.fillStyle = '#c03800'
      ctx.font = '11px "Courier New"'
      ctx.fillText('COMPANY:', textX, 80 + logoH)
      ctx.fillStyle = '#1a1a1f'
      ctx.font = 'bold 18px "Courier New"'
      const companyName = result.company.toUpperCase()
      ctx.fillText(companyName, textX, 100 + logoH)
      const nameWidth = ctx.measureText(companyName).width
      ctx.strokeStyle = '#c03800'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(textX, 103 + logoH)
      ctx.lineTo(textX + nameWidth, 103 + logoH)
      ctx.stroke()

      // Date field
      ctx.fillStyle = '#c03800'
      ctx.font = '11px "Courier New"'
      ctx.fillText('DATE:', textX, 130 + logoH)
      ctx.fillStyle = '#1a1a1f'
      ctx.font = '14px "Courier New"'
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
      ctx.fillText(dateStr, textX, 148 + logoH)
      const dateWidth = ctx.measureText(dateStr).width
      ctx.strokeStyle = '#c03800'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(textX, 151 + logoH)
      ctx.lineTo(textX + dateWidth, 151 + logoH)
      ctx.stroke()

      // Summary text — load portrait first so we know portX for maxWidth
      const portrait = new Image()
      portrait.src = '/SeaRay.png'
      portrait.onload = () => {
        // Portrait: 130×130px, top-right
        const portW = 130
        const portH = (portrait.height / portrait.width) * portW
        const portX = W - portW - 24
        const portY = 38

        // "LEAD DETECTIVE:" label
        ctx.fillStyle = '#c03800'
        ctx.font = 'bold 11px "Courier New"'
        const ldText = 'LEAD DETECTIVE:'
        const ldW = ctx.measureText(ldText).width
        ctx.fillText(ldText, portX + (portW - ldW) / 2, portY - 8)
        ctx.drawImage(portrait, portX, portY, portW, portH)

        // Name below portrait
        ctx.fillStyle = '#c03800'
        ctx.font = 'italic 13px Georgia, serif'
        const nameLabel = 'S.E. Searay'
        const nameLabelW = ctx.measureText(nameLabel).width
        ctx.fillText(nameLabel, portX + (portW - nameLabelW) / 2, portY + portH + 17)
        ctx.strokeStyle = '#c03800'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        const nlX = portX + (portW - nameLabelW) / 2
        ctx.moveTo(nlX, portY + portH + 20)
        ctx.lineTo(nlX + nameLabelW, portY + portH + 20)
        ctx.stroke()

        // Summary text (word-wrapped, sentence-truncated)
        ctx.fillStyle = '#1a1a1f'
        ctx.font = '12px Georgia, serif'
        const maxWidth = portX - textX - 16
        const summaryY = 175 + logoH
        const sentences = result.summary.match(/[^.!?]+[.!?]+/g) ?? [result.summary]
        let builtText = ''
        for (const sentence of sentences) {
          const test = (builtText + sentence).trim()
          if (ctx.measureText(test).width < maxWidth * 2.5) {
            builtText = test
          } else break
        }
        const displaySummary = builtText || sentences[0]
        const words = displaySummary.split(' ')
        let line = ''
        let y = summaryY
        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word
          if (ctx.measureText(testLine).width > maxWidth && line) {
            ctx.fillText(line, textX, y)
            line = word
            y += 18
            if (y > H - 60) break
          } else {
            line = testLine
          }
        }
        if (line && y <= H - 60) ctx.fillText(line, textX, y)

        // Verdict label
        ctx.fillStyle = '#c03800'
        ctx.font = 'bold 10px "Courier New"'
        ctx.fillText(`VERDICT: ${verdict.toUpperCase()}`, textX, H - 36)

        // Grade circle — only for companies with AI claims
        if (verdict !== 'no ai claims made') {
          const radius = 45
          const circleX = W - 75
          const circleY = H - 100  // raised so labels sit well above inner border
          ctx.strokeStyle = color
          ctx.lineWidth = 4
          ctx.beginPath()
          ctx.arc(circleX, circleY, radius, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = color
          ctx.font = `bold ${grade.length > 1 ? '32' : '40'}px Georgia, serif`
          const gradeMeasure = ctx.measureText(grade)
          ctx.fillText(grade, circleX - gradeMeasure.width / 2, circleY + 13)

          ctx.fillStyle = '#1a1a1f'
          ctx.font = 'bold 8px "Courier New"'
          const ratingText = 'OFFICIAL RATING:'
          const ratingW = ctx.measureText(ratingText).width
          ctx.fillText(ratingText, circleX - ratingW / 2, circleY + radius + 14)
          ctx.fillStyle = color
          ctx.font = 'bold 8px "Courier New"'
          const labelW = ctx.measureText(label).width
          ctx.fillText(label, circleX - labelW / 2, circleY + radius + 25)
        }
      }
    }
  }, [result])

  function download() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${result.company.replace(/\s+/g, '_')}_report_card.jpg`
    link.href = canvas.toDataURL('image/jpeg', 0.92)
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto" onClick={onClose}>
      <div
        className="relative flex flex-col items-center gap-4 w-full max-w-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ maxWidth: 640, border: '8px solid #c03800' }}
        />
        <div className="flex gap-3">
          <button
            onClick={download}
            className="font-mono text-sm px-4 py-2 bg-transparent transition-colors"
            style={{ borderRadius: 0, color: '#f04a00' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f04a00'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f04a00' }}
          >
            Download JPEG
          </button>
          <button
            onClick={onClose}
            className="font-mono text-sm px-4 py-2 bg-transparent transition-colors"
            style={{ borderRadius: 0, color: '#f04a00' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f04a00'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f04a00' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
