from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from .config import get_settings
from .database import get_db
from .models import BoardSession, Profile, User

settings = get_settings()
bearer_scheme = HTTPBearer(auto_error=False)

BOARD_SESSION_LIFETIME_DAYS = 90


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def create_access_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "scope": "caregiver",
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=settings.jwt_expiry_days),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_board_session_token(session_id: str, profile_id: str, expires_at: datetime) -> str:
    payload = {
        "sub": profile_id,
        "scope": "board",
        "sid": session_id,
        "iat": datetime.now(timezone.utc),
        "exp": expires_at,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def _decode(credentials: HTTPAuthorizationCredentials | None) -> dict:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    try:
        return jwt.decode(credentials.credentials, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    payload = _decode(credentials)
    # Tokens minted before the scope claim existed have no "scope" key — treat that as
    # caregiver so existing sessions keep working. A board-session token always sets
    # scope="board" explicitly, so this check must run before any DB lookup: Profile.id
    # and User.id are both uuid4().hex from the same generator, so a board token's `sub`
    # (a profile id) could otherwise coincidentally resolve as a User row.
    if payload.get("scope", "caregiver") != "caregiver":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Caregiver login required")

    user = db.get(User, payload.get("sub"))
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User no longer exists")
    return user


def _owned_profile_for_user(db: Session, profile_id: str, user: User) -> Profile:
    profile = db.get(Profile, profile_id)
    if profile is None or profile.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")
    return profile


def get_owned_profile(
    profile_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Profile:
    """Resolve a {profile_id} path param to a profile owned by the calling caregiver."""
    return _owned_profile_for_user(db, profile_id, user)


def get_board_profile(
    profile_id: str,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Profile:
    """Resolve a {profile_id} path param via a board-session token — the credential
    handed to the individual's device. Rejects caregiver tokens outright."""
    payload = _decode(credentials)
    if payload.get("scope") != "board":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Board session required")

    session = db.get(BoardSession, payload.get("sid"))
    now = datetime.now(timezone.utc)
    # SQLite drops tzinfo on round-trip even for DateTime(timezone=True) columns;
    # treat a naive value as UTC rather than failing the comparison outright.
    expires_at = session.expires_at if session else None
    if expires_at is not None and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if session is None or session.revoked_at is not None or expires_at < now:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session expired or revoked")
    # A token minted for one profile must never resolve against another profile's
    # routes — 404 rather than 403 so it doesn't confirm the other profile exists.
    if session.profile_id != profile_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

    profile = db.get(Profile, profile_id)
    if profile is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

    session.last_seen_at = now
    db.commit()
    return profile


def get_shared_profile(
    profile_id: str,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Profile:
    """For routes both a caregiver session and a board session may legitimately call
    (reading boards, triggering the layout optimiser on profile load, etc)."""
    payload = _decode(credentials)
    if payload.get("scope") == "board":
        return get_board_profile(profile_id, credentials, db)

    if payload.get("scope", "caregiver") != "caregiver":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not authorized")
    user = db.get(User, payload.get("sub"))
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User no longer exists")
    return _owned_profile_for_user(db, profile_id, user)
