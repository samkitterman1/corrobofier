import type { Verdict, ClaimLevel } from './types'

export interface GradeInfo {
  grade: string
  label: string
  color: string
}

export function getGrade(score: number, claimLevel?: ClaimLevel): GradeInfo {
  if (score >= 90) return { grade: 'A+', label: 'Official Ranking',  color: '#64f5a0' }
  if (score >= 80) return { grade: 'A',  label: 'Official Ranking',  color: '#64f5a0' }
  if (score >= 70) return { grade: 'B+', label: 'Official Ranking',  color: '#64f5a0' }
  if (score >= 60) return { grade: 'B',  label: 'Official Ranking',  color: '#f5a623' }
  if (score >= 50) return { grade: 'C+', label: 'Official Ranking',  color: '#f5a623' }
  if (score >= 40) return { grade: 'C',  label: 'Official Ranking',  color: '#f5a623' }
  if (score >= 30) {
    const duplicitous = claimLevel === 'high' || claimLevel === 'medium'
    return { grade: 'D', label: duplicitous ? 'D for Duplicitous' : 'Mostly Classic ML', color: '#f56464' }
  }
  return { grade: 'F', label: 'F for Fluff', color: '#f56464' }
}

export function getVerdict(score: number, claimLevel: ClaimLevel): Verdict {
  if (score >= 70) return 'genuine genai'
  if (score >= 30) return 'classic ml / uncertain'
  if (claimLevel === 'high' || claimLevel === 'medium') return 'ai washing'
  return 'no ai claims made'
}

const washingLines = [
  "They're all washed up!",
  "That's a wash!",
  "Splish splash, that's one marketing team that knows how to draw a bath!",
]

export function getDialogue(score: number, verdict: Verdict): string {
  if (verdict === 'no ai claims made') {
    return "They might be behind the times, but they certainly aren't deceiving anyone."
  }
  if (verdict === 'ai washing') {
    return washingLines[Math.floor(Math.random() * washingLines.length)]
  }
  const { grade } = getGrade(score)
  if (grade === 'C' || grade === 'C+') return "Edge case — not much you can do with that!"
  if (grade === 'B' || grade === 'B+') return "Not bad — they're on the right path."
  if (grade === 'A' || grade === 'A+') return "Now that's what I call cutting edge!"
  // D grade with classic ml / uncertain verdict — not duplicitous, just weak
  return "Not much to write home about, but they're not writing home about it either."
}

export const INTRO_DIALOGUE = "You tell me the company, and I'll start my investigation."
