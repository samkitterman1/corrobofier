'use client'

import { useState, useRef, useEffect } from 'react'

interface Props {
  onSubmit: (name: string) => void
  onClear: () => void
  onAbout: () => void
  disabled: boolean
  hasResult: boolean
}

export default function CompanyInput({ onSubmit, onClear, onAbout, disabled, hasResult }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!disabled && value.trim()) onSubmit(value.trim())
  }

  function handleClear() {
    setValue('')
    onClear()
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-0 py-2">
          <label
            className="font-mono text-sm flex-shrink-0 mr-2 select-none"
            style={{ color: '#f04a00' }}
          >
            Company name:
          </label>
          <div className="relative flex-1 flex items-center overflow-hidden">
            {/* Invisible real input — captures all keyboard input */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={disabled}
              className="absolute inset-0 opacity-0 cursor-text disabled:cursor-not-allowed"
              style={{ caretColor: 'transparent' }}
              autoComplete="off"
              spellCheck={false}
            />
            {/* Visual display: typed text + blinking block cursor */}
            <div
              className="font-mono text-sm pointer-events-none flex items-center whitespace-pre"
              style={{ color: '#f1642c' }}
              onClick={() => inputRef.current?.focus()}
            >
              <span>{value}</span>
              <span
                className="inline-block w-[10px] h-[1.15em] align-middle animate-blink"
                style={{ backgroundColor: '#f04a00' }}
              />
            </div>
          </div>
        </div>
      </form>

      <div className="flex gap-0">
        <button
          onClick={handleSubmit as unknown as React.MouseEventHandler}
          disabled={disabled || !value.trim()}
          className="font-mono text-sm px-4 py-2 bg-transparent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderRadius: 0, color: '#f04a00' }}
          onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = '#f04a00'; e.currentTarget.style.color = 'white' } }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f04a00' }}
        >
          Investigate
        </button>
        {hasResult && (
          <button
            onClick={handleClear}
            disabled={disabled}
            className="font-mono text-sm px-4 py-2 bg-transparent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderRadius: 0, color: '#f04a00' }}
            onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = '#f04a00'; e.currentTarget.style.color = 'white' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f04a00' }}
          >
            Clear
          </button>
        )}
        <button
          onClick={onAbout}
          className="font-mono text-sm px-4 py-2 bg-transparent transition-colors"
          style={{ borderRadius: 0, color: '#f04a00' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f04a00'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f04a00' }}
        >
          About
        </button>
      </div>
    </div>
  )
}
