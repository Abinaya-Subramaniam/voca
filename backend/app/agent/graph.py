from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition

from ..config import get_settings
from ..models import Profile
from .tools import STEP_LABELS, AgentContext, build_tools

settings = get_settings()

MAX_AGENT_TURNS = 8


def _system_prompt(name: str) -> str:
    return f"""You are the Voca Companion — an AI agent that supports the caregiver of {name}, a non-verbal individual who communicates by tapping pictogram symbols on the Voca AAC board.

You have no data in advance. You have tools that read {name}'s real communication records and one tool that can stage changes to their symbol boards.

Rules:
- Ground every answer in real data: call the relevant tools before answering questions about communication, vocabulary, moods, or progress. Never guess or invent numbers, words, or moods.
- Combine tools when the question needs it (e.g. gaps + board contents + coach recommendation to plan the week).
- If a tool returns no data (e.g. no coach card yet), do not stop there — consult the other tools (weekly insights, vocabulary gaps, recent sentences) and synthesize your own recommendation from what the data shows.
- When the caregiver asks to add vocabulary, or agrees with a suggestion to add words: first call get_board_contents for that board to avoid duplicates, then call propose_symbols_for_board with ALL the words. That tool verifies pictograms itself — do not call search_symbol for each word first; use search_symbol only for one-off checks.
- The caregiver's approval card appears ONLY when propose_symbols_for_board returns status "awaiting_caregiver_confirmation". Never say words are prepared, staged, or awaiting approval unless you called that tool and it returned that status in this turn. Never claim words were added.
- Journal sentences are private to {name}. You can only see journal moods.
- Be warm, specific and practical. Keep replies to 2-4 sentences unless the question genuinely needs more. Plain conversational text — no markdown headings or bullet lists."""


def _build_graph(ctx: AgentContext):
    tools = build_tools(ctx)
    llm = ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        temperature=0.4,
        google_api_key=settings.gemini_api_key,
    ).bind_tools(tools)

    def agent_node(state: MessagesState):
        return {"messages": [llm.invoke(state["messages"])]}

    graph = StateGraph(MessagesState)
    graph.add_node("agent", agent_node)
    graph.add_node("tools", ToolNode(tools))
    graph.add_edge(START, "agent")
    graph.add_conditional_edges("agent", tools_condition, {"tools": "tools", END: END})
    graph.add_edge("tools", "agent")
    return graph.compile()


def _extract_text(content) -> str:
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, str):
                parts.append(block)
            elif isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
        return "".join(parts).strip()
    return ""


def run_companion_agent(db, profile: Profile, messages: list[dict]) -> dict:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured on the server.")

    ctx = AgentContext(db=db, profile=profile)
    graph = _build_graph(ctx)

    lc_messages = [SystemMessage(content=_system_prompt(profile.name))]
    for m in messages:
        if m["role"] == "user":
            lc_messages.append(HumanMessage(content=m["text"]))
        else:
            lc_messages.append(AIMessage(content=m["text"]))

    result = graph.invoke(
        {"messages": lc_messages},
        config={"recursion_limit": 2 * MAX_AGENT_TURNS + 1},
    )

    steps = []
    final_text = ""
    for msg in result["messages"]:
        if isinstance(msg, AIMessage):
            for call in msg.tool_calls or []:
                steps.append({
                    "name": call["name"],
                    "label": STEP_LABELS.get(call["name"], call["name"]),
                    "args": call.get("args") or {},
                })
            text = _extract_text(msg.content)
            if text:
                final_text = text

    if not final_text:
        raise RuntimeError("The agent did not produce a final answer. Please try again.")

    return {"text": final_text, "steps": steps, "pending_action": ctx.pending_action}
