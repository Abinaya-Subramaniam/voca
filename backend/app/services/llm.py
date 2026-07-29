from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

from ..config import get_settings

settings = get_settings()


def build_chat_llm(temperature: float = 0.4, tools=None):
    """OpenAI is primary; Gemini is used as an automatic fallback if OpenAI errors
    (rate limit, outage, etc). Requires at least OPENAI_API_KEY to be set."""
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured on the server.")

    primary = ChatOpenAI(
        model=settings.openai_model,
        temperature=temperature,
        api_key=settings.openai_api_key,
    )
    if tools:
        primary = primary.bind_tools(tools)

    if not settings.gemini_api_key:
        return primary

    fallback = ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        temperature=temperature,
        google_api_key=settings.gemini_api_key,
    )
    if tools:
        fallback = fallback.bind_tools(tools)

    return primary.with_fallbacks([fallback])
