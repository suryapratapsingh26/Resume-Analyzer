import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))

def get_env(name: str, default: str | None = None) -> str | None:
    value = os.getenv(name)
    if value is None or value == "":
        return default
    return value

GROQ_API_KEY = get_env("GROQ_API_KEY")
GROQ_BASE_URL = get_env("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
GROQ_MODEL = get_env("GROQ_MODEL", "llama-3.1-8b-instant")
