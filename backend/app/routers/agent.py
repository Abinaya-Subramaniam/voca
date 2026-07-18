from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..agent.graph import run_companion_agent
from ..auth import get_owned_profile
from ..database import get_db
from ..models import Board, BoardSymbol, Profile
from ..schemas import (
    AgentChatRequest,
    AgentChatResponse,
    ApplyActionRequest,
    ApplyActionResponse,
)

router = APIRouter(prefix="/api/profiles/{profile_id}/agent", tags=["agent"])


@router.post("/chat", response_model=AgentChatResponse)
def chat(
    body: AgentChatRequest,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    if not body.messages:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "messages must not be empty")
    try:
        result = run_companion_agent(
            db, profile, [{"role": m.role, "text": m.text} for m in body.messages]
        )
    except RuntimeError as err:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(err))
    db.commit()  # persist any gap alert re-evaluations etc. done by tools
    return result


@router.post("/apply-action", response_model=ApplyActionResponse)
def apply_action(
    body: ApplyActionRequest,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    """Caregiver approved a staged board update — write it to the real board."""
    board = db.get(Board, body.action.board_id)
    if board is None or board.profile_id != profile.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Board not found")

    existing = {s.label.lower() for s in board.symbols}
    max_pos = max((s.position for s in board.symbols), default=-1)
    added = 0
    for staged in body.action.symbols:
        if staged.word.lower() in existing:
            continue
        max_pos += 1
        db.add(BoardSymbol(
            board_id=board.id,
            position=max_pos,
            symbol_id=staged.symbol_id,
            label=staged.word,
            word_type=staged.word_type,
        ))
        added += 1
    db.commit()
    return {"added": added, "board_id": board.id}
