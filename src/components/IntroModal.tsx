'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Props {
  onDismiss: () => void
}

export default function IntroModal({ onDismiss }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('intro-seen')
    if (!seen) setVisible(true)
  }, [])

  function dismiss() {
    sessionStorage.setItem('intro-seen', '1')
    setVisible(false)
    onDismiss()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        className="max-w-md w-full p-8 flex flex-col gap-5"
        style={{
          backgroundColor: '#f5c9a8',
          border: '8px solid #c03800',
        }}
      >
        <p
          className="text-sm"
          style={{ fontFamily: '"Courier New", monospace', color: '#c03800', fontWeight: 'bold' }}
        >
          A message from the desk of Det. Sergeant Erwin Stingray
        </p>

        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', color: '#1a1a1f' }}
        >
          Potentially millions of companies have rebranded themselves as AI-focused organizations.
          However, many of these establishments are anything but or, at most, are relying on the
          same tired machine learning techniques that have their foundations back in the 1980s.
          Hardly cutting edge! They have a name for this sort of distortion:{' '}
          <strong style={{ fontFamily: '"Courier New", monospace', color: '#c03800' }}>
            AI WASHING
          </strong>.
        </p>

        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', color: '#1a1a1f' }}
        >
          I&apos;m detective Steven Erwin Stingray, former head of the Sea.I.A&apos;s Biscayne Bay
          office. I&apos;m on a mission to rid the ocean of (AI) knowledge pollution. You point me
          in the right direction, and I&apos;ll investigate.
        </p>

        <div className="relative w-32 h-32 self-center">
          <Image
            src="/StingRaySuit.png"
            alt="Det. Sergeant Erwin Stingray"
            fill
            className="object-contain"
          />
        </div>

        <p
          className="text-xs leading-relaxed"
          style={{ fontFamily: 'var(--font-dm-mono)', color: '#8b5e3c' }}
        >
          Results are AI-generated opinions based on publicly available signals and are not
          statements of fact. This tool is for research purposes only. Nothing here constitutes
          financial, investment, or legal advice — what you do with the findings is entirely up
          to you.
        </p>

        <button
          onClick={dismiss}
          className="text-sm font-semibold self-start px-3 py-1.5 bg-transparent transition-colors"
          style={{ fontFamily: '"Courier New", monospace', color: '#f04a00', borderRadius: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f04a00'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f04a00' }}
        >
          Begin Investigation →
        </button>
      </div>
    </div>
  )
}
