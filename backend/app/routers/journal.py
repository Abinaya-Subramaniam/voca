from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_owned_profile
from ..database import get_db
from ..models import JournalEntry, Profile
from ..schemas import JournalEntryCreate, JournalEntryOut

router = APIRouter(prefix="/api/profiles/{profile_id}/journal", tags=["journal"])


@router.get("", response_model=list[JournalEntryOut])
def list_entries(profile: Profile = Depends(get_owned_profile), db: Session = Depends(get_db)):
    return db.scalars(
        select(JournalEntry)
        .where(JournalEntry.profile_id == profile.id)
        .order_by(JournalEntry.created_at.desc())
    ).all()


@router.post("", response_model=JournalEntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    body: JournalEntryCreate,
    profile: Profile = Depends(get_owned_profile),
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
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    entry = db.get(JournalEntry, entry_id)
    if entry is None or entry.profile_id != profile.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Entry not found")
    db.delete(entry)
    db.commit()
