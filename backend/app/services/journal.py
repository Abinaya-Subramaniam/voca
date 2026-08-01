from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import JournalEntry


def get_recent_moods(db: Session, profile_id: str, limit: int = 5) -> list[JournalEntry]:
    """Journal sentences are private to the individual — this intentionally returns
    full JournalEntry rows so callers can read mood_symbol/created_at, but callers
    must never surface `.sentences` (the private diary text) outside a board-scoped
    context."""
    return db.scalars(
        select(JournalEntry)
        .where(JournalEntry.profile_id == profile_id)
        .order_by(JournalEntry.created_at.desc())
        .limit(limit)
    ).all()
