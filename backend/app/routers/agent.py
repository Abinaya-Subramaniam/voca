from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..agent.graph import run_companion_agent
from ..auth import get_owned_profile
from ..database import get_db
from ..models import Board, BoardSymbol, ChatMessage, Profile
from ..schemas import (
    AgentChatRequest,
    AgentChatResponse,
    ApplyActionResponse,
    ChatMessageOut,
)

router = APIRouter(prefix="/api/profiles/{profile_id}/agent", tags=["agent"])


@router.get("/messages", response_model=list[ChatMessageOut])
def list_messages(
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    """Full remembered conversation history for this profile's companion chat."""
    rows = db.scalars(
        select(ChatMessage)
        .where(ChatMessage.profile_id == profile.id)
        .order_by(ChatMessage.created_at)
    ).all()
    return rows


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

    db.add(ChatMessage(profile_id=profile.id, role="user", text=body.messages[-1].text))
    companion_msg = ChatMessage(
        profile_id=profile.id,
        role="companion",
        text=result["text"],
        steps=result["steps"],
        pending_action=result["pending_action"],
        action_status="pending" if result["pending_action"] else None,
    )
    db.add(companion_msg)
    db.commit()  # also persists any gap alert re-evaluations etc. done by tools
    db.refresh(companion_msg)

    return {
        "id": companion_msg.id,
        "text": result["text"],
        "steps": result["steps"],
        "pending_action": result["pending_action"],
    }


@router.post("/messages/{message_id}/apply", response_model=ApplyActionResponse)
def apply_action(
    message_id: str,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    """Caregiver approved a staged board update — write it to the real board."""
    msg = db.get(ChatMessage, message_id)
    if (
        msg is None
        or msg.profile_id != profile.id
        or msg.action_status != "pending"
        or not msg.pending_action
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No pending action found")

    action = msg.pending_action
    board = db.get(Board, action["board_id"])
    if board is None or board.profile_id != profile.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Board not found")

    existing = {s.label.lower() for s in board.symbols}
    max_pos = max((s.position for s in board.symbols), default=-1)
    added = 0
    for staged in action["symbols"]:
        if staged["word"].lower() in existing:
            continue
        max_pos += 1
        db.add(BoardSymbol(
            board_id=board.id,
            position=max_pos,
            symbol_id=staged["symbol_id"],
            label=staged["word"],
            word_type=staged.get("word_type", "none"),
        ))
        added += 1

    msg.action_status = "applied"
    msg.action_added_count = added
    db.commit()
    return {"added": added, "board_id": board.id}


@router.post("/messages/{message_id}/dismiss", response_model=ChatMessageOut)
def dismiss_action(
    message_id: str,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    msg = db.get(ChatMessage, message_id)
    if msg is None or msg.profile_id != profile.id or msg.action_status != "pending":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No pending action found")
    msg.action_status = "dismissed"
    db.commit()
    db.refresh(msg)
    return msg
