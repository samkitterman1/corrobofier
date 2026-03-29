import Anthropic from '@anthropic-ai/sdk'
import type { CompanyResult, ClaimLevel } from './types'
import { getVerdict } from './grades'

const PROMPT_TEMPLATE = `You are an AI analyst investigating whether TECH companies genuinely use generative AI
(LLMs, diffusion models, etc.) vs. classic ML or just marketing language.

Be highly efficient: use a MAXIMUM of 2 web searches. Do ONE search for the company's
main website/product, and ONE for recent job postings or tech signals. Stop immediately
once you have enough to score. Do not search exhaustively.

IMPORTANT: This tool is exclusively for technology companies — software, SaaS, platforms,
apps, developer tools, and similar. If the name does not clearly resolve to a tech/software
company, return is_tech_company: false immediately.

Research the company: "<n>"

You must assess TWO things independently:

A) claim_level — how strongly does the company market itself as AI-driven?
   - "high": AI is central to their brand ("AI-first", "built on AI", "AI platform")
   - "medium": AI is mentioned as a feature but not the core identity
   - "low": AI is mentioned only occasionally or in passing
   - "none": company does not appear to claim AI capabilities

B) score (0-100) — how much evidence is there of genuine generative AI usage?
   - 70-100: Clear evidence (named LLMs, RAG pipelines, vector DBs, prompt engineering hires, fine-tuning)
   - 30-69: Classic ML, predictive models, or ambiguous signals
   - 0-29: No meaningful technical AI substance found

CRITICAL SCORING RULE — read carefully:
A score below 30 is only meaningful as a negative finding when claim_level is "high" or "medium".
Before assigning a score below 30, you MUST first confirm the company actively markets itself as
AI-driven. If claim_level is "low" or "none", a low score simply means the company is not an AI
company — that is a neutral observation, not a criticism. Do NOT assign a low score as a
penalty to companies that have never claimed AI capabilities. If a company makes no AI claims,
assign claim_level "none" and let the verdict logic handle the interpretation — do not let the
absence of AI evidence drag the score into "AI washing" territory for a company that never
positioned itself as an AI company.

If not a tech company:
{ "is_tech_company": false, "company": "<n>", "summary": "<explain what the company actually is>" }

If it IS a tech company:
{
  "is_tech_company": true,
  "company": "<full company name>",
  "score": <0-100 integer>,
  "claim_level": "<high|medium|low|none>",
  "summary": "<2-3 sentence verdict covering both what they claim AND what evidence exists>",
  "signals": [
    {"label": "<short label>", "type": "positive|negative|neutral"},
    ...
  ]
}

Include 3-6 signals. Keep summary factual and direct.
Respond ONLY with a JSON object (no markdown, no backticks).`

function extractJSON(text: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(text)
  } catch {}

  // Strip markdown code blocks and retry
  const stripped = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
  try {
    return JSON.parse(stripped)
  } catch {}

  // Find first { ... } block
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1) {
    try {
      return JSON.parse(text.slice(start, end + 1))
    } catch {}
  }

  throw new Error('Could not extract JSON from response')
}

export async function analyzeCompany(name: string): Promise<CompanyResult> {
  const client = new Anthropic()

  const prompt = PROMPT_TEMPLATE.replace(/<n>/g, name)

  const apiCall = client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 2 } as any],
    messages: [{ role: 'user', content: prompt }],
  })

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Analysis timed out after 40 seconds')), 40000)
  )

  const response = await Promise.race([apiCall, timeout])

  // Extract final text block from response
  let rawText = ''
  for (const block of response.content) {
    if (block.type === 'text') {
      rawText = block.text
    }
  }

  if (!rawText) throw new Error('No text response from Claude')

  const parsed = extractJSON(rawText) as Record<string, unknown>

  if (!parsed.is_tech_company) {
    return {
      is_tech_company: false,
      company: String(parsed.company ?? name),
      summary: String(parsed.summary ?? ''),
    }
  }

  const score = Number(parsed.score ?? 0)
  const claimLevel = String(parsed.claim_level ?? 'none') as ClaimLevel
  const verdict = getVerdict(score, claimLevel)

  return {
    is_tech_company: true,
    company: String(parsed.company ?? name),
    score,
    claim_level: claimLevel,
    verdict,
    summary: String(parsed.summary ?? ''),
    signals: Array.isArray(parsed.signals) ? parsed.signals as CompanyResult extends { signals: infer S } ? S : never : [],
  }
}
