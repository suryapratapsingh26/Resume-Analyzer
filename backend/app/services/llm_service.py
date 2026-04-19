from __future__ import annotations

import requests

from ..core.config import GROQ_API_KEY, GROQ_BASE_URL, GROQ_MODEL


def _require_key() -> str:
    if not GROQ_API_KEY:
        raise RuntimeError(
            "Missing GROQ_API_KEY. Add it to `backend/.env` (or your environment)."
        )
    return GROQ_API_KEY


def answer_with_context(question: str, context: str) -> str:
    key = _require_key()

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "user",
                "content": (
                    "Use the resume context to answer the user question.\n\n"
                    f"Resume Context:\n{context}\n\n"
                    f"User Question: {question}\n"
                    "Answer clearly and briefly."
                ),
            }
        ],
        "max_tokens": 500,
    }

    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    url = f"{GROQ_BASE_URL.rstrip('/')}/chat/completions"
    resp = requests.post(url, json=payload, headers=headers, timeout=60)
    data = resp.json()

    if resp.status_code != 200:
        return f"Groq API Error {resp.status_code}: {data}"

    try:
        return data["choices"][0]["message"]["content"]
    except Exception:
        return f"Unexpected response format: {data}"
