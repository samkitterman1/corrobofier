import { analyzeCompany } from '@/lib/analyzer'
import { createServerClient } from '@/lib/supabase'
import { getVerdict } from '@/lib/grades'
import type { ClaimLevel } from '@/lib/types'

export const maxDuration = 60

const CACHE_TTL_DAYS = 30

function isFresh(analyzedAt: string): boolean {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - CACHE_TTL_DAYS)
  return new Date(analyzedAt) > cutoff
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    if (!name || typeof name !== 'string') {
      return Response.json({ error: 'name is required' }, { status: 400 })
    }

    const trimmed = name.trim()
    const db = createServerClient()

    // Check cache
    const { data: cached } = await db
      .from('companies')
      .select('*')
      .ilike('name', trimmed)
      .single()

    if (cached && cached.analyzed_at && isFresh(cached.analyzed_at)) {
      const result = cached.is_tech_company
        ? {
            is_tech_company: true,
            company: cached.name,
            score: cached.score,
            claim_level: cached.claim_level,
            verdict: cached.verdict,
            summary: cached.summary,
            signals: cached.signals ?? [],
            cached: true,
          }
        : {
            is_tech_company: false,
            company: cached.name,
            summary: cached.summary,
          }
      return Response.json(result)
    }

    // Fresh analysis
    const result = await analyzeCompany(trimmed)

    // Upsert to Supabase
    const row = result.is_tech_company
      ? {
          name: result.company,
          is_tech_company: true,
          score: result.score,
          claim_level: result.claim_level,
          verdict: getVerdict(result.score, result.claim_level as ClaimLevel),
          summary: result.summary,
          signals: result.signals,
          analyzed_at: new Date().toISOString(),
        }
      : {
          name: result.company,
          is_tech_company: false,
          score: null,
          claim_level: null,
          verdict: null,
          summary: result.summary,
          signals: null,
          analyzed_at: new Date().toISOString(),
        }

    await db.from('companies').upsert(row, { onConflict: 'name' })

    return Response.json(result)
  } catch (err) {
    console.error('analyze error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
