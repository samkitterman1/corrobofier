'use client'

import type { Signal } from '@/lib/types'

interface Props {
  signal: Signal
}

const typeStyles: Record<Signal['type'], string> = {
  positive: 'border-success text-success',
  negative: 'border-danger text-danger',
  neutral:  'border-muted text-muted',
}

export default function SignalChip({ signal }: Props) {
  return (
    <span
      className={`inline-block font-mono text-xs px-2 py-0.5 border ${typeStyles[signal.type]}`}
      style={{ borderRadius: 0 }}
    >
      {signal.label}
    </span>
  )
}
