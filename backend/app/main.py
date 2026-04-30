import logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.vision import router as vision_router

# ── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)

# ── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Vision Assistant API",
    description="Backend API that analyses camera frames using OpenAI Vision.",
    version="1.0.0",
)

# ── CORS — allow the Vite dev server to call us ──────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────
app.include_router(vision_router)


@app.get("/health", tags=["Health"])
def health_check():
    """Quick liveness probe."""
    return {"status": "ok"}


# ── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
