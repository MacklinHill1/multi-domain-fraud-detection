from pydantic import BaseModel, Field


class ReviewRequest(BaseModel):
    review_text: str = Field(
        min_length=10,
        max_length=10000,
        description="The review text to analyze"
    )
