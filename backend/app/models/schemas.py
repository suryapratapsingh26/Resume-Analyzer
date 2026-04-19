from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    q: str = Field(..., description="User question")


class QueryResponse(BaseModel):
    answer: str

