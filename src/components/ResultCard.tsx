'use client'

import { useState } from 'react'
import type { CompanyResult } from '@/lib/types'
import { getGrade, getVerdict } from '@/lib/grades'
import ScoreBar from './ScoreBar'
import SignalChip from './SignalChip'
import ReportCard from './ReportCard'

interface Props {
  result: CompanyResult
}

export default function ResultCard({ result }: Props) {
  const [showReportCard, setShowReportCard] = useState(false)

  if (!result.is_tech_company) {
    return (
      <div className="border border-white/[0.07] bg-surface p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-mono text-lg" style={{ color: '#f04a00' }}>{result.company}</h2>
          <span className="font-mono text-xs text-muted px-2 py-0.5 border border-white/[0.07] flex-shrink-0">
            Not a tech company
          </span>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#f1642c' }}>{result.summary}</p>
      </div>
    )
  }

  const { grade, label, color } = getGrade(result.score, result.claim_level)
  const verdict = getVerdict(result.score, result.claim_level)

  const verdictColors: Record<string, string> = {
    'genuine genai':          '#64f5a0',
    'classic ml / uncertain': '#f5a623',
    'ai washing':             '#f56464',
    'no ai claims made':      '#6b6b75',
  }
  const verdictColor = verdictColors[verdict] ?? '#6b6b75'

  return (
    <>
      <div className="border border-white/[0.07] bg-surface p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-mono text-lg" style={{ color: '#f04a00' }}>{result.company}</h2>
            {'cached' in result && result.cached && (
              <span className="font-mono text-xs text-muted">(cached result)</span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="font-mono text-xs px-2 py-0.5 border"
              style={{ color: verdictColor, borderColor: verdictColor }}
            >
              {verdict}
            </span>
            {verdict !== 'no ai claims made' && (
              <span className="font-mono text-2xl font-medium" style={{ color }}>
                {grade}
              </span>
            )}
          </div>
        </div>

        {verdict !== 'no ai claims made' && <ScoreBar score={result.score} />}

        <p className="text-sm leading-relaxed" style={{ color: '#f1642c' }}>{result.summary}</p>

        {result.signals?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.signals.map((s, i) => (
              <SignalChip key={i} signal={s} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.07]">
          <div className="space-y-0.5">
            <div className="font-mono text-xs text-muted">
              Claim level: <span className="text-text">{result.claim_level}</span>
            </div>
            {verdict !== 'no ai claims made' && (
              <div className="font-mono text-xs text-muted">
                Official label: <span style={{ color }}>{label}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowReportCard(true)}
            className="font-mono text-xs px-3 py-1.5 bg-transparent transition-colors"
            style={{ borderRadius: 0, color: '#f04a00' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f04a00'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f04a00' }}
          >
            View Report Card
          </button>
        </div>
      </div>

      {showReportCard && (
        <ReportCard result={result} onClose={() => setShowReportCard(false)} />
      )}
    </>
  )
}
