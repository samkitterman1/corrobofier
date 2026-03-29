'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { CompanyResult, AnalysisState } from '@/lib/types'

const CACHE_TTL_DAYS = 30

function isFresh(analyzedAt: string): boolean {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - CACHE_TTL_DAYS)
  return new Date(analyzedAt) > cutoff
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>('idle')
  const [result, setResult] = useState<CompanyResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    setState('loading')
    setResult(null)
    setError(null)

    try {
      // Check Supabase cache first
      const { data: cached } = await supabase
        .from('companies')
        .select('*')
        .ilike('name', trimmed)
        .single()

      if (cached && cached.analyzed_at && isFresh(cached.analyzed_at)) {
        const cachedResult: CompanyResult = cached.is_tech_company
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
        setResult(cachedResult)
        setState('done')
        return
      }

      // Call API route for fresh analysis
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }

      const data: CompanyResult = await res.json()
      setResult(data)
      setState('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setState('error')
    }
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setResult(null)
    setError(null)
  }, [])

  return { state, result, error, analyze, reset }
}
