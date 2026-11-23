
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    user_id: str = Field(min_length=1)
    document_id: str = Field(min_length=1)
