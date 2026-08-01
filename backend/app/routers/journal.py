from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_board_profile, get_owned_profile
from ..database import get_db
from ..models import JournalEntry, Profile
from ..schemas import JournalEntryCreate, JournalEntryOut, JournalMoodOut
from ..services.journal import get_recent_moods

router = APIRouter(prefix="/api/profiles/{profile_id}/journal", tags=["journal"])


@router.get("", response_model=list[JournalEntryOut])
def list_entries(profile: Profile = Depends(get_board_profile), db: Session = Depends(get_db)):
    """Full journal entries, including private sentence content — board-session
    only. A caregiver token must never reach this, even directly."""
    return db.scalars(
        select(JournalEntry)
        .where(JournalEntry.profile_id == profile.id)
        .order_by(JournalEntry.created_at.desc())
    ).all()


@router.post("", response_model=JournalEntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    body: JournalEntryCreate,
    profile: Profile = Depends(get_board_profile),
    db: Session = Depends(get_db),
):
    entry = JournalEntry(
        profile_id=profile.id,
        mood_symbol=body.mood_symbol,
        sentences=body.sentences,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    entry_id: str,
    profile: Profile = Depends(get_board_profile),
    db: Session = Depends(get_db),
):
    entry = db.get(JournalEntry, entry_id)
    if entry is None or entry.profile_id != profile.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Entry not found")
    db.delete(entry)
    db.commit()


@router.get("/moods", response_model=list[JournalMoodOut])
def list_moods(profile: Profile = Depends(get_owned_profile), db: Session = Depends(get_db)):
    """Mood-only projection for the caregiver dashboard — never includes the
    private `sentences` field, by construction (JournalMoodOut has no such field)."""
    return get_recent_moods(db, profile.id)
