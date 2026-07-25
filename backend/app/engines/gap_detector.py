import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Board, GapAlert, GapSignal

SIGNAL_THRESHOLD = 3
WINDOW_DAYS = 7

_vocab_path = Path(__file__).resolve().parent.parent / "data" / "category_vocab.json"
CATEGORY_VOCAB: dict[str, list[str]] = json.loads(_vocab_path.read_text(encoding="utf-8"))


def current_week() -> str:
    now = datetime.now(timezone.utc)
    start = datetime(now.year, 1, 1, tzinfo=timezone.utc)
    week = int(((now - start).days + start.weekday() + 1) / 7) + 1
    return f"{now.year}-W{week}"


def record_gap_signal(db: Session, profile_id: str, board_id: str) -> None:
    db.add(GapSignal(profile_id=profile_id, board_id=board_id))
    db.flush()
    evaluate_gaps(db, profile_id)


def evaluate_gaps(db: Session, profile_id: str) -> None:
    cutoff = datetime.now(timezone.utc) - timedelta(days=WINDOW_DAYS)
    signals = db.scalars(
        select(GapSignal)
        .where(GapSignal.profile_id == profile_id)
        .where(GapSignal.timestamp > cutoff)
    ).all()

    counts: dict[str, int] = {}
    for s in signals:
        counts[s.board_id] = counts.get(s.board_id, 0) + 1

    week = current_week()
    for board_id, count in counts.items():
        if count < SIGNAL_THRESHOLD:
            continue
        existing = db.scalar(
            select(GapAlert)
            .where(GapAlert.profile_id == profile_id)
            .where(GapAlert.board_id == board_id)
            .where(GapAlert.week_of == week)
        )
        if existing:
            existing.signal_count = count
        else:
            db.add(GapAlert(
                profile_id=profile_id,
                board_id=board_id,
                signal_count=count,
                week_of=week,
            ))
    db.flush()


def get_gap_alerts(db: Session, profile_id: str) -> list[dict]:
    week = current_week()
    alerts = db.scalars(
        select(GapAlert)
        .where(GapAlert.profile_id == profile_id)
        .where(GapAlert.week_of == week)
    ).all()

    results = []
    for alert in alerts:
        board = db.get(Board, alert.board_id)
        if board is None:
            continue
        existing_labels = {s.label.lower() for s in board.symbols}
        expansion = CATEGORY_VOCAB.get(board.category, CATEGORY_VOCAB["custom"])
        suggestions = [w for w in expansion if w.lower() not in existing_labels][:5]
        results.append({
            "board_id": board.id,
            "board_name": board.name,
            "signal_count": alert.signal_count,
            "week_of": alert.week_of,
            "existing_symbol_count": len(board.symbols),
            "suggested_additions": suggestions,
        })
    return results
