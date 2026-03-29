export type ClaimLevel = 'high' | 'medium' | 'low' | 'none'

export type Verdict = 'genuine genai' | 'classic ml / uncertain' | 'ai washing' | 'no ai claims made'

export interface Signal {
  label: string
  type: 'positive' | 'negative' | 'neutral'
}

export interface AnalysisResult {
  is_tech_company: true
  company: string
  score: number
  claim_level: ClaimLevel
  verdict: Verdict
  summary: string
  signals: Signal[]
  cached?: boolean
}

export interface NonTechResult {
  is_tech_company: false
  company: string
  summary: string
}

export type CompanyResult = AnalysisResult | NonTechResult

export type AnalysisState = 'idle' | 'loading' | 'done' | 'error'
