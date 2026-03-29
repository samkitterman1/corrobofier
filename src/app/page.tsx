'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAnalysis } from '@/hooks/useAnalysis'
import { getDialogue, getVerdict, INTRO_DIALOGUE } from '@/lib/grades'
import IntroModal from '@/components/IntroModal'
import AboutModal from '@/components/AboutModal'
import CompanyInput from '@/components/CompanyInput'
import ResultCard from '@/components/ResultCard'
import CharacterWidget from '@/components/CharacterWidget'

type AnimState = 'idle' | 'investigating' | 'revealing'

export default function Home() {
  const { state, result, error, analyze, reset } = useAnalysis()
  const [showAbout, setShowAbout] = useState(false)
  const [animState, setAnimState] = useState<AnimState>('idle')
  const [dialogue, setDialogue] = useState<string | null>(INTRO_DIALOGUE)
  const [revealedResult, setRevealedResult] = useState(typeof result === 'object' ? result : null)

  // When analysis finishes, trigger the reveal animation
  useEffect(() => {
    if (state === 'loading') {
      setAnimState('investigating')
    } else if (state === 'done' && result) {
      setAnimState('revealing')
    } else if (state === 'idle' || state === 'error') {
      setAnimState('idle')
    }
  }, [state, result])

  function handleRevealComplete() {
    setAnimState('idle')
    setRevealedResult(result)
    if (result?.is_tech_company) {
      const verdict = getVerdict(result.score, result.claim_level)
      setDialogue(getDialogue(result.score, verdict))
    } else if (result && !result.is_tech_company) {
      setDialogue("That company is outside my jurisdiction — not a tech outfit!")
    }
  }

  function handleIntrosDismiss() {
    setDialogue(INTRO_DIALOGUE)
  }

  function handleAnalyze(name: string) {
    setRevealedResult(null)
    analyze(name)
  }

  function handleClear() {
    reset()
    setRevealedResult(null)
    setAnimState('idle')
    setDialogue(null)
  }

  return (
    <>
      <IntroModal onDismiss={handleIntrosDismiss} />
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}

      <main className="min-h-screen flex flex-col px-4 py-10 max-w-2xl mx-auto w-full">
        {/* Logo */}
        <div className="mb-10">
          <Image
            src="/CORROBOFIER.png"
            alt="Generative AI Corrobofier"
            width={520}
            height={114}
            priority
            className="max-w-full"
          />
          <p className="font-mono text-xs text-muted mt-2">
            Enter a company name, and Det. Sergeant Erwin Stingray will investigate. He&apos;ll look
            into it, and determine whether it&apos;s genuine generative AI usage, classic ML, or just
            plain ol&apos; marketing fluff.
          </p>
        </div>

        {/* Input */}
        <CompanyInput
          onSubmit={handleAnalyze}
          onClear={handleClear}
          onAbout={() => setShowAbout(true)}
          disabled={state === 'loading'}
          hasResult={!!revealedResult || !!error}
        />

        {/* Loading state */}
        {state === 'loading' && (
          <div className="mt-8 font-mono text-sm text-muted animate-pulse">
            Investigating… running web searches…
          </div>
        )}

        {/* Error state */}
        {state === 'error' && error && (
          <div className="mt-8 border border-danger/30 bg-surface p-4">
            <p className="font-mono text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Result (shown after reveal animation) */}
        {revealedResult && (
          <div className="mt-8">
            <ResultCard result={revealedResult} />
          </div>
        )}

        <div className="mt-auto pt-16">
          <p className="font-mono text-xs text-muted">
            Results are AI-generated opinions based on publicly available signals.
            Not statements of fact. Not financial or legal advice.
          </p>
        </div>
      </main>

      <CharacterWidget
        animState={animState}
        dialogue={dialogue}
        onRevealComplete={handleRevealComplete}
      />
    </>
  )
}
