'use client'

interface Props {
  onClose: () => void
}

const cour: React.CSSProperties = { fontFamily: '"Courier New", monospace' }
const geo: React.CSSProperties  = { fontFamily: 'Georgia, serif', color: '#1a1a1f' }

const signals = [
  {
    title: 'Marketing copy',
    body: 'Product pages, landing pages, and brand messaging are scanned for AI positioning. Vague terms like "AI-powered" or "intelligent" without technical substance are flagged. Specific model or architecture references are strong positive signals.',
  },
  {
    title: 'Job postings',
    body: 'Active roles on LinkedIn, Greenhouse, and company careers pages. Roles like Prompt Engineer, RAG Engineer, LLM Ops, or Fine-tuning Specialist are strong positive signals. Classic ML-only roles (feature engineering, XGBoost, A/B testing infra) without GenAI equivalents are neutral or negative.',
  },
  {
    title: 'Engineering blog',
    body: 'Technical posts, papers, and conference talks. Real GenAI usage leaves a trail — model evaluations, benchmarks, architecture write-ups. Absence of any technical depth alongside heavy marketing claims is a red flag.',
  },
  {
    title: 'GitHub / tech stack',
    body: 'Public repos and dependency signals. Dependencies on openai, anthropic, langchain, llama-index, transformers, or vector DB clients (Pinecone, Weaviate, Qdrant, Chroma) are strong positive indicators.',
  },
  {
    title: 'SEC filings',
    body: 'For public companies, 10-K and 10-Q filings are checked. Companies must accurately describe their technology under legal obligation — making these among the most reliable signals available.',
  },
]

const grades = [
  { grade: 'A+', score: '90 – 100', desc: 'Exemplary GenAI adoption with clear technical depth and infrastructure.' },
  { grade: 'A',  score: '80 – 89',  desc: 'Strong genuine GenAI usage across products and engineering.' },
  { grade: 'B+', score: '70 – 79',  desc: 'Solid GenAI evidence with some gaps in public technical signals.' },
  { grade: 'B',  score: '60 – 69',  desc: 'Meaningful AI work but leaning toward classic ML with some GenAI.' },
  { grade: 'C+', score: '50 – 59',  desc: 'Mixed signals — some GenAI adjacent work but predominantly traditional.' },
  { grade: 'C',  score: '40 – 49',  desc: 'Primarily classic ML with limited or unverified GenAI claims.' },
  { grade: 'D',  score: '30 – 39',  desc: 'Weak evidence, likely overstating AI capabilities.' },
  { grade: 'F',  score: '0 – 29',   desc: 'No substantive AI evidence found. F for Fluff.' },
]

export default function AboutModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="max-w-xl w-full p-8 overflow-y-auto max-h-[90vh]"
        style={{ backgroundColor: '#f5c9a8', border: '8px solid #c03800' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-base font-bold" style={{ ...cour, color: '#c03800' }}>
            How it works
          </h2>
          <button onClick={onClose} className="text-sm leading-none" style={{ ...cour, color: '#c03800' }}>
            ✕
          </button>
        </div>

        <div className="space-y-6 text-sm leading-relaxed" style={geo}>

          {/* Section: Det. Stingray's Investigation Methods */}
          <section>
            <h3 className="font-bold mb-3" style={{ ...cour, color: '#c03800' }}>
              Det. Stingray&apos;s Investigation Methods
            </h3>
            <h4 className="font-bold mb-3" style={geo}>Signal Sources</h4>
            <div className="space-y-4">
              {signals.map((s) => (
                <div key={s.title}>
                  <p className="font-bold" style={{ ...cour, color: '#c03800', fontSize: '0.75rem' }}>
                    {s.title}
                  </p>
                  <p className="mt-0.5">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Two-Axis Scoring */}
          <section>
            <h3 className="font-bold mb-3" style={{ ...cour, color: '#c03800' }}>
              Two-Axis Scoring
            </h3>
            <p className="mb-3">
              Every company is assessed on two independent dimensions:
            </p>
            <div className="space-y-3">
              <div>
                <p className="font-bold" style={{ ...cour, color: '#c03800', fontSize: '0.75rem' }}>Claim level</p>
                <p className="mt-0.5">
                  How strongly does the company market itself as AI-driven? Rated{' '}
                  <strong>high / medium / low / none</strong>. This is assessed independently
                  from whether the claims are backed up.
                </p>
              </div>
              <div>
                <p className="font-bold" style={{ ...cour, color: '#c03800', fontSize: '0.75rem' }}>Evidence score</p>
                <p className="mt-0.5">
                  How much technical evidence exists of genuine generative AI usage? Rated 0–100.
                  Only penalised as "AI washing" when a high or medium claim level is paired with
                  a low evidence score.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Evidence Score Bands */}
          <section>
            <h3 className="font-bold mb-3" style={{ ...cour, color: '#c03800' }}>
              Evidence Score Bands
            </h3>
            <div className="space-y-2" style={{ ...cour, fontSize: '0.75rem' }}>
              <div className="flex gap-4">
                <span className="flex-shrink-0 font-bold" style={{ color: '#c03800' }}>70 – 100</span>
                <span style={geo}>Clear GenAI evidence — named LLMs, RAG pipelines, vector DBs, prompt engineering hires, or fine-tuning work confirmed.</span>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 font-bold" style={{ color: '#c03800' }}>30 – 69</span>
                <span style={geo}>Classic ML or predictive AI, ambiguous signals, or unverifiable claims. May be genuinely useful technology, just not generative AI.</span>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 font-bold" style={{ color: '#c03800' }}>0 – 29</span>
                <span style={geo}>No meaningful technical AI substance found. Combined with high/medium claims, this is classified as AI washing.</span>
              </div>
            </div>
          </section>

          {/* Section: Report Card Grades */}
          <section>
            <h3 className="font-bold mb-3" style={{ ...cour, color: '#c03800' }}>
              Report Card Grades
            </h3>
            <table className="w-full" style={{ ...cour, fontSize: '0.72rem' }}>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.grade} style={{ borderBottom: '1px solid rgba(192,56,0,0.2)' }}>
                    <td className="py-1.5 font-bold w-8" style={{ color: '#c03800' }}>{g.grade}</td>
                    <td className="py-1.5 w-20" style={{ color: '#1a1a1f' }}>{g.score}</td>
                    <td className="py-1.5" style={{ ...geo, fontSize: '0.72rem' }}>{g.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Section: Important Caveats */}
          <section>
            <h3 className="font-bold mb-2" style={{ ...cour, color: '#c03800' }}>
              Important Caveats
            </h3>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.7rem', color: '#8b5e3c', lineHeight: '1.6' }}>
              Results are generated by AI using live web search at the time of analysis and reflect
              publicly available information only. Private infrastructure, stealth R&amp;D, and
              confidential partnerships are not visible to this tool. Scores are cached for 30 days —
              a company&apos;s actual capabilities may have changed. This is a research aid, not a
              definitive audit.
            </p>
          </section>

        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 bg-transparent transition-colors"
            style={{ ...cour, color: '#f04a00', borderRadius: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f04a00'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f04a00' }}
          >
            Close →
          </button>
        </div>
      </div>
    </div>
  )
}
