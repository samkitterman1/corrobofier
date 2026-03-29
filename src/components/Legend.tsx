'use client'

const items = [
  { label: 'Genuine GenAI', color: '#64f5a0', desc: 'Score ≥ 70' },
  { label: 'Classic ML / Uncertain', color: '#f5a623', desc: 'Score 30–69' },
  { label: 'AI Washing', color: '#f56464', desc: 'Score < 30, high/medium claims' },
  { label: 'No AI Claims Made', color: '#6b6b75', desc: 'Score < 30, neutral' },
]

export default function Legend() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="w-2 h-2 block flex-shrink-0" style={{ backgroundColor: item.color }} />
          <span className="font-mono text-xs text-muted">
            <span style={{ color: item.color }}>{item.label}</span>
            {' '}<span className="text-muted">— {item.desc}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
