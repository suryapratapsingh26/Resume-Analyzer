def split_text_to_chunks(text: str) -> list[str]:
    # Simple, robust chunking for resumes: split on newlines, keep non-trivial lines,
    # then group into paragraph-ish chunks.
    lines = [ln.strip() for ln in (text or "").splitlines()]
    lines = [ln for ln in lines if len(ln) >= 20]
    if not lines:
        return []

    chunks: list[str] = []
    current: list[str] = []
    current_len = 0
    max_len = 900

    for ln in lines:
        if current_len + len(ln) + 1 > max_len and current:
            chunks.append("\n".join(current).strip())
            current = []
            current_len = 0
        current.append(ln)
        current_len += len(ln) + 1

    if current:
        chunks.append("\n".join(current).strip())

    return [c for c in chunks if c]

