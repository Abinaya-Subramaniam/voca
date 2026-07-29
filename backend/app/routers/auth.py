from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import (
    BOARD_SESSION_LIFETIME_DAYS,
    create_access_token,
    create_board_session_token,
    get_current_user,
    hash_password,
    verify_password,
)
from ..database import get_db
from ..models import BoardSession, Profile, User
from ..schemas import KidLoginRequest, KidLoginResponse, LoginRequest, ProfileOut, RegisterRequest, TokenResponse, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])

PIN_LOCKOUT_THRESHOLD = 5
PIN_LOCKOUT_MINUTES = 5


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == body.email.lower()))
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    user = User(email=body.email.lower(), name=body.name.strip(), password_hash=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=create_access_token(user.id), user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == body.email.lower()))
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    return TokenResponse(access_token=create_access_token(user.id), user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


def _naive_to_utc(dt: datetime | None) -> datetime | None:
    """SQLite drops tzinfo on round-trip even for DateTime(timezone=True) columns."""
    if dt is not None and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


@router.post("/kid-login", response_model=KidLoginResponse)
def kid_login(body: KidLoginRequest, request: Request, db: Session = Depends(get_db)):
    """The individual logs in directly with their own username/PIN — never the
    caregiver's login. Creates a fresh, revocable board session per device."""
    username = body.username.strip().lower()
    profile = db.scalar(select(Profile).where(Profile.username == username))

    now = datetime.now(timezone.utc)
    locked_until = _naive_to_utc(profile.locked_until) if profile else None
    if locked_until is not None and locked_until > now:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Too many attempts. Try again in a few minutes.")

    if profile is None or profile.pin_hash is None or not verify_password(body.pin, profile.pin_hash):
        if profile is not None:
            profile.failed_pin_attempts += 1
            if profile.failed_pin_attempts >= PIN_LOCKOUT_THRESHOLD:
                profile.locked_until = now + timedelta(minutes=PIN_LOCKOUT_MINUTES)
            db.commit()
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid username or PIN")

    profile.failed_pin_attempts = 0
    profile.locked_until = None

    expires_at = now + timedelta(days=BOARD_SESSION_LIFETIME_DAYS)
    device_label = request.headers.get("user-agent", "")[:100]
    session = BoardSession(
        profile_id=profile.id,
        created_by_user_id=profile.user_id,
        device_label=device_label,
        expires_at=expires_at,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    token = create_board_session_token(session.id, profile.id, expires_at)
    return KidLoginResponse(access_token=token, profile=ProfileOut.model_validate(profile))
