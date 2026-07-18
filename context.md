# Voca — Claude Code Context Document
> Hand this to Claude Code in VS Code before making any changes.

---

## What Voca Is

Voca is a free, web-based AAC (Augmentative and Alternative Communication) platform for non-verbal and minimally verbal individuals. Users tap pictographic symbols to build sentences, which are spoken aloud by the browser. Intelligence (predictions, adaptive layout, gap detection, insights, coach, companion agent) runs on a Python backend.

**Architecture** — separate frontend and backend. React SPA (`frontend/`) talks to a FastAPI + LangGraph backend (`backend/`) over a JWT-authenticated REST API. All data lives in a relational DB (SQLite locally, Postgres in production via `DATABASE_URL`).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Server state | TanStack Query v5 (server data) + Context/useReducer (UI state) |
| Styling | Tailwind CSS v3 |
| Backend | Python 3.13, FastAPI, Uvicorn |
| ORM / migrations | SQLAlchemy 2.0 + Alembic |
| Database | SQLite (dev) / PostgreSQL (prod) — `DATABASE_URL` env |
| Auth | JWT (PyJWT) + bcrypt password hashing |
| AI agent | **LangGraph** StateGraph + `langchain-google-genai` (`gemini-2.5-flash`) |
| AI engines | Python: bigram prediction, decay-weighted layout, gap detection, insights |
| AI coaching | Gemini via LangChain, cached per ISO week in DB |
| Symbol library | ARASAAC (resolved server-side for agent, URL-loaded in UI) |
| Text-to-speech | Web Speech API (browser built-in) |
| Fonts | Nunito (display), DM Sans (body), DM Mono (mono) — Google Fonts |
| Deploy target | Frontend: Vercel · Backend: Render/Railway + managed Postgres (Neon) |

---

## Repo Structure

```
voca/
├── frontend/                          ← React SPA (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js              ← fetch wrapper, JWT token store, 401 handling
│   │   │   └── index.js               ← typed endpoint functions for every API route
│   │   ├── components/
│   │   │   ├── auth/AuthPage.jsx      ← login / register screen
│   │   │   ├── board/                 ← BoardNavigator, CategoryCard, PredictionBar, SymbolCard
│   │   │   ├── caregiver/             ← OverviewTab, BoardEditorTab, CompanionTab
│   │   │   ├── insights/              ← InsightsDashboard, CoachCard, GapAlert
│   │   │   ├── journal/JournalView.jsx
│   │   │   ├── landing/LandingPage.jsx
│   │   │   ├── profile/               ← ProfileSelector, WhoIAmCard
│   │   │   ├── sentence/SentenceBar.jsx
│   │   │   └── settings/SettingsPanel.jsx
│   │   ├── context/AppContext.jsx     ← UI state + async API actions (compat dispatch)
│   │   ├── data/defaultBoards.js      ← WORD_TYPES + CATEGORY_CARDS (display only)
│   │   ├── engine/
│   │   │   ├── gapDetector.js         ← 8s browse timer (client) → POST gap signal
│   │   │   └── predictionEngine.js    ← adapter → backend predictions/taps
│   │   ├── services/
│   │   │   ├── speechService.js       ← Web Speech API wrapper
│   │   │   └── symbolService.js       ← ARASAAC URL builder + search (display)
│   │   ├── store/                     ← thin async adapters over src/api
│   │   │                                (boardStore, profileStore, journalStore, logStore)
│   │   ├── App.jsx                    ← shell: landing → auth gate → selector → modes
│   │   └── main.jsx                   ← QueryClientProvider + AppProvider
│   ├── .env                           ← VITE_API_URL only (no secrets!)
│   └── vite.config.js
│
└── backend/                           ← FastAPI + LangGraph (Python)
    ├── app/
    │   ├── main.py                    ← app factory, CORS, router registration
    │   ├── config.py                  ← pydantic-settings (.env)
    │   ├── database.py                ← SQLAlchemy engine/session
    │   ├── models.py                  ← User, Profile, Board, BoardSymbol,
    │   │                                CommunicationLog, TapLog, JournalEntry,
    │   │                                GapSignal, GapAlert, CoachCard, Bigram
    │   ├── schemas.py                 ← Pydantic v2 (camelCase over the wire)
    │   ├── auth.py                    ← bcrypt + JWT + ownership dependencies
    │   ├── routers/                   ← auth, profiles, boards, logs, journal,
    │   │                                intelligence (insights/gaps/coach), agent
    │   ├── engines/                   ← insights, gap_detector, prediction,
    │   │                                layout_optimiser (ported from JS)
    │   ├── agent/
    │   │   ├── graph.py               ← LangGraph StateGraph agent loop
    │   │   └── tools.py               ← 8 DB-backed tools + staged actions
    │   ├── services/                  ← arasaac.py, coach_llm.py
    │   └── data/                      ← default_boards, category_vocab, global_predictions
    ├── alembic/                       ← migrations (initial schema committed)
    ├── seed.py                        ← demo account (demo@voca.app) + Layla history
    ├── requirements.txt
    └── .env                           ← DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
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

## Database & API

All persistent data lives in the backend DB (SQLite dev / Postgres prod). The
browser keeps only: the JWT (`localStorage.voca_token`), the last active profile
id (`localStorage.voca_active_profile`), per-profile mode
(`sessionStorage.voca_mode_<profileId>`), and the landing stage
(`sessionStorage.voca_stage`).

**Auth**: `POST /api/auth/register|login` → `{ accessToken, user }`. All other
routes require `Authorization: Bearer <token>`. Profiles are owned by the user;
every `/api/profiles/{id}/...` route 404s unless the profile belongs to the
caller.

**Key routes** (all JSON camelCase):
```
GET/POST         /api/profiles                          profile list / create (creates default boards)
PATCH            /api/profiles/{id}                     name, avatarColor, settings, whoIAm
POST             /api/profiles/{id}/optimise-layout     decay-weighted board reorder
GET/POST         /api/profiles/{id}/boards              board CRUD (+ /symbols endpoints)
GET/POST         /api/profiles/{id}/sentences           communication log
POST             /api/profiles/{id}/taps                tap log + bigram update
GET              /api/profiles/{id}/predictions         next-word suggestions
GET/POST/DELETE  /api/profiles/{id}/journal             journal entries
GET              /api/profiles/{id}/insights            weekly metrics
POST             /api/profiles/{id}/gaps/signal         browse-without-tap signal
GET              /api/profiles/{id}/gaps/alerts         active gap alerts + suggestions
GET/POST         /api/profiles/{id}/coach[/generate]    weekly Gemini coach card (DB-cached)
POST             /api/profiles/{id}/agent/chat          LangGraph agent conversation
POST             /api/profiles/{id}/agent/apply-action  caregiver-approved board update
```

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

All engines run server-side in Python (`backend/app/engines/`), on real DB data.

### 1. Predictive Suggestions
`engines/prediction.py` — bigram table in the `bigrams` DB table, personal
history weighted 3x over `data/global_predictions.json`. Served by
`GET /predictions`; `PredictionBar.jsx` fetches via TanStack Query on every
sentence change. Taps are recorded through `POST /taps`.

### 2. Adaptive Layout
`engines/layout_optimiser.py` — exponential time-decay weighting
(`e^(-0.1 x daysAgo)`) over the `tap_logs` table; reorders `board_symbols`
positions. Triggered by `POST /optimise-layout` on profile select (min 20 taps,
respects `settings.adaptiveLayoutEnabled`).

### 3. Vocabulary Gap Detection
Client keeps the 8-second browse timer (`frontend/src/engine/gapDetector.js`);
when it fires, `POST /gaps/signal` records it. `engines/gap_detector.py`
evaluates: 3+ signals on a board within 7 days → `gap_alerts` row for the ISO
week, expansion words from `data/category_vocab.json`.

### 4. Weekly Insights
`engines/insights.py` — `GET /insights` computes totals, per-board topic
counts (by name), new vocab vs prior 30 days, peak time, longest sentence.

### 5. Gemini Vocabulary Coach
`services/coach_llm.py` via `langchain-google-genai`. `POST /coach/generate`
creates one card per profile per ISO week (cached in the `coach_cards` table;
`?force=true` regenerates). The Insights tab auto-generates on first visit.

### 6. Companion Agent (LangGraph)
`agent/graph.py` + `agent/tools.py`. A LangGraph `StateGraph` runs an explicit
reason → act → observe loop: the agent node calls Gemini with 8 tools bound;
a `ToolNode` executes requested tools against the DB; the loop repeats until a
final grounded answer (max 8 turns).

**Read tools**: weekly insights, communication log, vocabulary gaps, board
contents, journal moods (moods only — journal sentences stay private), coach
recommendation, ARASAAC symbol search.
**Action tool**: `propose_symbols_for_board` — dedupes against the board,
resolves real ARASAAC pictograms, stages the change. The API returns it as
`pendingAction`; the UI renders an approval card; `POST /agent/apply-action`
writes approved symbols to the board.

`CompanionTab.jsx` shows the tool trace (chips) per reply and the approval
card with Approve & add / Dismiss.

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

**backend/.env** — `DATABASE_URL` (sqlite dev / postgres prod), `JWT_SECRET`,
`GEMINI_API_KEY`, `GEMINI_MODEL`, `CORS_ORIGINS`.
**frontend/.env** — `VITE_API_URL` only. The Gemini key never ships to the
browser.

## Known Issues / Notes

1. **ARASAAC symbol IDs** — verified IDs live in `backend/app/services/arasaac.py`
   (agent) and `frontend/src/services/symbolService.js` (display fallback).
   Unknown words are resolved live against the ARASAAC search API.

2. **Demo account** — `backend/seed.py` creates `demo@voca.app` /
   `voca-demo-123` with the Layla profile, 3 weeks of history, and gap signals
   on Feelings. Coach card generates from real data on first Insights visit.

3. **Deploy** — backend: Render/Railway with `DATABASE_URL` pointing at managed
   Postgres (add `psycopg2-binary` to requirements), run
   `alembic upgrade head`, set `CORS_ORIGINS` to the Vercel URL. Frontend:
   Vercel with root directory `frontend/` and `VITE_API_URL` set to the
   backend URL.

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

- Therapist portal
- Scanning mode / switch access
- Voice banking
- Multi-language UI
- Analytics / telemetry
- Social / sharing features
- AI journal analysis (planned for later)
- Refresh tokens / password reset (single long-lived access token for now)

---

## Running Locally

```bash
# Backend (Python 3.11+)
cd backend
python -m venv .venv && .venv/Scripts/pip install -r requirements.txt
python seed.py                                  # tables + demo data
.venv/Scripts/python -m uvicorn app.main:app --port 8000 --reload

# Frontend
cd frontend
npm install
npm run dev                                     # http://localhost:5173
```

Sign in with `demo@voca.app` / `voca-demo-123`, or register a new account.
