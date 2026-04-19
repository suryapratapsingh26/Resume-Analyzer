from __future__ import annotations

import numpy as np


class InMemoryVectorStore:
    def __init__(self) -> None:
        self.texts: list[str] = []
        self.embeddings: np.ndarray | None = None

    def replace(self, texts: list[str], embeddings: np.ndarray) -> None:
        self.texts = list(texts)
        self.embeddings = embeddings

    def is_empty(self) -> bool:
        return not self.texts or self.embeddings is None


store = InMemoryVectorStore()

