from fastapi import APIRouter, HTTPException
from app.schemas.review import ReviewRequest
from app.services.review_detector import review_detector

router = APIRouter(
    prefix="/api/reviews",
    tags=["Review Detection"]
)


@router.post("/analyze")
def analyze_review(request: ReviewRequest):
    try:
        result = review_detector.analyze(request.review_text)

        return {
            "success": True,
            "review_text": request.review_text,
            **result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Review analysis failed: {str(e)}"
        )