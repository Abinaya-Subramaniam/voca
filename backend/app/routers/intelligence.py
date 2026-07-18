"""Insights, gap detection, and the weekly Gemini coach card."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_owned_profile
from ..database import get_db
from ..engines.gap_detector import current_week, get_gap_alerts, record_gap_signal
from ..engines.insights import compute_insights
from ..models import CoachCard, Profile
from ..schemas import CoachCardOut, GapAlertOut, GapSignalCreate, InsightsOut
from ..services.coach_llm import generate_coach_card

router = APIRouter(prefix="/api/profiles/{profile_id}", tags=["intelligence"])


@router.get("/insights", response_model=InsightsOut)
def insights(profile: Profile = Depends(get_owned_profile), db: Session = Depends(get_db)):
    return compute_insights(db, profile.id)


@router.post("/gaps/signal", status_code=status.HTTP_201_CREATED)
def gap_signal(
    body: GapSignalCreate,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    record_gap_signal(db, profile.id, body.board_id)
    db.commit()
    return {"ok": True}


@router.get("/gaps/alerts", response_model=list[GapAlertOut])
def gap_alerts(profile: Profile = Depends(get_owned_profile), db: Session = Depends(get_db)):
    return get_gap_alerts(db, profile.id)


@router.get("/coach", response_model=CoachCardOut)
def get_coach(profile: Profile = Depends(get_owned_profile), db: Session = Depends(get_db)):
    card = db.scalar(
        select(CoachCard)
        .where(CoachCard.profile_id == profile.id)
        .where(CoachCard.week == current_week())
    )
    if card is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No coach card generated this week yet")
    return card


@router.post("/coach/generate", response_model=CoachCardOut)
def generate_coach(
    force: bool = False,
    profile: Profile = Depends(get_owned_profile),
    db: Session = Depends(get_db),
):
    week = current_week()
    existing = db.scalar(
        select(CoachCard)
        .where(CoachCard.profile_id == profile.id)
        .where(CoachCard.week == week)
    )
    if existing and not force:
        return existing

    summary = compute_insights(db, profile.id)
    alerts = get_gap_alerts(db, profile.id)
    try:
        data = generate_coach_card(summary, alerts)
    except RuntimeError as err:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(err))

    if existing:
        existing.summary = data["summary"]
        existing.strength = data["strength"]
        existing.priority = data["priority"]
        existing.suggestions = data["suggestions"]
        existing.reasoning = data["reasoning"]
        card = existing
    else:
        card = CoachCard(profile_id=profile.id, week=week, **{
            k: data[k] for k in ("summary", "strength", "priority", "suggestions", "reasoning")
        })
        db.add(card)
    db.commit()
    db.refresh(card)
    return card
