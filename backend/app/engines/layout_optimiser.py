"""Adaptive layout — repositions symbols by exponential time-decay-weighted usage."""

import math
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Board, Profile, TapLog

MIN_TAPS = 20
DAYS_WINDOW = 30
DECAY_LAMBDA = 0.1  # tap from 10 days ago ~ 37% weight; 30 days ~ 5%


def _decay_weight(timestamp: datetime) -> float:
    ts = timestamp if timestamp.tzinfo else timestamp.replace(tzinfo=timezone.utc)
    days_ago = (datetime.now(timezone.utc) - ts).total_seconds() / 86_400
    return math.exp(-DECAY_LAMBDA * days_ago)


def run_layout_optimiser(db: Session, profile: Profile) -> bool:
    """Reorder board symbols by decay-weighted tap frequency. Returns True if boards changed."""
    if not profile.settings.get("adaptiveLayoutEnabled", True):
        return False

    cutoff = datetime.now(timezone.utc) - timedelta(days=DAYS_WINDOW)
    taps = db.scalars(
        select(TapLog)
        .where(TapLog.profile_id == profile.id)
        .where(TapLog.timestamp > cutoff)
    ).all()
    if len(taps) < MIN_TAPS:
        return False

    freq: dict[str, dict[str, float]] = {}
    for tap in taps:
        if not tap.board_id:
            continue
        freq.setdefault(tap.board_id, {})
        freq[tap.board_id][tap.label] = freq[tap.board_id].get(tap.label, 0) + _decay_weight(tap.timestamp)

    changed = False
    boards = db.scalars(select(Board).where(Board.profile_id == profile.id)).all()
    for board in boards:
        board_freq = freq.get(board.id)
        if not board_freq:
            continue
        ordered = sorted(board.symbols, key=lambda s: board_freq.get(s.label, 0), reverse=True)
        for i, symbol in enumerate(ordered):
            if symbol.position != i:
                symbol.position = i
                changed = True

    db.flush()
    return changed
