"""Bigram next-word prediction — personal history weighted 3x over global fallback."""

import json
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Bigram

_global_path = Path(__file__).resolve().parent.parent / "data" / "global_predictions.json"
GLOBAL_PREDICTIONS: dict[str, dict[str, int]] = json.loads(_global_path.read_text(encoding="utf-8"))

GLOBAL_STARTERS = {"I": 50, "want": 30, "go": 20, "help": 15, "more": 12, "yes": 10, "no": 10}


def record_bigram(db: Session, profile_id: str, prev_label: str | None, next_label: str) -> None:
    if not prev_label or not next_label:
        return
    row = db.scalar(
        select(Bigram)
        .where(Bigram.profile_id == profile_id)
        .where(Bigram.prev_label == prev_label)
        .where(Bigram.next_label == next_label)
    )
    if row:
        row.count += 1
    else:
        db.add(Bigram(profile_id=profile_id, prev_label=prev_label, next_label=next_label, count=1))
    db.flush()


def get_predictions(db: Session, profile_id: str, last_label: str | None, count: int = 3) -> list[str]:
    if not last_label:
        return sorted(GLOBAL_STARTERS, key=GLOBAL_STARTERS.get, reverse=True)[:count]

    merged: dict[str, float] = {}
    for label, score in GLOBAL_PREDICTIONS.get(last_label, {}).items():
        merged[label] = merged.get(label, 0) + score

    personal = db.scalars(
        select(Bigram)
        .where(Bigram.profile_id == profile_id)
        .where(Bigram.prev_label == last_label)
    ).all()
    for row in personal:
        merged[row.next_label] = merged.get(row.next_label, 0) + row.count * 3

    return sorted(merged, key=merged.get, reverse=True)[:count]
