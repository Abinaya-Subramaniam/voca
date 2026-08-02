import json
from pathlib import Path

from fastapi import APIRouter, Depends

from ..auth import get_current_user

router = APIRouter(prefix="/api/board-templates", tags=["board-templates"])

_templates_path = Path(__file__).resolve().parent.parent / "data" / "default_boards.json"
_TEMPLATES: list[dict] = json.loads(_templates_path.read_text(encoding="utf-8"))


@router.get("")
def list_board_templates(user=Depends(get_current_user)):
    """The library of default board categories (with their full symbol sets)
    a caregiver can add to a profile, beyond the boards it already has."""
    return _TEMPLATES
