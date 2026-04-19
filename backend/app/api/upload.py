from fastapi import APIRouter, File, UploadFile
from pypdf import PdfReader

from ..rag.chunking import split_text_to_chunks
from ..rag.embeddings import embed_texts
from ..rag.vector_store import store


router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_resume(file: UploadFile = File(...)):
    # Note: this keeps data in-memory for simplicity. For multi-user deployments,
    # store per-user/session (e.g., Redis, DB, or signed session id).
    try:
        reader = PdfReader(file.file)
        text = " ".join([(page.extract_text() or "") for page in reader.pages])
    except Exception as exc:
        return {"error": f"Upload failed: {exc}"}

    chunks = split_text_to_chunks(text)
    if not chunks:
        return {"error": "Could not extract meaningful text from PDF"}

    embeddings = embed_texts(chunks)
    store.replace(texts=chunks, embeddings=embeddings)
    return {"message": "Success", "chunks_indexed": len(chunks)}
