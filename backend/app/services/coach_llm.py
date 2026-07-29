import json
import re

from langchain_core.messages import HumanMessage

from .llm import build_chat_llm


def _build_prompt(summary: dict, gap_alerts: list[dict]) -> str:
    gaps = ", ".join(a["board_name"] for a in gap_alerts) or "none"
    topics = ", ".join(summary["topic_counts"]) or "none"
    new_vocab = ", ".join(summary["new_vocab"][:8]) or "none"
    return f"""You are an AAC speech-language pathologist. Analyse this weekly communication summary and return coaching advice.

SUMMARY:
- Sentences this week: {summary['total_this_week']}
- Top topics: {topics}
- Vocabulary gaps: {gaps}
- New words this week: {new_vocab}
- Longest sentence: {summary['longest_sentence']} symbols

Reply with ONLY this JSON, no extra text, no markdown, no code fences:
{{"summary":"1-2 short sentences about their communication this week.","strength":"One specific strength (1 sentence).","priority":"The single most important next step (1 sentence).","suggestions":["word1","word2","word3","word4","word5"],"reasoning":"Why these 5 words (1 sentence)."}}"""


def generate_coach_card(summary: dict, gap_alerts: list[dict]) -> dict:
    llm = build_chat_llm()
    response = llm.invoke([HumanMessage(content=_build_prompt(summary, gap_alerts))])
    text = response.content if isinstance(response.content, str) else str(response.content)

    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise RuntimeError(f"Unexpected coach response: {text[:200]}")
    card = json.loads(match.group(0))
    for key in ("summary", "strength", "priority", "suggestions", "reasoning"):
        if key not in card:
            raise RuntimeError(f"Coach response missing '{key}'")
    return card
