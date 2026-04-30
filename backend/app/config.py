"""
Configuration — reads environment variables (or .env file) at startup.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    gemini_api_key: str = ""
    openai_model: str = "gpt-4o"          # supports vision (image + text)
    gemini_model: str = "gemini-1.5-flash" # supports vision
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
