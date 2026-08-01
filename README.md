# Voca

**Voca** is an AI Powered web-based AAC (Augmentative and Alternative Communication)
platform for non-verbal and minimally verbal individuals of all ages: young
children with autism or apraxia of speech, as well as non-verbal or minimally
verbal teens and adults. It replaces static, one-size-fits-all symbol boards
with an app that learns each person's real communication patterns and
includes an agentic AI assistant that supports the caregiver behind them.

Where a typical AAC app is a fixed grid of symbols, Voca is built AI-first:
boards reorganise themselves around real usage, missing vocabulary is
flagged automatically, and the built-in **Voca Bot** can act on the
individual's real data, not just answer questions about it.

## Table of contents

- [Core features](#core-features)
- [The AI agent workflow](#the-ai-agent-workflow)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Setup instructions](#setup-instructions)
- [Environment variables](#environment-variables)
- [Deploying](#deploying)
- [Privacy & security](#privacy--security)

## Core features

- **AAC symbol board**: tap-to-speak pictogram boards (ARASAAC symbol
  library) organized into categories (Home, Feelings, People, Activities,
  Social, School, Emergency, Numbers, and more), with text-to-speech via the
  Web Speech API.
- **AI word prediction**: learns each person's own bigram communication
  patterns and predicts their next word in real time as they build a
  sentence, on top of a global cold-start model for new profiles.
- **Auto-organizing boards**: a layout optimiser re-ranks each board's
  symbols by recency-weighted real usage, so the words someone reaches for
  most stay easiest to find, with no manual dragging required.
- **Missing vocabulary alerts**: detects when someone repeatedly browses a
  board without tapping (a "gap signal"), and surfaces an alert with
  suggested words to add before frustration sets in.
- **Weekly AI coaching**: a personalized weekly coach card for caregivers
  summarising strengths, a priority focus area, and suggested next words,
  generated from the individual's real communication log.
- **Agentic Voca Bot**: an AI agent that doesn't just answer questions, it
  can read a person's real communication data and *act* on it directly
  (see [The AI agent workflow](#the-ai-agent-workflow) below).
- **Two dashboards, one app**: caregivers get a dashboard for managing
  boards, vocabulary, and coaching; each communicator gets their own
  private, secure AAC board and journal, with no access to the other's
  screens or data.
- **Persistent communicator logins**: each communicator gets their own
  username + 4-digit PIN (set by their caregiver), so they log in on their
  own device going forward instead of relying on a caregiver hand-off.

## The AI agent workflow

The **Voca Bot** ("Voca Companion") is a tool-calling agent built with
[LangGraph](https://langchain-ai.github.io/langgraph/), exposed to caregivers
as a chat interface on the caregiver dashboard.

### Graph

`backend/app/agent/graph.py` compiles a small LangGraph state machine:

```
START → agent ─┬─ (no tool calls) → END
                └─ (tool calls) → tools → agent  (loops until the model stops calling tools)
```

- **`agent` node**: invokes the chat LLM (see [LLM routing](#llm-routing-and-fallback)
  below) with the full message history and the tool set below. The model
  decides whether to answer directly or call a tool first.
- **`tools` node**: a LangGraph `ToolNode` that executes whichever tools the
  model requested, then loops back to `agent` so it can reason over the
  results. Capped at `MAX_AGENT_TURNS = 8` round-trips via `recursion_limit`.

### Tools (`backend/app/agent/tools.py`)

Every tool is scoped to the caregiver's currently-selected profile. The
agent only ever sees one individual's data per conversation, and never sees
another profile's data at all:

| Tool | Purpose |
| --- | --- |
| `get_weekly_insights` | Sentence counts this week vs. last week, longest sentence, peak communication time, new vocabulary. |
| `get_communication_log` | The individual's actual recent sentences (not just counts), newest first. |
| `get_vocabulary_gaps` | Active gap alerts (boards browsed repeatedly without a tap) with suggested words. |
| `get_board_contents` | Lists all boards, or every symbol on one board (used to avoid proposing duplicates). |
| `get_journal_moods` | Recent journal moods only. Journal sentences are never exposed to the agent. |
| `get_coach_recommendation` | This week's AI coach card: summary, strength, priority, suggested words. |
| `search_symbol` | Checks whether an ARASAAC pictogram exists for a word. |
| `propose_symbols_for_board` | **The only tool that can change anything.** Stages new vocabulary on a board; it does not write the change directly. |

### Human-in-the-loop approval

The agent is deliberately unable to edit a board on its own. When it calls
`propose_symbols_for_board`, that tool resolves each word to a real ARASAAC
pictogram, stores the proposed change as a `pending_action` (not yet written
to the database), and returns `status: "awaiting_caregiver_confirmation"`.
The caregiver-facing chat then renders this as an **approval card**; nothing
is written to the individual's boards until the caregiver explicitly clicks
**Apply** (`POST /api/profiles/{profile_id}/agent/messages/{id}/apply`).

### Guardrails against false claims

Because it's easy for a language model to *describe* an action it never
actually performed, the system prompt explicitly forbids claiming an
approval card exists unless `propose_symbols_for_board` was called in that
exact turn. As a second line of defence, `run_companion_agent()` in
`graph.py` scans the model's final reply for approval-claiming language
(`"approval card"`, `"awaiting confirmation"`, etc.). If it finds that
language **without** a real `pending_action` having been created, it
re-invokes the graph with a corrective system reminder before returning
anything to the caregiver, so the UI can never show a false "I've prepared
that for you" with no approval card behind it.

### LLM routing and fallback

`backend/app/services/llm.py` builds the chat model used by the graph.
**OpenAI (`gpt-4o-mini` by default)** is the primary provider, with
**Google Gemini (`gemini-2.5-flash` by default)** wired in as an automatic
fallback via LangChain's `.with_fallbacks()`. If OpenAI errors out (rate
limit, outage, quota), the same request transparently retries against
Gemini with no visible interruption to the caregiver.

## Tech stack

**Frontend**
- React 18 + Vite
- React Router v7
- TanStack Query (server state/caching)
- Tailwind CSS
- Native `IntersectionObserver` for scroll-based UI, Web Speech API for
  text-to-speech, with no extra runtime dependencies for either

**Backend**
- FastAPI (Python 3.11+)
- SQLAlchemy 2.0 ORM + Alembic migrations
- Pydantic v2 / pydantic-settings for schemas and config
- PyJWT + bcrypt for authentication (scoped JWTs, see below)
- SQLite for local development, PostgreSQL in production via `DATABASE_URL`

**AI / agent**
- LangGraph + LangChain (langchain-core, langchain-openai,
  langchain-google-genai)
- OpenAI (`gpt-4o-mini`) as the primary LLM, Google Gemini
  (`gemini-2.5-flash`) as an automatic fallback

**Third-party data**
- [ARASAAC](https://arasaac.org/): open-access pictogram symbol library
  (Creative Commons BY-NC-SA)

## Architecture

```
frontend/   React 18 + Vite · TanStack Query · Tailwind          →  talks to
backend/    FastAPI · SQLAlchemy + Alembic · JWT auth (scoped)   →  reads/writes
            LangGraph agent (OpenAI, Gemini fallback)
            SQLite (dev) / PostgreSQL (prod) via DATABASE_URL
```

Authentication uses scoped JWTs rather than a single shared login:
- **`caregiver` scope**: issued on `/api/auth/login`. Can manage profiles,
  boards, vocabulary, and the AI Companion chat, but has no access to any
  individual's AAC board, journal, or "Who Am I" card.
- **`board` scope**: issued on `/api/auth/kid-login` (username + 4-digit
  PIN) as a revocable, device-paired `BoardSession`. Can only use the AAC
  board, journal, and their own profile, with no access to caregiver routes,
  other profiles, or the AI Companion.

This is enforced on the backend (not just hidden in the UI): every route is
gated by a specific dependency (`get_owned_profile`, `get_board_profile`, or
`get_shared_profile`) so a communicator's session token is cryptographically
incapable of reaching caregiver-only data, and vice versa.

## Project structure

```
backend/
  app/
    agent/          LangGraph agent: graph.py (state machine), tools.py (tool-calling)
    engines/         Word prediction, layout optimiser, gap detector, insights
    routers/         FastAPI routes: auth, profiles, boards, logs, journal, intelligence, agent
    services/        LLM routing, ARASAAC symbol lookup, journal, coach LLM
    models.py        SQLAlchemy models
    schemas.py       Pydantic request/response schemas
    auth.py          JWT issuing/verification, scope enforcement
    main.py          FastAPI app + router wiring
  alembic/           Database migrations
  seed.py            Seeds a demo account with sample communication history

frontend/
  src/
    components/
      auth/          Login / register / kid-login
      board/          AAC board UI (communicator-facing)
      caregiver/      Caregiver dashboard (Overview, Vocab Coach, Settings, Voca Bot)
      insights/       Vocab Coach dashboard
      journal/        Private journal UI
      landing/        Marketing landing page
      profile/        Profile selection / creation
    context/          AppContext (app-wide state, no Redux)
    api/              API client + endpoint wrappers
    store/             Profile/board data access helpers
```

## Setup instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys) (required for
  the AI Companion and weekly coach) and, optionally, a
  [Google Gemini API key](https://aistudio.google.com/apikey) for automatic
  fallback

### Backend

```bash
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt      # Scripts→bin on macOS/Linux
cp .env.example .env                               # then add your API keys
alembic upgrade head                               # apply database migrations
python seed.py                                      # optional: demo account + sample data
.venv/Scripts/python -m uvicorn app.main:app --port 8000 --reload
```

The API is now running at `http://localhost:8000` (health check at
`GET /api/health`).

### Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Register a new caregiver account from the app, or, if you ran `seed.py`,
sign in with the seeded demo account: `demo@voca.app` / `voca-demo-123`.

### Useful scripts

| Command | Where | Does |
| --- | --- | --- |
| `npm run dev` | `frontend/` | Start the Vite dev server |
| `npm run build` | `frontend/` | Production build |
| `npm run lint` | `frontend/` | ESLint |
| `alembic revision --autogenerate -m "..."` | `backend/` | Create a new migration after model changes |
| `alembic upgrade head` | `backend/` | Apply all pending migrations |

## Environment variables

Set in `backend/.env` (see `backend/.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:///./voca.db` | SQLite locally; point at managed Postgres in production |
| `JWT_SECRET` | `change-me-in-production` | Signing secret for auth tokens. **Must** be overridden in production |
| `OPENAI_API_KEY` | none | Primary LLM provider for the AI Companion and weekly coach |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model name |
| `GEMINI_API_KEY` | none | Optional automatic fallback if OpenAI errors out |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model name |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated allowed frontend origins |

## Deploying

- **Backend**: Render / Railway. Set `DATABASE_URL` to a managed Postgres
  instance (e.g. the Neon free tier: add psycopg2-binary to
  `requirements.txt`), plus `JWT_SECRET`, `OPENAI_API_KEY`, `GEMINI_API_KEY`,
  and `CORS_ORIGINS` pointing at your deployed frontend URL. Run
  `alembic upgrade head` as part of your deploy step.
- **Frontend**: Vercel, with root directory `frontend/`. Set `VITE_API_URL`
  to your deployed backend URL.

## Privacy & security

- Boards, communication logs, journal entries, and profiles are only ever
  readable by the account they belong to, enforced server-side by scoped
  JWTs, not just hidden in the UI (see [Architecture](#architecture)).
- The only data that ever leaves the device is an **anonymized** summary of
  communication patterns (word counts, categories, timing, not names or
  journal content) sent to OpenAI/Gemini to generate coaching advice and
  power the AI Companion.
- Communicator logins use a 4-digit PIN with attempt-based lockout
  (`failed_pin_attempts` / `locked_until` on the `Profile` model) to guard
  against brute-forcing.
