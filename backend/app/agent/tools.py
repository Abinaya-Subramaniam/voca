from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone

from langchain_core.tools import tool
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..engines.gap_detector import get_gap_alerts
from ..engines.gap_detector import current_week
from ..engines.insights import compute_insights
from ..models import Board, CoachCard, CommunicationLog, Profile
from ..services.arasaac import resolve_symbol_id, symbol_image_url
from ..services.journal import get_recent_moods

WORD_TYPES = {"pronoun", "verb", "noun", "descriptor", "social", "question", "none"}

STEP_LABELS = {
    "get_weekly_insights": "Analysing this week's communication",
    "get_communication_log": "Reading recent sentences",
    "get_vocabulary_gaps": "Checking vocabulary gap alerts",
    "get_board_contents": "Inspecting board contents",
    "get_journal_moods": "Checking recent moods",
    "get_coach_recommendation": "Reviewing coach recommendation",
    "search_symbol": "Searching ARASAAC pictograms",
    "propose_symbols_for_board": "Preparing board update",
}


@dataclass
class AgentContext:
    db: Session
    profile: Profile
    pending_action: dict | None = field(default=None)


def _fmt(ts: datetime) -> str:
    ts = ts if ts.tzinfo else ts.replace(tzinfo=timezone.utc)
    return ts.strftime("%a %d %b, %H:%M")


def build_tools(ctx: AgentContext) -> list:
    db, profile = ctx.db, ctx.profile

    @tool
    def get_weekly_insights() -> dict:
        """Get this week's communication metrics: sentence counts this week vs last
        week, longest sentence, peak communication time, new vocabulary, and most
        active boards."""
        return compute_insights(db, profile.id)

    @tool
    def get_communication_log(days: int = 7, limit: int = 15) -> dict:
        """Read the actual sentences the individual built recently, newest first.
        Use this to see what they are really saying, not just counts."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=days)
        entries = db.scalars(
            select(CommunicationLog)
            .where(CommunicationLog.profile_id == profile.id)
            .where(CommunicationLog.timestamp > cutoff)
            .order_by(CommunicationLog.timestamp.desc())
            .limit(limit)
        ).all()
        return {
            "count": len(entries),
            "sentences": [{"sentence": e.sentence, "when": _fmt(e.timestamp)} for e in entries],
        }

    @tool
    def get_vocabulary_gaps() -> dict:
        """Get active vocabulary gap alerts — boards the individual browsed repeatedly
        without tapping, suggesting a word they looked for is missing. Includes
        suggested expansion words per board."""
        alerts = get_gap_alerts(db, profile.id)
        if not alerts:
            return {"gaps": [], "note": "No active gap alerts this week."}
        return {
            "gaps": [
                {
                    "board": a["board_name"],
                    "browse_without_tap_signals": a["signal_count"],
                    "current_symbol_count": a["existing_symbol_count"],
                    "suggested_additions": a["suggested_additions"],
                }
                for a in alerts
            ]
        }

    @tool
    def get_board_contents(board_name: str = "") -> dict:
        """List the symbol boards. Without board_name, returns every board with its
        symbol count. With board_name, returns all symbols on that board — call this
        before proposing additions so you never suggest duplicates."""
        boards = db.scalars(select(Board).where(Board.profile_id == profile.id)).all()
        if board_name:
            board = next((b for b in boards if b.name.lower() == board_name.lower()), None)
            if board is None:
                return {"error": f"No board named '{board_name}'. Available: {', '.join(b.name for b in boards)}"}
            return {
                "name": board.name,
                "category": board.category,
                "symbols": [s.label for s in board.symbols],
            }
        return {
            "boards": [
                {"name": b.name, "category": b.category, "symbol_count": len(b.symbols)}
                for b in boards
            ]
        }

    @tool
    def get_journal_moods(limit: int = 5) -> dict:
        """Get the individual's recent journal moods (date + mood only). Journal
        sentences are private and never shared with caregivers."""
        entries = get_recent_moods(db, profile.id, limit)
        return {
            "moods": [
                {
                    "date": _fmt(e.created_at),
                    "mood": (e.mood_symbol or {}).get("label", "not recorded"),
                }
                for e in entries
            ],
            "note": "Journal sentences are private to the individual and not available.",
        }

    @tool
    def get_coach_recommendation() -> dict:
        """Get this week's AI vocabulary coach card: summary, strength, priority,
        suggested words and reasoning. May not exist yet."""
        card = db.scalar(
            select(CoachCard)
            .where(CoachCard.profile_id == profile.id)
            .where(CoachCard.week == current_week())
        )
        if card is None:
            return {"status": "No coach card generated yet this week."}
        return {
            "summary": card.summary,
            "strength": card.strength,
            "priority": card.priority,
            "suggested_words": card.suggestions,
            "reasoning": card.reasoning,
        }

    @tool
    def search_symbol(word: str) -> dict:
        """Check whether an ARASAAC pictogram exists for a word. Use before proposing
        a word so every addition has a real symbol image."""
        symbol_id = resolve_symbol_id(word)
        return {"word": word, "pictogram_found": bool(symbol_id), "symbol_id": symbol_id}

    @tool
    def propose_symbols_for_board(board_name: str, words: list[dict], reason: str = "") -> dict:
        """Stage new vocabulary symbols for a board. Does NOT change the board — it
        prepares the change and shows the caregiver an approval card. Each item in
        `words` is {"word": str, "word_type": one of pronoun|verb|noun|descriptor|
        social|question|none}. Check the board's contents first to avoid duplicates."""
        boards = db.scalars(select(Board).where(Board.profile_id == profile.id)).all()
        board = next((b for b in boards if b.name.lower() == board_name.lower()), None)
        if board is None:
            return {"error": f"No board named '{board_name}'. Available: {', '.join(b.name for b in boards)}"}

        existing = {s.label.lower() for s in board.symbols}
        requested = [w for w in words if isinstance(w, dict) and w.get("word")]
        already = [w["word"] for w in requested if w["word"].lower() in existing]
        candidates = [w for w in requested if w["word"].lower() not in existing]

        staged, unresolved = [], []
        for w in candidates:
            symbol_id = resolve_symbol_id(w["word"])
            if symbol_id:
                word_type = w.get("word_type") if w.get("word_type") in WORD_TYPES else "none"
                staged.append({
                    "word": w["word"],
                    "word_type": word_type,
                    "symbol_id": symbol_id,
                    "image_url": symbol_image_url(symbol_id),
                })
            else:
                unresolved.append(w["word"])

        if not staged:
            return {"status": "nothing_to_add", "already_present": already, "no_pictogram_found": unresolved}

        ctx.pending_action = {
            "board_id": board.id,
            "board_name": board.name,
            "reason": reason,
            "symbols": staged,
        }
        return {
            "status": "awaiting_caregiver_confirmation",
            "board": board.name,
            "staged_words": [s["word"] for s in staged],
            "already_present": already,
            "no_pictogram_found": unresolved,
            "note": (
                "An approval card is now shown to the caregiver. Briefly tell them "
                "what you prepared and that they can approve it below your message."
            ),
        }

    return [
        get_weekly_insights,
        get_communication_log,
        get_vocabulary_gaps,
        get_board_contents,
        get_journal_moods,
        get_coach_recommendation,
        search_symbol,
        propose_symbols_for_board,
    ]
