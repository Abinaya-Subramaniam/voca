# Voca

Free, web-based AAC (Augmentative and Alternative Communication) platform for
non-verbal and minimally verbal individuals — with a LangGraph AI agent that
supports caregivers using the individual's real communication data.

## Architecture

```
frontend/   React 18 + Vite · TanStack Query · Tailwind        → talks to
backend/    FastAPI · SQLAlchemy + Alembic · JWT auth · LangGraph + Gemini
            SQLite (dev) / PostgreSQL (prod) via DATABASE_URL
```

See [context.md](context.md) for the full architecture reference.

## Quick start

**Backend** (Python 3.11+):

```bash
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt      # Scripts→bin on macOS/Linux
cp .env.example .env                               # add your GEMINI_API_KEY
python seed.py                                     # tables + demo data
.venv/Scripts/python -m uvicorn app.main:app --port 8000 --reload
```

**Frontend**:

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Sign in with the seeded demo account — `demo@voca.app` / `voca-demo-123` — or
register your own.

## Deploying

- **Backend**: Render / Railway. Set `DATABASE_URL` to a managed Postgres
  (e.g. Neon free tier — add `psycopg2-binary` to requirements), `JWT_SECRET`,
  `GEMINI_API_KEY`, and `CORS_ORIGINS` to your frontend URL. Run
  `alembic upgrade head` on deploy.
- **Frontend**: Vercel with root directory `frontend/`; set `VITE_API_URL` to
  the deployed backend URL.
