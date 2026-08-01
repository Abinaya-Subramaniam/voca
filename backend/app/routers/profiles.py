import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_current_user, get_owned_profile, get_shared_profile, hash_password
from ..database import get_db
from ..engines.layout_optimiser import run_layout_optimiser
from ..models import Board, BoardSymbol, Profile, User
from ..schemas import DEFAULT_SETTINGS, DEFAULT_WHO_I_AM, ProfileCreate, ProfileOut, ProfileUpdate, WhoIAmUpdate

router = APIRouter(prefix="/api/profiles", tags=["profiles"])

_boards_path = Path(__file__).resolve().parent.parent / "data" / "default_boards.json"
DEFAULT_BOARDS = json.loads(_boards_path.read_text(encoding="utf-8"))


def create_default_boards(db: Session, profile_id: str) -> None:
    for spec in DEFAULT_BOARDS:
        board = Board(
            profile_id=profile_id,
            name=spec["name"],
            category=spec["category"],
            is_root=spec["isRoot"],
            grid_columns=spec["gridColumns"],
        )
        db.add(board)
        db.flush()
        for s in spec["symbols"]:
            db.add(BoardSymbol(
                board_id=board.id,
                position=s["position"],
                symbol_id=s["symbolId"],
                label=s["label"],
                word_type=s.get("wordType", "none"),
            ))


@router.get("", response_model=list[ProfileOut])
def list_profiles(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.scalars(
        select(Profile).where(Profile.user_id == user.id).order_by(Profile.created_at)
    ).all()


@router.post("", response_model=ProfileOut, status_code=status.HTTP_201_CREATED)
def create_profile(
    body: ProfileCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    username = body.username.strip().lower()
    if db.scalar(select(Profile).where(Profile.username == username)):
        raise HTTPException(status.HTTP_409_CONFLICT, "That username is already taken")

    profile = Profile(
        user_id=user.id,
        name=body.name,
        avatar_color=body.avatar_color,
        settings=dict(DEFAULT_SETTINGS),
        who_i_am=dict(DEFAULT_WHO_I_AM),
        username=username,
        pin_hash=hash_password(body.pin),
    )
    db.add(profile)
    db.flush()
    create_default_boards(db, profile.id)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/{profile_id}", response_model=ProfileOut)
def get_profile(profile: Profile = Depends(get_shared_profile)):
    """Read-only profile info — needed by both the caregiver dashboard and the
    kid's own board boot (settings like font size/contrast, who-i-am, avatar)."""
    return profile


@router.patch("/{profile_id}", response_model=ProfileOut)
def update_profile(
    body: ProfileUpdate,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    if body.name is not None:
        profile.name = body.name
    if body.avatar_color is not None:
        profile.avatar_color = body.avatar_color
    if body.settings is not None:
        profile.settings = {**profile.settings, **body.settings}
    if body.who_i_am is not None:
        profile.who_i_am = {**profile.who_i_am, **body.who_i_am}
    if body.username is not None:
        username = body.username.strip().lower()
        if username != profile.username:
            conflict = db.scalar(
                select(Profile).where(Profile.username == username).where(Profile.id != profile.id)
            )
            if conflict:
                raise HTTPException(status.HTTP_409_CONFLICT, "That username is already taken")
            profile.username = username
    if body.pin is not None:
        profile.pin_hash = hash_password(body.pin)
        profile.failed_pin_attempts = 0
        profile.locked_until = None
    db.commit()
    db.refresh(profile)
    return profile


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile(profile: Profile = Depends(get_owned_profile), db: Session = Depends(get_db)):
    db.delete(profile)
    db.commit()


@router.patch("/{profile_id}/who-i-am", response_model=ProfileOut)
def update_who_i_am(
    body: WhoIAmUpdate,
    profile: Profile = Depends(get_shared_profile),
    db: Session = Depends(get_db),
):
    """The individual's own self-description card — editable from their own
    board session (the 'Who Am I' card), not just by the caregiver. Kept as
    its own endpoint rather than opening the general profile PATCH (name,
    avatar, username, PIN) to a board-scoped token."""
    profile.who_i_am = {**profile.who_i_am, **body.who_i_am}
    db.commit()
    db.refresh(profile)
    return profile


@router.post("/{profile_id}/optimise-layout")
def optimise_layout(profile: Profile = Depends(get_shared_profile), db: Session = Depends(get_db)):
    changed = run_layout_optimiser(db, profile)
    db.commit()
    return {"changed": changed}
