import logging
import PIL.Image
import io
import base64
import google.generativeai as genai
from app.config import settings

logger = logging.getLogger(__name__)

# Configure Gemini if key is present
if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)

def analyze_image(image_base64: str, question: str) -> str:
    """
    Send a base64-encoded image + user question to Gemini Vision
    and return the model's text response.
    """
    # If no Gemini key, fallback or error (we assume user provided it)
    if not settings.gemini_api_key:
        logger.error("No Gemini API key provided")
        return "Error: Gemini API key is missing. Please add GEMINI_API_KEY to your .env file."

    try:
        # Decode base64 to image bytes
        image_bytes = base64.b64decode(image_base64)
        img = PIL.Image.open(io.BytesIO(image_bytes))

        logger.info("Sending image to Gemini Vision (%s) (question: %r)", settings.gemini_model, question[:80])

        model = genai.GenerativeModel(settings.gemini_model)
        
        # System instruction is handled slightly differently in Gemini 
        # For simplicity, we prepended to the prompt
        full_prompt = (
            "You are a helpful visual AI assistant. "
            "Answer the user's question accurately and concisely based on what you see in the image.\n\n"
            f"User Question: {question}"
        )

        response = model.generate_content([full_prompt, img])
        
        answer = response.text.strip()
        logger.info("Gemini response received (%d chars)", len(answer))
        return answer

    except Exception as e:
        logger.error("Gemini API Error: %s", str(e))
        return f"AI service error: {str(e)}"
