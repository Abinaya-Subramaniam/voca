"""Weekly insights engine — ported from the original on-device JS implementation."""

from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Board, CommunicationLog


def _aware(ts: datetime) -> datetime:
    return ts if ts.tzinfo else ts.replace(tzinfo=timezone.utc)


def compute_insights(db: Session, profile_id: str) -> dict:
    now = datetime.now(timezone.utc)
    month_ago = now - timedelta(days=30)

    entries = db.scalars(
        select(CommunicationLog)
        .where(CommunicationLog.profile_id == profile_id)
        .where(CommunicationLog.timestamp > month_ago)
    ).all()

    this_week = [e for e in entries if (now - _aware(e.timestamp)).days < 7]
    last_week = [e for e in entries if 7 <= (now - _aware(e.timestamp)).days < 14]

    board_names = {
        b.id: b.name
        for b in db.scalars(select(Board).where(Board.profile_id == profile_id)).all()
    }
    topic_counts: dict[str, int] = {}
    for e in this_week:
        name = board_names.get(e.board_id, "Unknown")
        topic_counts[name] = topic_counts.get(name, 0) + 1

    older_symbols = {
        s
        for e in entries
        if 7 <= (now - _aware(e.timestamp)).days < 30
        for s in (e.symbols or [])
    }
    seen: set[str] = set()
    new_vocab = []
    for e in this_week:
        for s in e.symbols or []:
            if s not in older_symbols and s not in seen:
                seen.add(s)
                new_vocab.append(s)

    buckets = {"Morning": 0, "Afternoon": 0, "Evening": 0}
    for e in this_week:
        hour = _aware(e.timestamp).hour
        if 5 <= hour < 12:
            buckets["Morning"] += 1
        elif 12 <= hour < 18:
            buckets["Afternoon"] += 1
        else:
            buckets["Evening"] += 1
    peak_time = max(buckets, key=buckets.get)

    longest = max((len(e.symbols or []) for e in this_week), default=0)

    return {
        "total_this_week": len(this_week),
        "total_last_week": len(last_week),
        "topic_counts": topic_counts,
        "new_vocab": new_vocab,
        "peak_time": peak_time,
        "longest_sentence": longest,
    }
