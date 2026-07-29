from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_owned_profile
from ..database import get_db
from ..models import BoardSession, Profile
from ..schemas import BoardSessionOut

router = APIRouter(prefix="/api/profiles/{profile_id}/board-sessions", tags=["board-sessions"])


@router.get("", response_model=list[BoardSessionOut])
def list_board_sessions(
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    """The kid's active login sessions (one per device they've logged into) —
    powers a "manage devices" view in caregiver Settings."""
    return db.scalars(
        select(BoardSession)
        .where(BoardSession.profile_id == profile.id)
        .order_by(BoardSession.created_at.desc())
    ).all()


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def revoke_board_session(
    session_id: str,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    """Kill a specific device's access immediately — e.g. a lost or stolen
    tablet — without changing the kid's username/PIN (which would log out
    every device at once)."""
    session = db.get(BoardSession, session_id)
    if session is None or session.profile_id != profile.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Board session not found")
    session.revoked_at = datetime.now(timezone.utc)
    db.commit()
