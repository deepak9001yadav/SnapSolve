import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.ai_service import analyze_image

router = APIRouter()
logger = logging.getLogger(__name__)


# ── Request / Response schemas ──────────────────────────────────────────────

class AskRequest(BaseModel):
    """Payload sent by the frontend."""
    image: str = Field(..., description="Base64-encoded JPEG (no data-URL prefix)")
    question: str = Field(..., min_length=1, description="User's question about the image")


class AskResponse(BaseModel):
    """Payload returned to the frontend."""
    answer: str


# ── Endpoint ────────────────────────────────────────────────────────────────

@router.post("/ask", response_model=AskResponse, summary="Ask AI about an image")
async def ask_about_image(body: AskRequest):
    """
    Accepts a base64-encoded camera frame and a natural-language question,
    forwards both to the OpenAI Vision model, and returns the AI's answer.
    """
    if not body.image:
        raise HTTPException(status_code=400, detail="No image data provided.")
    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    try:
        answer = analyze_image(body.image, body.question.strip())
        return AskResponse(answer=answer)

    except Exception as exc:
        logger.exception("Error while calling OpenAI: %s", exc)
        raise HTTPException(
            status_code=502,
            detail=f"AI service error: {str(exc)}",
        )
