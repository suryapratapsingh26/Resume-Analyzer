from __future__ import annotations

from sklearn.metrics.pairwise import cosine_similarity

from .embeddings import embed_query
from .vector_store import store


def retrieve_top_k(query: str, k: int = 3) -> list[str]:
    if store.is_empty():
        return []

    q_vec = embed_query(query)
    scores = cosine_similarity(q_vec, store.embeddings)[0]

    k = max(1, int(k))
    top_ids = scores.argsort()[-k:][::-1]
    return [store.texts[i] for i in top_ids]
