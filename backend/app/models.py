import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def new_id() -> str:
    return uuid.uuid4().hex


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100), default="")
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    profiles: Mapped[list["Profile"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(100))
    avatar_color: Mapped[str] = mapped_column(String(16), default="#2D9B83")
    settings: Mapped[dict] = mapped_column(JSON, default=dict)
    who_i_am: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped[User] = relationship(back_populates="profiles")
    boards: Mapped[list["Board"]] = relationship(back_populates="profile", cascade="all, delete-orphan")


class Board(Base):
    __tablename__ = "boards"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(100))
    category: Mapped[str] = mapped_column(String(50), default="custom")
    is_root: Mapped[bool] = mapped_column(Boolean, default=False)
    grid_columns: Mapped[int] = mapped_column(Integer, default=4)

    profile: Mapped[Profile] = relationship(back_populates="boards")
    symbols: Mapped[list["BoardSymbol"]] = relationship(
        back_populates="board",
        cascade="all, delete-orphan",
        order_by="BoardSymbol.position",
    )


class BoardSymbol(Base):
    __tablename__ = "board_symbols"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    board_id: Mapped[str] = mapped_column(ForeignKey("boards.id", ondelete="CASCADE"), index=True)
    position: Mapped[int] = mapped_column(Integer, default=0)
    symbol_id: Mapped[str] = mapped_column(String(64))
    label: Mapped[str] = mapped_column(String(100))
    word_type: Mapped[str] = mapped_column(String(20), default="none")
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)  # base64 for custom photos
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False)

    board: Mapped[Board] = relationship(back_populates="symbols")


class CommunicationLog(Base):
    __tablename__ = "communication_logs"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    board_id: Mapped[str | None] = mapped_column(String(32), nullable=True)
    symbols: Mapped[list] = mapped_column(JSON, default=list)  # list of labels
    sentence: Mapped[str] = mapped_column(Text)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class TapLog(Base):
    __tablename__ = "tap_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    board_id: Mapped[str | None] = mapped_column(String(32), nullable=True)
    label: Mapped[str] = mapped_column(String(100))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=new_id)
    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    mood_symbol: Mapped[dict | None] = mapped_column(JSON, nullable=True)  # { symbolId, label }
    sentences: Mapped[list] = mapped_column(JSON, default=list)  # [[{symbolId,label},...],...]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class GapSignal(Base):
    __tablename__ = "gap_signals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    board_id: Mapped[str] = mapped_column(String(32))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class GapAlert(Base):
    __tablename__ = "gap_alerts"
    __table_args__ = (UniqueConstraint("profile_id", "board_id", "week_of"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    board_id: Mapped[str] = mapped_column(String(32))
    signal_count: Mapped[int] = mapped_column(Integer, default=0)
    week_of: Mapped[str] = mapped_column(String(10))  # e.g. 2026-W29
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class CoachCard(Base):
    __tablename__ = "coach_cards"
    __table_args__ = (UniqueConstraint("profile_id", "week"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    week: Mapped[str] = mapped_column(String(10))
    summary: Mapped[str] = mapped_column(Text)
    strength: Mapped[str] = mapped_column(Text)
    priority: Mapped[str] = mapped_column(Text)
    suggestions: Mapped[list] = mapped_column(JSON, default=list)
    reasoning: Mapped[str] = mapped_column(Text)
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Bigram(Base):
    __tablename__ = "bigrams"
    __table_args__ = (UniqueConstraint("profile_id", "prev_label", "next_label"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[str] = mapped_column(ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    prev_label: Mapped[str] = mapped_column(String(100))
    next_label: Mapped[str] = mapped_column(String(100))
    count: Mapped[int] = mapped_column(Integer, default=0)
