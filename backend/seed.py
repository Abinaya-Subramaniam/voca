import random
from datetime import datetime, timedelta, timezone

from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.engines.gap_detector import evaluate_gaps
from app.models import CommunicationLog, GapSignal, Profile, TapLog, User
from app.routers.profiles import create_default_boards
from app.schemas import DEFAULT_SETTINGS, DEFAULT_WHO_I_AM
from sqlalchemy import select

DEMO_EMAIL = "demo@voca.app"
DEMO_PASSWORD = "voca-demo-123"

SENTENCES = [
    (["I", "want", "juice"], "home"),
    (["I", "want", "more"], "home"),
    (["go", "home"], "home"),
    (["I", "like", "play"], "home"),
    (["I", "feel", "happy"], "feelings"),
    (["I", "feel", "tired"], "feelings"),
    (["want", "eat"], "home"),
    (["I", "want", "go", "home"], "home"),
    (["no", "more"], "home"),
    (["help", "me"], "home"),
    (["I", "feel", "sad"], "feelings"),
    (["yes", "please"], "home"),
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(User).where(User.email == DEMO_EMAIL)):
            print("Demo account already seeded — nothing to do.")
            return

        user = User(email=DEMO_EMAIL, name="Demo Caregiver", password_hash=hash_password(DEMO_PASSWORD))
        db.add(user)
        db.flush()

        profile = Profile(
            user_id=user.id,
            name="Layla",
            avatar_color="#e07b54",
            settings=dict(DEFAULT_SETTINGS),
            who_i_am=dict(DEFAULT_WHO_I_AM),
        )
        db.add(profile)
        db.flush()
        create_default_boards(db, profile.id)
        db.flush()

        boards_by_category = {b.category: b for b in profile.boards}
        now = datetime.now(timezone.utc)
        rng = random.Random(42)

        def add_entry(symbols: list[str], category: str, when: datetime) -> None:
            board = boards_by_category[category]
            db.add(CommunicationLog(
                profile_id=profile.id,
                board_id=board.id,
                symbols=symbols,
                sentence=" ".join(symbols),
                timestamp=when,
            ))
            for label in symbols:
                db.add(TapLog(
                    profile_id=profile.id, board_id=board.id, label=label, timestamp=when,
                ))

        for day in range(14, 7, -1):
            when = now - timedelta(days=day)
            when = when.replace(hour=15 + rng.randrange(3), minute=rng.randrange(60))
            symbols, category = rng.choice(SENTENCES)
            add_entry(symbols, category, when)

        for day in range(7, -1, -1):
            sessions = 4 if day < 3 else 2
            for sess in range(sessions):
                when = now - timedelta(days=day)
                when = when.replace(hour=14 + sess, minute=rng.randrange(50))
                symbols, category = rng.choice(SENTENCES)
                add_entry(symbols, category, when)

        feelings = boards_by_category["feelings"]
        for i in range(4):
            when = (now - timedelta(days=i * 2)).replace(hour=16, minute=0)
            db.add(GapSignal(profile_id=profile.id, board_id=feelings.id, timestamp=when))
        db.flush()
        evaluate_gaps(db, profile.id)

        db.commit()
        print(f"Seeded demo account: {DEMO_EMAIL} / {DEMO_PASSWORD} (profile: Layla)")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
