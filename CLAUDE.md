# Generative AI Corrobofier

A public-facing research tool that investigates whether tech companies genuinely use generative AI vs. classic ML or pure marketing language ("AI washing"). Fronted by Det. Sergeant Erwin Stingray of the Sea.I.A's Biscayne Bay office.

---

## Product Identity

**Name:** Generative AI Corrobofier
**Character:** Det. Sergeant Erwin Stingray — a stingray detective on a mission to rid the ocean of AI knowledge pollution
**Tone:** Satirical, opinionated, fun — but findings are factually grounded in public signals
**Disclaimer:** Results are AI-generated opinions based on publicly available signals and are not statements of fact. Not financial or legal advice.

---

## How It Works

Every company is assessed on **two independent axes:**

**1. `claim_level`** — How strongly does the company market itself as AI-driven?
- `high` — AI is central to their brand ("AI-first", "built on AI", "AI platform")
- `medium` — AI is a feature but not the core identity
- `low` — AI mentioned only occasionally
- `none` — No apparent AI claims

**2. `score` (0–100)** — How much evidence exists of genuine generative AI usage?
- 70–100: Clear GenAI evidence (named LLMs, RAG, vector DBs, prompt engineering hires, fine-tuning)
- 30–69: Classic ML, predictive models, or ambiguous signals
- 0–29: No meaningful technical AI substance

**Verdict logic:**
- score ≥ 70 → `genuine genai`
- score 30–69 → `classic ml / uncertain`
- score < 30 + claim_level high/medium → `ai washing`
- score < 30 + claim_level low/none → `no ai claims made` (neutral — not a criticism)

**Scoring rule:** Before assigning a score below 30, Claude must confirm the company actively markets itself as AI-driven (claim_level high or medium). A low score for a company with claim_level low/none is a neutral observation — not a criticism. Claude must not let the absence of AI evidence drag a non-claiming company into AI washing territory.

**Tech-only scope:** The tool only analyzes tech/software companies. If the input name resolves to a non-tech business (retailer, jeweler, food brand, etc.), return `is_tech_company: false` immediately without scoring.

---

## Canonical Prompt

Use this prompt consistently between the Next.js API route and any Python pipeline. Max 2 web searches — be efficient.

```
You are an AI analyst investigating whether TECH companies genuinely use generative AI
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

Important: A low score is ONLY "AI washing" if claim_level is "high" or "medium".
A company with claim_level "none" and a low score is simply not an AI company — neutral, not negative.

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
Respond ONLY with a JSON object (no markdown, no backticks).
```

---

## Report Card Grades

| Grade | Score   | Label                                                              |
|-------|---------|--------------------------------------------------------------------|
| A+    | 90–100  | Official Ranking                                                   |
| A     | 80–89   | Official Ranking                                                   |
| B+    | 70–79   | Official Ranking                                                   |
| B     | 60–69   | Official Ranking                                                   |
| C+    | 50–59   | Official Ranking                                                   |
| C     | 40–49   | Official Ranking                                                   |
| D     | 30–39   | D for Duplicitous (claim_level high/medium) / Mostly Classic ML (claim_level low/none) |
| F     | 0–29    | F for Fluff                                                        |

The D label is claim-level-aware: "D for Duplicitous" only applies when the company has been actively marketing itself as AI-driven (high or medium claim level). A D grade for a low/none claim company uses the neutral label "Mostly Classic ML".

---

## Det. Stingray Dialogue Lines

Triggered after each result reveal (after waterfine.json animation completes):

- **No AI claims made:** "They might be behind the times, but they certainly aren't deceiving anyone."
- **AI washing verdict (F or D with high/medium claim):** random pick from:
  - "They're all washed up!"
  - "That's a wash!"
  - "Splish splash, that's one marketing team that knows how to draw a bath!"
- **D grade with low/none claim (classic ml / uncertain):** "Not much to write home about, but they're not writing home about it either."
- **C grade:** "Edge case — not much you can do with that!"
- **B grade:** "Not bad — they're on the right path."
- **A grade:** "Now that's what I call cutting edge!"
- **On intro dismiss / page load:** "You tell me the company, and I'll start my investigation."

---

## Assets

All static assets live in `public/` in the Next.js project. Also upload to Supabase Storage (public bucket) as CDN backup.

| File | Dropbox URL | Usage |
|------|-------------|-------|
| `CORROBOFIER.png` | https://www.dropbox.com/scl/fi/b8q5wf1khwx7xroqv6e76/CORROBOFIER.png?rlkey=i4doo8ix924o8z2rukbjbuksb&st=24wgg4jg&raw=1 | Main logo, top of page |
| `SECRAYICON.png` | https://www.dropbox.com/scl/fi/d8ao7bfxwosr37kgikolt/SECRAYICON.png?rlkey=l1shuo4zzuwzfzc9qxbxxbu8u&st=10atopbp&raw=1 | Det. Stingray character icon, bottom-right widget |
| `StingRaySuit.png` | https://www.dropbox.com/scl/fi/v9sye7fjtwebth83xsxsr/StingRaySuit.png?rlkey=i74xftzzshj3d6llss29zz5dl&st=jwy7fsfo&raw=1 | Portrait in intro/welcome popup |
| `SeaRay.png` | https://www.dropbox.com/scl/fi/6eyrguvbtfe7tqcqd1onn/SeaRay.png?rlkey=y8ud0o7al61xx91n70ea13cmu&st=y7i4gee3&raw=1 | Portrait on report card ("Lead Detective") |
| `eyeLine.json` | `public/animations/eyeLine.json` | Lottie — loops while investigating |
| `waterfine.json` | `public/animations/waterfine.json` | Lottie — plays once on result reveal |

Both Lottie JSONs have all assets embedded as base64 (verified — `e: 1` on all image assets). Place in `public/animations/`.

In `next.config.ts`, add Dropbox to allowed image domains:

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.dropbox.com' },
    ],
  },
}
```

Use the `raw=1` URLs directly in `<Image src="..." />` or `<img>` tags.

---

## Supabase Schema

```sql
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_tech_company boolean default true,
  score integer,
  claim_level text check (claim_level in ('high', 'medium', 'low', 'none')),
  verdict text,
  summary text,
  signals jsonb,
  analyzed_at timestamptz,
  created_at timestamptz default now()
);

create index on companies (name);
create index on companies (analyzed_at);
```

Cache TTL: **30 days** — check `analyzed_at` before making any API call. If fresh, return cached. If stale or missing, fetch fresh and upsert.

---

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=                  # server-only, never expose to client
NEXT_PUBLIC_SUPABASE_URL=           # safe to expose
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # safe to expose
SUPABASE_SERVICE_ROLE_KEY=          # server-only, bypasses RLS
```

---

## Project Structure

```
corrobofier/
├── CLAUDE.md
├── .env.local                        # never commit
├── .env.example                      # committed, no values
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── public/
│   ├── CORROBOFIER.png
│   ├── SECRAYICON.png
│   ├── StingRaySuit.png
│   ├── SeaRay.png
│   └── animations/
│       ├── eyeLine.json
│       └── waterfine.json
└── src/
    ├── app/
    │   ├── layout.tsx                # root layout, fonts, globals
    │   ├── page.tsx                  # main page
    │   ├── globals.css               # design tokens, keyframes
    │   └── api/
    │       └── analyze/
    │           └── route.ts          # POST — cache check, Claude call, Supabase upsert
    ├── components/
    │   ├── IntroModal.tsx            # welcome popup with StingRaySuit portrait + disclaimer
    │   ├── AboutModal.tsx            # methodology popup
    │   ├── CompanyInput.tsx          # terminal-style input
    │   ├── ResultCard.tsx            # result card with score bar, signal chips, report card button
    │   ├── ReportCard.tsx            # canvas-drawn report card modal with JPEG download
    │   ├── ScoreBar.tsx              # animated score bar
    │   ├── SignalChip.tsx            # positive/negative/neutral chip
    │   ├── CharacterWidget.tsx       # bottom-right icon + speech bubble + Lottie player
    │   └── Legend.tsx                # verdict legend
    ├── lib/
    │   ├── analyzer.ts               # Claude API call, prompt, JSON extraction with fallback
    │   ├── supabase.ts               # Supabase client (browser + server variants)
    │   ├── grades.ts                 # score → grade/label/colour/dialogue logic
    │   └── types.ts                  # shared TypeScript types
    └── hooks/
        └── useAnalysis.ts            # analysis state, cache check, Supabase read/write
```

---

## Design System

### Colors

```ts
// tailwind.config.ts
colors: {
  bg:            '#0c0c0e',
  surface:       '#131316',
  surface2:      '#1a1a1f',
  text:          '#e8e8ea',
  muted:         '#6b6b75',
  brand:         '#f04a00',   // labels, button text, cursor, hover fills
  'brand-light': '#f1642c',   // typed input text, summary paragraph text
  danger:        '#f56464',
  warning:       '#f5a623',
  success:       '#64f5a0',
}
```

### Typography

DM Sans (body/UI, weights 300/400/500) + DM Mono (labels, scores, chips, terminal input)

```ts
import { DM_Sans, DM_Mono } from 'next/font/google'
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300','400','500'], variable: '--font-dm-sans' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-dm-mono' })
// Apply both variables to <html>
```

### Key UI Patterns

**Terminal input:**
- Label "Company name:" in DM Mono, `brand` color
- Typed text in `brand-light`
- Blinking block cursor (`brand`) — hides on focus (shows native caret), reappears on blur
- Enter key triggers analysis

**Buttons (Investigate, Clear, About):**
- DM Mono, transparent background, `brand` text, no border, border-radius: 0
- Hover: full `brand` background fill, white text
- Disabled: 40% opacity, no hover effect

**Result cards:**
- `bg-surface`, `border border-white/[0.07]`, sharp edges (no border-radius)
- Company name: `brand`
- Summary paragraph: `brand-light`
- All other text: white
- Footer shows `Claim level:` always; `Rating: [label]` and `View Report Card` button only when verdict ≠ `no ai claims made`

**Report card (canvas-drawn):**
- Background: `#f5c9a8` (salmon/peach)
- Border: `8px solid #c03800`, inner border `3px solid #c03800`
- CORROBOFIER.png logo top-left
- SeaRay.png portrait top-right under "LEAD DETECTIVE:" label
- "S.E. Searay" in italic Georgia beneath portrait with orange underline
- Company name + date fields with orange underlines
- Summary text in Georgia serif, sentence-truncated to fit available space
- Large circled grade bottom-right, colour-coded by grade — omitted entirely when verdict is `no ai claims made`
- "OFFICIAL RATING: [label]" in Courier New beneath grade — also omitted for `no ai claims made`
- Download button exports as JPEG: `[CompanyName]_report_card.jpg`

**Character widget (fixed bottom-right):**
- SECRAYICON.png (90px wide) always visible when not animating
- Swaps to 220×124px Lottie player during animations
- Speech bubble: `#f5c9a8` bg, `3px solid #c03800` border, no border-radius, speech tail pointing down
- Auto-dismisses after 10 seconds, has ✕ close button
- Triggered: on intro dismiss, and after each result reveal

**Intro modal:**
- `#f5c9a8` background, `8px solid #c03800` border
- "A message from the desk of Det. Sergeant Erwin Stingray" in Courier New
- Body in Georgia serif, "AI WASHING" in bold Courier New orange
- StingRaySuit.png portrait centred below text
- Disclaimer in DM Mono below portrait
- "Begin Investigation →" CTA in `#c03800`
- Shows once per session via `sessionStorage`

---

## API Route

```ts
// src/app/api/analyze/route.ts
export const maxDuration = 60  // Vercel timeout — analysis can take 15-40s

export async function POST(req: Request) {
  const { name } = await req.json()
  // 1. Check Supabase for result where analyzed_at > now() - 30 days
  // 2. If fresh → return cached result immediately
  // 3. If stale/missing → call Claude with web search tool (max 2 searches)
  // 4. Upsert to Supabase with analyzed_at = now()
  // 5. Return result as JSON
  return Response.json(result)
}
```

Use `Promise.race()` with a 40s rejection timer as the timeout mechanism — `AbortController` does not reliably cancel in-flight fetches in all environments.

---

## Lottie Integration

```tsx
import Lottie from 'lottie-react'
import eyeLineData from '@/public/animations/eyeLine.json'
import waterfineData from '@/public/animations/waterfine.json'

// While investigating: loop eyeLine
<Lottie animationData={eyeLineData} loop={true} />

// On result reveal: play waterfine once, then restore icon + show dialogue
<Lottie animationData={waterfineData} loop={false} onComplete={handleRevealComplete} />
```

---

## Vercel Deployment

- All env vars added to Vercel project settings
- `ANTHROPIC_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` → server-only, never in `NEXT_PUBLIC_`
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` → all environments
- Default Vercel region is fine
- `maxDuration = 60` on the analyze route is required

---

## Key Design Decisions

- **Tech-only scope** — non-tech companies rejected with explanation card, not scored. Prevents mislabeling unrelated businesses as AI washers.
- **Two-axis scoring** — claim level assessed independently from evidence score. Low score on a company that never claimed AI ≠ bad actor.
- **Claim-aware D label** — "D for Duplicitous" only fires when claim_level is high or medium. Low/none claim companies with a D score get "Mostly Classic ML" — no accusation of deception.
- **Score/grade suppression for non-claimers** — `no ai claims made` results do not display the score bar, grade letter, "View Report Card" button, or grade circle on the canvas. The rating line in `ResultCard` uses the label `Rating:` (not `Official label:`). This prevents neutral findings from looking like failures.
- **Prompt-level scoring guard** — the canonical prompt explicitly instructs Claude not to assign a score below 30 unless the company has confirmed AI claims (high/medium). Absence of AI evidence alone cannot produce a low score for a non-claiming company.
- **30-day cache** — biggest cost lever. Repeat lookups cost nothing. ~$0.01–0.02 per fresh investigation at Sonnet 4 pricing ($3/$15 per million tokens).
- **Max 2 web searches** — keeps most investigations under 20s. More searches caused 60–160s timeouts in the browser prototype.
- **Server-side API calls only** — `ANTHROPIC_API_KEY` never reaches the browser.
- **Canvas report card** — drawn at runtime, no server-side image generation. Downloaded as JPEG client-side.
- **Lottie over GIF** — self-contained JSON, scalable, programmatically triggerable.
- **Single company at a time** — cleaner UX. Bulk use handled by Python pipeline if needed later.
- **`Promise.race()` timeout** — 40s hard limit on API calls. More reliable than `AbortController` in sandboxed/serverless environments.
- **Supabase for everything** — caching, storage, and asset hosting in one place.
