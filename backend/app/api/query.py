from fastapi import APIRouter

from ..models.schemas import QueryRequest, QueryResponse
from ..rag.retrieval import retrieve_top_k
from ..services.llm_service import answer_with_context


router = APIRouter(prefix="/query", tags=["query"])


@router.post("", response_model=QueryResponse)
async def query_resume(payload: QueryRequest):
    if not payload.q.strip():
        return QueryResponse(answer="Please provide a non-empty question.")

    retrieved = retrieve_top_k(payload.q, k=3)
    if not retrieved:
        return QueryResponse(answer="Please upload a resume first.")

    context = "\n".join(retrieved)
    answer = answer_with_context(question=payload.q, context=context)
    return QueryResponse(answer=answer)
