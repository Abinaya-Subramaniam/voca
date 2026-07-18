import httpx

SEARCH_API = "https://api.arasaac.org/v1/pictograms/en/search"

# IDs verified against the ARASAAC API, preferring aac:true entries
VERIFIED_IDS = {
    "i": "6632", "you": "6625", "want": "5441", "like": "37826", "go": "8142",
    "come": "32669", "eat": "6456", "drink": "6061", "play": "23392", "sleep": "6479",
    "home": "6964", "more": "5508", "help": "32648", "stop": "7196", "yes": "5584",
    "no": "5526",
    "happy": "35533", "sad": "35545", "angry": "35539", "scared": "35535",
    "tired": "35537", "hungry": "4962", "hurt": "30620", "hurts": "30620", "good": "4581",
    "water": "32464", "milk": "2445", "juice": "11461", "bread": "2494",
    "apple": "2462", "banana": "2530", "rice": "6911", "cookie": "8312",
    "school": "32446", "teacher": "6556", "friend": "25790", "book": "25191",
    "write": "2380", "read": "7141", "draw": "8088", "learn": "37810",
    "toilet": "5921",
    "mom": "2458", "dad": "31146", "brother": "2423", "sister": "2422",
    "grandma": "23710", "grandpa": "23718", "baby": "6060", "me": "6632",
    "run": "6465", "jump": "39052", "swim": "6568", "walk": "29951",
    "sing": "6960", "dance": "35747", "watch": "29123", "hug": "4550",
    "please": "8195", "thank you": "8129", "hello": "6522", "goodbye": "6028",
    "sorry": "11625", "wait": "36914", "again": "37163", "finished": "28429",
}

_cache: dict[str, str | None] = {}


def symbol_image_url(symbol_id: str | None) -> str | None:
    if not symbol_id or symbol_id.startswith("custom_"):
        return None
    return f"https://static.arasaac.org/pictograms/{symbol_id}/{symbol_id}_300.png"


def resolve_symbol_id(label: str) -> str | None:
    key = label.lower().strip()
    if key in VERIFIED_IDS:
        return VERIFIED_IDS[key]
    if key in _cache:
        return _cache[key]

    try:
        resp = httpx.get(f"{SEARCH_API}/{key}", timeout=8.0)
        if resp.status_code != 200:
            _cache[key] = None
            return None
        data = resp.json()
        if not data:
            _cache[key] = None
            return None
        best = next((d for d in data if d.get("aac")), data[0])
        result = str(best["_id"])
        _cache[key] = result
        return result
    except (httpx.HTTPError, KeyError, ValueError):
        return None
