from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import Base, engine
from .routers import agent, auth, boards, intelligence, journal, logs, profiles

settings = get_settings()

app = FastAPI(title="Voca API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    # Dev convenience: create any missing tables. Production schema changes go
    # through Alembic (`alembic upgrade head`).
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(boards.router)
app.include_router(logs.router)
app.include_router(journal.router)
app.include_router(intelligence.router)
app.include_router(agent.router)
