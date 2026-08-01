from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base schema: snake_case in Python, camelCase over the wire."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class RegisterRequest(CamelModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(CamelModel):
    email: EmailStr
    password: str


class TokenResponse(CamelModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(CamelModel):
    id: str
    name: str
    email: str
    created_at: datetime



DEFAULT_SETTINGS = {
    "symbolSize": "medium",
    "fontSize": 12,
    "highContrast": False,
    "wideSpacing": False,
    "gridColumns": 4,
    "adaptiveLayoutEnabled": True,
}

DEFAULT_WHO_I_AM = {
    "age": "",
    "communicationNote": "",
    "loveSymbols": [],
    "helpTips": [
        "Give me time to find my words.",
        "Watch my screen, not just my face.",
        "Yes or no questions work well.",
    ],
    "emergencyName": "",
    "emergencyPhone": "",
}


class ProfileCreate(CamelModel):
    name: str = Field(min_length=1, max_length=100)
    avatar_color: str = "#2D9B83"
    username: str = Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")
    pin: str = Field(pattern=r"^\d{4}$")


class ProfileUpdate(CamelModel):
    name: str | None = None
    avatar_color: str | None = None
    settings: dict[str, Any] | None = None
    who_i_am: dict[str, Any] | None = None
    username: str | None = Field(default=None, min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")
    pin: str | None = Field(default=None, pattern=r"^\d{4}$")


class WhoIAmUpdate(CamelModel):
    who_i_am: dict[str, Any]


class ProfileOut(CamelModel):
    id: str
    name: str
    avatar_color: str
    settings: dict[str, Any]
    who_i_am: dict[str, Any]
    created_at: datetime
    username: str | None = None



class BoardSymbolIn(CamelModel):
    symbol_id: str
    label: str
    word_type: str = "none"
    image_url: str | None = None
    is_custom: bool = False


class BoardSymbolOut(BoardSymbolIn):
    position: int


class BoardCreate(CamelModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = "custom"


class BoardUpdate(CamelModel):
    name: str | None = None
    grid_columns: int | None = None


class BoardOut(CamelModel):
    id: str
    profile_id: str
    name: str
    category: str
    is_root: bool
    grid_columns: int
    symbols: list[BoardSymbolOut]


class ReorderRequest(CamelModel):
    symbols: list[BoardSymbolOut]



class SentenceLogCreate(CamelModel):
    board_id: str | None = None
    symbols: list[str]
    sentence: str


class SentenceLogOut(CamelModel):
    id: str
    profile_id: str
    board_id: str | None
    symbols: list[str]
    sentence: str
    timestamp: datetime


class TapLogCreate(CamelModel):
    board_id: str | None = None
    label: str
    previous_label: str | None = None  # also feeds the bigram prediction table



class JournalEntryCreate(CamelModel):
    mood_symbol: dict[str, Any] | None = None
    sentences: list[list[dict[str, Any]]] = []


class JournalEntryOut(CamelModel):
    id: str
    profile_id: str
    mood_symbol: dict[str, Any] | None
    sentences: list[list[dict[str, Any]]]
    created_at: datetime



class InsightsOut(CamelModel):
    total_this_week: int
    total_last_week: int
    topic_counts: dict[str, int]  # board name -> count
    new_vocab: list[str]
    peak_time: str
    longest_sentence: int


class GapSignalCreate(CamelModel):
    board_id: str


class GapAlertOut(CamelModel):
    board_id: str
    board_name: str
    signal_count: int
    week_of: str
    existing_symbol_count: int
    suggested_additions: list[str]


class CoachCardOut(CamelModel):
    summary: str
    strength: str
    priority: str
    suggestions: list[str]
    reasoning: str
    generated_at: datetime


class PredictionsOut(CamelModel):
    predictions: list[str]


class BoardSessionOut(CamelModel):
    id: str
    device_label: str
    created_at: datetime
    last_seen_at: datetime | None
    expires_at: datetime
    revoked_at: datetime | None


class KidLoginRequest(CamelModel):
    username: str
    pin: str = Field(pattern=r"^\d{4}$")


class KidLoginResponse(CamelModel):
    access_token: str
    profile: ProfileOut


class JournalMoodOut(CamelModel):
    id: str
    created_at: datetime
    mood_symbol: dict[str, Any] | None



class AgentMessage(CamelModel):
    role: str  # 'user' | 'companion'
    text: str


class AgentChatRequest(CamelModel):
    messages: list[AgentMessage]


class AgentStep(CamelModel):
    name: str
    label: str
    args: dict[str, Any] = {}


class StagedSymbol(CamelModel):
    word: str
    word_type: str = "none"
    symbol_id: str
    image_url: str | None = None


class PendingAction(CamelModel):
    board_id: str
    board_name: str
    reason: str = ""
    symbols: list[StagedSymbol]


class AgentChatResponse(CamelModel):
    id: str
    text: str
    steps: list[AgentStep]
    pending_action: PendingAction | None = None


class ChatMessageOut(CamelModel):
    id: str
    role: str
    text: str
    steps: list[AgentStep]
    pending_action: PendingAction | None = None
    action_status: str | None = None
    action_added_count: int | None = None
    created_at: datetime


class ApplyActionResponse(CamelModel):
    added: int
    board_id: str
