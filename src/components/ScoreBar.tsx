'use client'

import { useEffect, useState } from 'react'
import { getGrade } from '@/lib/grades'

interface Props {
  score: number
}

export default function ScoreBar({ score }: Props) {
  const [width, setWidth] = useState(0)
  const { color } = getGrade(score)

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 50)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">GenAI Evidence Score</span>
        <span className="font-mono text-sm font-medium" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-1.5 w-full bg-surface2">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
