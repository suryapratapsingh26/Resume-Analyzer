from __future__ import annotations
import numpy as np
from chromadb.utils import embedding_functions

_ef = embedding_functions.DefaultEmbeddingFunction()

def embed_texts(texts: list[str]) -> np.ndarray:
    if not texts:
        return np.zeros((0, 384), dtype=np.float32)
    return np.asarray(_ef(texts))

def embed_query(query: str) -> np.ndarray:
    return np.asarray(_ef([query]))