from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_owned_profile
from ..database import get_db
from ..engines.prediction import get_predictions, record_bigram
from ..models import CommunicationLog, Profile, TapLog
from ..schemas import PredictionsOut, SentenceLogCreate, SentenceLogOut, TapLogCreate

router = APIRouter(prefix="/api/profiles/{profile_id}", tags=["logs"])


@router.post("/sentences", response_model=SentenceLogOut, status_code=status.HTTP_201_CREATED)
def log_sentence(
    body: SentenceLogCreate,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    entry = CommunicationLog(
        profile_id=profile.id,
        board_id=body.board_id,
        symbols=body.symbols,
        sentence=body.sentence,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/sentences", response_model=list[SentenceLogOut])
def list_sentences(
    limit: int = 500,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    return db.scalars(
        select(CommunicationLog)
        .where(CommunicationLog.profile_id == profile.id)
        .order_by(CommunicationLog.timestamp.desc())
        .limit(limit)
    ).all()


@router.post("/taps", status_code=status.HTTP_201_CREATED)
def log_tap(
    body: TapLogCreate,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    db.add(TapLog(profile_id=profile.id, board_id=body.board_id, label=body.label))
    record_bigram(db, profile.id, body.previous_label, body.label)
    db.commit()
    return {"ok": True}


@router.get("/predictions", response_model=PredictionsOut)
def predictions(
    last_label: str | None = None,
    count: int = 3,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    return {"predictions": get_predictions(db, profile.id, last_label, count)}
