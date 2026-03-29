'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type AnimState = 'idle' | 'investigating' | 'revealing'

interface Props {
  animState: AnimState
  dialogue: string | null
  onRevealComplete: () => void
}

export default function CharacterWidget({ animState, dialogue, onRevealComplete }: Props) {
  const [showBubble, setShowBubble] = useState(false)
  const [displayedDialogue, setDisplayedDialogue] = useState<string | null>(null)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [eyeLineData, setEyeLineData] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [waterfineData, setWaterfineData] = useState<any>(null)

  useEffect(() => {
    fetch('/animations/eyeLine.json').then(r => r.json()).then(setEyeLineData)
    fetch('/animations/waterfine.json').then(r => r.json()).then(setWaterfineData)
  }, [])

  useEffect(() => {
    if (dialogue) {
      setDisplayedDialogue(dialogue)
      setShowBubble(true)
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      dismissTimer.current = setTimeout(() => setShowBubble(false), 10000)
    }
  }, [dialogue])

  function closeBubble() {
    setShowBubble(false)
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
  }

  const isAnimating = animState === 'investigating' || animState === 'revealing'

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {showBubble && displayedDialogue && (
        <div
          className="relative max-w-[220px] p-3 text-xs leading-relaxed mb-1"
          style={{
            backgroundColor: '#f5c9a8',
            border: '3px solid #c03800',
            borderRadius: 0,
            fontFamily: '"Courier New", monospace',
            color: '#1a1a1f',
          }}
        >
          <button
            onClick={closeBubble}
            className="absolute top-1 right-2 text-xs leading-none"
            style={{ color: '#c03800' }}
          >
            ✕
          </button>
          <p className="pr-4">{displayedDialogue}</p>
          {/* Tail pointing down */}
          <span
            className="absolute -bottom-3 right-8"
            style={{
              display: 'block',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '10px solid #c03800',
            }}
          />
          <span
            className="absolute -bottom-2 right-9"
            style={{
              display: 'block',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid #f5c9a8',
            }}
          />
        </div>
      )}

      <div className="flex items-center justify-end">
        {animState === 'investigating' && eyeLineData && (
          <div style={{ width: 220, height: 124 }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Lottie animationData={eyeLineData as any} loop={true} />
          </div>
        )}
        {animState === 'revealing' && waterfineData && (
          <div style={{ width: 220, height: 124 }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Lottie
              animationData={waterfineData as any}
              loop={false}
              onComplete={onRevealComplete}
            />
          </div>
        )}
        {!isAnimating && (
          <Image
            src="/SECRAYICON.png"
            alt="Det. Stingray"
            width={90}
            height={90}
            className="object-contain"
          />
        )}
      </div>
    </div>
  )
}
