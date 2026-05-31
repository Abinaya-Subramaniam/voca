# Voca — Claude Code Context Document
> Hand this to Claude Code in VS Code before making any changes.

---

## What Voca Is

Voca is a free, web-based AAC (Augmentative and Alternative Communication) platform for non-verbal and minimally verbal individuals. Users tap pictographic symbols to build sentences, which are spoken aloud by the browser. It has an AI intelligence layer powered by on-device JS pattern analysis and the Gemini API.

**Competition MVP** — built for a competition showcase. No backend, no auth, everything stored locally.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 |
| Local storage | localStorage + IndexedDB |
| Symbol library | ARASAAC (fetched by URL, cached) |
| Text-to-speech | Web Speech API (browser built-in) |
| On-device AI | Custom JS engines (no API) |
| AI coaching | Google Gemini API (`gemini-2.5-flash`) |
| AI companion | Google Gemini API (`gemini-2.5-flash`) |
| Fonts | Nunito (display), DM Sans (body), DM Mono (mono) — Google Fonts |
| Deploy target | Vercel |

---

## Folder Structure

```
voca/
├── public/
├── src/
│   ├── assets/
│   │   └── symbols/
│   ├── components/
│   │   ├── board/
│   │   │   ├── BoardNavigator.jsx     ← main board with folder nav
│   │   │   ├── BoardTabBar.jsx        ← legacy, replaced by BoardNavigator
│   │   │   ├── CategoryCard.jsx       ← category folder cards
│   │   │   ├── PredictionBar.jsx      ← AI prediction chips above grid
│   │   │   ├── SymbolCard.jsx         ← individual symbol card
│   │   │   └── SymbolGrid.jsx         ← grid layout (used inside BoardNavigator)
│   │   ├── caregiver/
│   │   │   ├── OverviewTab.jsx        ← caregiver summary: sentence count, mood, gaps, coach
│   │   │   ├── BoardEditorTab.jsx     ← settings rendered as a full page (not drawer)
│   │   │   └── CompanionTab.jsx       ← AI chat interface for caregivers
│   │   ├── insights/
│   │   │   ├── CoachCard.jsx          ← Gemini vocabulary coach card
│   │   │   ├── GapAlert.jsx           ← vocabulary gap alert card
│   │   │   └── InsightsDashboard.jsx  ← weekly insights view (also used in caregiver Insights tab)
│   │   ├── journal/
│   │   │   └── JournalView.jsx        ← private symbol diary (3 sub-screens)
│   │   ├── landing/
│   │   │   └── LandingPage.jsx        ← marketing landing page
│   │   ├── profile/
│   │   │   ├── ProfileSelector.jsx    ← profile pick/create screen
│   │   │   └── WhoIAmCard.jsx         ← digital ID card modal
│   │   └── settings/
│   │       └── SettingsPanel.jsx      ← slide-in drawer (still exists, used as fallback)
│   ├── context/
│   │   └── AppContext.jsx             ← global state, useReducer
│   ├── data/
│   │   ├── categoryVocab.json         ← gap detection expansion lists
│   │   ├── defaultBoards.js           ← default board configs + WORD_TYPES + CATEGORY_CARDS
│   │   └── globalPredictions.json     ← fallback bigram frequency table
│   ├── engine/
│   │   ├── gapDetector.js             ← browse-without-tap gap signal logic
│   │   ├── insightsEngine.js          ← weekly metric calculations
│   │   ├── layoutOptimiser.js         ← adaptive symbol repositioning
│   │   └── predictionEngine.js        ← bigram prediction engine
│   ├── seed/
│   │   └── demoProfile.js             ← seeds "Layla" demo profile with history
│   ├── services/
│   │   ├── companionService.js        ← Gemini chat API with profile context bundling
│   │   ├── db.js                      ← IndexedDB helpers (communication + tap logs)
│   │   ├── geminiCoach.js             ← Gemini API call + weekly cache
│   │   ├── speechService.js           ← Web Speech API wrapper
│   │   ├── storage.js                 ← localStorage helpers
│   │   └── symbolService.js           ← ARASAAC URL builder + search
│   ├── store/
│   │   ├── boardStore.js              ← board CRUD (localStorage)
│   │   ├── journalStore.js            ← journal entry CRUD (localStorage)
│   │   ├── logStore.js                ← communication log (IndexedDB)
│   │   └── profileStore.js            ← profile CRUD + whoIAm + settings
│   ├── App.jsx                        ← main app shell, two-mode routing
│   ├── index.css                      ← global styles + print styles
│   └── main.jsx                       ← entry point, seeds demo profile
├── .env                               ← VITE_GEMINI_API_KEY (never commit)
├── .env.example
├── index.html                         ← Google Fonts loaded here
├── tailwind.config.js
└── vite.config.js
```

---

## Two-Mode Architecture

The app splits into two distinct modes per profile. Mode is stored in `sessionStorage` keyed per profile (`voca_mode_<profileId>`), so each profile independently remembers which mode it was last in.

### Mode 1 — User Board (for the non-verbal individual)
Clean, distraction-free. Always shows the symbol board.

**User mode nav:**
- Logo (→ landing page)
- 📔 Journal toggle button (swaps board for JournalView inline)
- Profile avatar (→ WhoIAmCard modal)
- Switch user icon (→ ProfileSelector)
- `Caregiver View` subtle link (→ switches to caregiver mode)

**User mode body:**
- `SentenceBar` + `BoardNavigator` (default)
- OR `JournalView` (when Journal is toggled on)
- No insights, no settings visible to the user

### Mode 2 — Support View (for the caregiver)
Four-tab layout in a dedicated nav with `← Back to [Name]'s Board` link.

**Caregiver mode nav:**
- Logo (→ landing page)
- `Caregiver View` pill badge
- `← Back to [Name]'s Board` link (→ switches back to user mode)
- Four tab underlines: Overview · Insights · Board Editor · Companion

**Caregiver tabs:**

| Tab | Component | What it shows |
|-----|-----------|---------------|
| Overview | `OverviewTab.jsx` | Sentence count + trend, last journal mood, gap alert count, coach priority, new vocab preview |
| Insights | `InsightsDashboard.jsx` | Full weekly insights dashboard (existing) |
| Board Editor | `BoardEditorTab.jsx` | Symbol size, grid columns, font size, accessibility toggles, board list — same content as SettingsPanel but as a full page |
| Companion | `CompanionTab.jsx` | AI chat for caregivers backed by Gemini |

---

## App Navigation Flow

```
App load
  └── sessionStorage 'voca_stage'?
        ├── no  → LandingPage
        └── yes → activeProfileId?
                    ├── no  → ProfileSelector (minimal nav)
                    └── yes → mode?
                                ├── 'user'      → UserNav + Board (or Journal)
                                └── 'caregiver' → CaregiverNav + 4-tab layout

UserNav
  ├── Logo click          → goToStage('landing')
  ├── Journal button      → toggle JournalView / Board inline
  ├── Profile avatar      → WhoIAmCard modal
  ├── Switch user icon    → SET_ACTIVE_PROFILE null → ProfileSelector
  └── Caregiver View link → SET_MODE 'caregiver'

CaregiverNav
  ├── Logo click                  → goToStage('landing')
  ├── Back to [Name]'s Board link → SET_MODE 'user'
  └── Tab clicks                  → local caregiverTab state
```

---

## Global State (AppContext)

```js
state = {
  profiles:        [],          // all profiles from localStorage
  activeProfileId: null,        // currently selected profile ID
  activeProfile:   null,        // full profile object
  boards:          [],          // boards for active profile
  activeBoardId:   null,        // currently selected board ID
  sentenceBuffer:  [],          // symbols tapped, not yet spoken
  view:            'board',     // 'board' (legacy, kept for compatibility)
  mode:            'user',      // 'user' | 'caregiver' — per-profile, from sessionStorage
}
```

**Dispatch actions:**
```js
{ type: 'INIT', profiles, activeProfileId, activeProfile, boards }
{ type: 'SET_ACTIVE_PROFILE', profileId }   // null = go to selector; restores mode for that profile
{ type: 'SET_ACTIVE_BOARD', boardId }
{ type: 'ADD_TO_SENTENCE', symbol }         // symbol = { symbolId, label, imageUrl, isCustom }
{ type: 'CLEAR_SENTENCE' }
{ type: 'REMOVE_LAST_SYMBOL' }
{ type: 'SET_VIEW', view }                  // legacy, kept for compatibility
{ type: 'SET_MODE', mode }                  // 'user' | 'caregiver', saved to sessionStorage per profile
{ type: 'REFRESH_BOARDS' }
{ type: 'REFRESH_PROFILES' }
```

**Mode persistence:**
- Key: `sessionStorage.getItem('voca_mode_<profileId>')`
- Restored automatically in `INIT` and `SET_ACTIVE_PROFILE`
- Resets to `'user'` when profile is cleared

---

## Multi-User / Profile Switching

Each profile is fully independent:
- Its own boards, communication log, journal, coach card, settings
- Its own mode state (user or caregiver)
- Switching profiles via the switch-user icon in UserNav sets `activeProfileId` to null → ProfileSelector
- On profile selection, mode is restored from `sessionStorage`

---

## Data Models

### Profile
```js
{
  id: 'profile_timestamp_random',
  name: 'Layla',
  avatarColor: '#2D9B83',
  createdAt: ISO8601,
  settings: {
    symbolSize: 'small' | 'medium' | 'large',
    fontSize: 10 | 12 | 14 | 16,
    highContrast: false,
    wideSpacing: false,
    gridColumns: 3 | 4 | 5 | 6,
    adaptiveLayoutEnabled: true,
  },
  whoIAm: {
    age: '',
    communicationNote: '',
    loveSymbols: [{ symbolId, label }],
    helpTips: ['tip1', 'tip2', 'tip3'],
    emergencyName: '',
    emergencyPhone: '',
  }
}
```

### Board
```js
{
  id: 'board_home_profile_timestamp_random',
  profileId: 'profile_...',
  name: 'Home',
  category: 'home' | 'feelings' | 'food' | 'school' | 'emergency' | 'custom',
  isRoot: true,              // true only for the home board
  gridColumns: 4,
  symbols: [BoardSymbol]
}
```

### BoardSymbol
```js
{
  position: 0,               // 0-indexed grid position
  symbolId: '25427',         // ARASAAC numeric ID as string
  label: 'I',
  wordType: 'pronoun' | 'verb' | 'noun' | 'descriptor' | 'social' | 'question' | 'none',
  imageUrl: null,            // null = use ARASAAC URL; base64 string for custom photos
  isCustom: false,
}
```

### Communication Log Entry (IndexedDB)
```js
{
  id: 'log_timestamp_random',
  profileId: 'profile_...',
  boardId: 'board_...',
  symbols: ['I', 'want', 'juice'],   // array of labels
  sentence: 'I want juice',
  timestamp: ISO8601,
}
```

### Journal Entry (localStorage)
```js
{
  id: 'entry_timestamp_random',
  profileId: 'profile_...',
  date: ISO8601,
  moodSymbol: { symbolId, label } | null,
  sentences: [[{ symbolId, label }, ...], ...],  // array of sentences, each an array of symbols
  createdAt: ISO8601,
}
```

### Coach Card (localStorage key: `coachCard_profileId_YYYY-Www`)
```js
{
  summary: 'string',
  strength: 'string',
  priority: 'string',
  suggestions: ['word1', 'word2', 'word3', 'word4', 'word5'],
  reasoning: 'string',
  generatedAt: ISO8601,
}
```

---

## localStorage Keys

```
voca_profiles                    → Profile[]
voca_active_profile              → profileId string
boards_<profileId>               → Board[]
predictions_<profileId>          → bigram frequency object
gap_signals_<profileId>          → GapSignal[]
gap_alerts_<profileId>           → GapAlert[]
coachCard_<profileId>_<weekISO>  → CoachCard
journal_entries_<profileId>      → JournalEntry[]
layout_optimised_session_<profileId> → date string
arasaac_id_<label>               → resolved ARASAAC symbolId
```

## sessionStorage Keys

```
voca_stage                  → 'landing' | 'app'
voca_mode_<profileId>       → 'user' | 'caregiver'   (per-profile)
```

---

## IndexedDB

**Database:** `voca_db` v1
**Stores:**
- `communication_log` — keyed by `id`, indexed by `profileId` and `timestamp`
- `tap_log` — keyed by `id`, indexed by `profileId`

---

## Symbol Images

All symbols load from ARASAAC:
```
https://static.arasaac.org/pictograms/{symbolId}/{symbolId}_300.png
```

If an image 404s, `SymbolCard` falls back to a letter placeholder.
`symbolService.js` has `resolveSymbolId(label)` which searches ARASAAC API by word and caches the result — this auto-fixes broken IDs on first load.

**Search API:**
```
https://api.arasaac.org/v1/pictograms/en/search/{word}
```
Returns array, use `result[0]._id`.

---

## Board Navigation (BoardNavigator)

Two-level folder system:
- **Root board** (`isRoot: true`, `category: 'home'`) — shows core symbols + category cards below
- **Category boards** — shown when a category card is tapped, with Back button to return

`CATEGORY_CARDS` in `defaultBoards.js` maps `category` string (not board ID) to display info.
`handleCategoryTap(category)` finds the board by `b.category === category` — not by hardcoded ID.

---

## Word Type Colour System

Defined in `defaultBoards.js` as `WORD_TYPES`:
```js
{
  verb:       { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800'  },
  noun:       { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  descriptor: { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-800'   },
  social:     { bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-800'   },
  question:   { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' },
  pronoun:    { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800' },
  none:       { bg: 'bg-white',     border: 'border-warm-200',   text: 'text-warm-900'   },
}
```

---

## AI Features

### 1. Predictive Suggestions (on-device)
- **File:** `src/engine/predictionEngine.js`
- Bigram frequency table stored in localStorage per profile
- Falls back to `globalPredictions.json` for new profiles
- Personal history weighted 3× over global fallback
- `recordTap(profileId, previousLabel, currentLabel)` — call on every symbol tap
- `getPredictions(profileId, lastLabel, count)` — returns array of label strings
- Rendered by `PredictionBar.jsx`

### 2. Adaptive Layout (on-device)
- **File:** `src/engine/layoutOptimiser.js`
- Runs once per session on profile load
- Requires minimum 20 taps before first adaptation
- Counts tap frequency per board per symbol over last 30 days
- Repositions symbols by frequency, most-used → most accessible positions
- Respects `settings.adaptiveLayoutEnabled`

### 3. Vocabulary Gap Detection (on-device)
- **File:** `src/engine/gapDetector.js`
- `startBrowseTimer(profileId, boardId)` — call when board becomes active
- `markTappedOnBoard()` — call on any symbol tap to cancel timer
- 8-second timer: if user browses without tapping → gap signal logged
- 3 signals in 7 days → gap alert generated
- Expansion vocabulary from `categoryVocab.json`
- Alerts displayed in `InsightsDashboard` and `OverviewTab`

### 4. Weekly Insights (on-device)
- **File:** `src/engine/insightsEngine.js`
- `computeInsights(logEntries)` → metrics object
- Metrics: totalThisWeek, totalLastWeek, topicCounts, newVocab, peakTime, longestSentence
- Rendered by `InsightsDashboard.jsx` (Insights tab) and `OverviewTab.jsx` (Overview tab)

### 5. Gemini Vocabulary Coach (API)
- **File:** `src/services/geminiCoach.js`
- Model: `gemini-2.5-flash` via `v1beta` endpoint
- `thinkingConfig: { thinkingBudget: 0 }` — thinking disabled to avoid token budget issues
- One call per profile per week (cached by ISO week string in localStorage)
- API key: `VITE_GEMINI_API_KEY` in `.env`
- Input: anonymised communication summary (no PII)
- Output: `{ summary, strength, priority, suggestions[], reasoning }`
- Rendered by `CoachCard.jsx` inside `InsightsDashboard.jsx`
- Error state shows actual Gemini error message + "Try again" button
- Refresh button available on the card header

### 6. AI Companion Chat (API)
- **File:** `src/services/companionService.js`
- **Component:** `src/components/caregiver/CompanionTab.jsx`
- Model: `gemini-2.5-flash` via `v1beta` endpoint
- Available in caregiver mode → Companion tab only
- Before each call, bundles full profile context into the system prompt:
  - Sentence counts (this week + last week)
  - Longest sentence, peak time
  - New vocabulary used this week
  - Vocabulary gap alerts
  - Last journal mood
  - AI coach priority
  - Top active boards
- Conversation lives in component state only — resets on tab change / page refresh
- Three suggested question chips shown on empty state
- User messages: right-aligned teal bubbles
- Companion replies: left-aligned white cards with border
- Loading state: three animated bounce dots
- Error state: shows actual Gemini error message inline

---

## Gemini API Pattern

Both Gemini services use the same endpoint and pattern:

```js
const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 1024,
      thinkingConfig: { thinkingBudget: 0 },
    }
  })
})

// Extract text from response:
const parts = data.candidates?.[0]?.content?.parts || []
const text = parts.map(p => p.text || '').join('')
```

Coach card parses JSON from the text response. Companion returns plain text.

---

## Journal Feature

- **Component:** `src/components/journal/JournalView.jsx`
- **Store:** `src/store/journalStore.js`
- Accessible from user mode via the 📔 Journal button in UserNav
- Three internal screens: list → new entry → view entry
- New entry flow: mood picker (8 mood symbols) → symbol sentence builder
- Symbols for journal entries come from `QUICK_SYMBOLS` list (23 common symbols)
- Entries stored in localStorage per profile
- Private to the individual user — not shared with caregiver view
- Entry detail shows mood symbol + sentences laid out in symbol cards

---

## Landing Page

- **Component:** `src/components/landing/LandingPage.jsx`
- Inline styles throughout (no Tailwind) — intentional for design fidelity
- Sections: Hero · Stats bar · How it works · Journal feature · AI features · Footer CTA
- Stats bar: 97M+ people worldwide · 9,000+ children with autism in Sri Lanka · **0.44** speech therapists per 100k (red accent — most alarming stat)
- Journal section: mockup showing mood + word chip entries, floating privacy badge
- Hero mockup: board grid + floating prediction badge + AI coach card

---

## Design System

### Fonts (loaded in index.html via Google Fonts)
```
Nunito      700, 800, 900   → font-display   → headings, buttons, logo
DM Sans     400, 500, 600   → font-sans       → all UI text, labels
DM Mono     500             → font-mono       → metric numbers
```

### Core Colours (Tailwind custom config)
```
teal-50   #E8F7F4    teal-100  #B8E8DF
teal-500  #2D9B83    teal-600  #238A72    teal-700  #1A6B58

amber-50  #FDF3E0    amber-500 #F5A623    amber-900 #7A5010

warm-50   #FAFAF8    warm-100  #F2F1EE    warm-200  #E8E6E1
warm-400  #C4C1BA    warm-600  #6B6860    warm-900  #2C2A26

semantic-success  #4CAF7D
semantic-warning  #F5A623
semantic-error    #E8534A
semantic-data     #7B8FF5
```

### Shadows (Tailwind custom config)
```
shadow-subtle   0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
shadow-raised   0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)
```

### CSS Variables (set in index.css)
```css
--color-primary: #2D9B83
--color-bg: #FAFAF8
--color-card: #FFFFFF
--color-border: #E8E6E1
--color-text-primary: #2C2A26
--color-text-secondary: #6B6860
--symbol-font-size: 12px   /* updated dynamically by settings */
```

### Animations (defined in index.css)
```
symbolTap   — scale bounce on symbol tap
chipIn      — slide-in for sentence bar chips
fadeUp      — fade up for cards
speakPulse  — bars animation during TTS playback
```

---

## Print Styles (index.css)

Two print regions defined:
```css
/* Journal PDF export */
.journal-content  → prints only journal content

/* Who I Am card print */
.who-i-am-print   → prints only the ID card
```

---

## Environment Variables

```
VITE_GEMINI_API_KEY=your_key_here
```

In Vite, accessed as `import.meta.env.VITE_GEMINI_API_KEY`.
Never commit `.env`. Set in Vercel dashboard for production.

---

## Known Issues / Things Still To Do

1. **ARASAAC symbol IDs** — some IDs in `defaultBoards.js` are approximate.
   The `resolveSymbolId()` function in `symbolService.js` auto-fixes on first load
   by searching the ARASAAC API and caching the correct ID.
   To manually verify: `https://api.arasaac.org/v1/pictograms/en/search/{word}`

2. **Demo coach card** — Layla's Gemini coach card should be pre-injected into
   localStorage before the competition demo so no live API call is needed on stage.
   Inject via browser console:
   ```js
   const week = (() => {
     const now = new Date()
     const start = new Date(now.getFullYear(), 0, 1)
     const w = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
     return `${now.getFullYear()}-W${w}`
   })()
   const profiles = JSON.parse(localStorage.getItem('voca_profiles') || '[]')
   const id = profiles[0]?.id
   if (id) {
     localStorage.setItem(`coachCard_${id}_${week}`, JSON.stringify({
       summary: "This individual communicates frequently about wants and needs — a strong foundation. Communication peaks in the afternoon and shows consistent use of core vocabulary.",
       strength: "Consistent use of 'I want' constructions shows strong agent-action understanding — a key developmental milestone.",
       priority: "Expand feeling vocabulary beyond happy and sad to support emotional expression.",
       suggestions: ["frustrated", "excited", "worried", "proud", "calm"],
       reasoning: "The feelings board shows gap signals this week, indicating the individual is seeking emotional vocabulary that is not currently available. These five words cover the most common unmet emotional expression needs in this age group.",
       generatedAt: new Date().toISOString()
     }))
     console.log('Coach card injected for', profiles[0].name)
   }
   ```

3. **Vercel deploy** — set `VITE_GEMINI_API_KEY` in Vercel project environment variables.

4. **StrictMode** — removed from `main.jsx` to prevent double Gemini API calls in development.

---

## Demo Flow (5 minutes)

| Time | Action | Why it lands |
|------|--------|-------------|
| 0:00–0:30 | Open app, show landing page stats (97M, 9,000+, 0.44) | Establish the problem urgently |
| 0:30–1:15 | Select Layla, tap 4 symbols, press Speak | Live TTS moment — viscerally powerful |
| 1:15–1:45 | Show prediction bar updating in real time | AI visibly working, zero latency |
| 1:45–2:15 | Tap Journal, show mood picker + symbol diary | Human moment — the product's soul |
| 2:15–2:30 | Tap Caregiver View link | Smooth mode switch — same profile, different lens |
| 2:30–3:00 | Show Overview tab — sentence count, mood, gaps | Caregiver has instant situational awareness |
| 3:00–3:45 | Switch to Insights tab, show weekly dashboard + coach card | The $150/hr therapist moment |
| 3:45–4:15 | Open Companion tab, ask "What should we focus on this week?" | AI that knows this specific child |
| 4:15–4:45 | Show Board Editor tab, change a setting | Caregiver control without disrupting the user |
| 4:45–5:00 | One sentence close | Leave them with the mission |

---

## What Is NOT Built (out of scope for MVP)

- User authentication / Supabase
- Cloud sync across devices
- Therapist portal
- Scanning mode / switch access
- Voice banking
- Multi-language UI
- Analytics / telemetry
- Social / sharing features
- AI journal analysis (planned for later)

---

## Running Locally

```bash
npm run dev        # start dev server at localhost:5173
npm run build      # production build
npm run preview    # preview production build
```
