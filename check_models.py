import os
import requests
from dotenv import load_dotenv

# Load the .env file from the backend directory
dotenv_path = os.path.join(os.path.dirname(__file__), "backend", ".env")
load_dotenv(dotenv_path=dotenv_path)

api_key = os.getenv("GROQ_API_KEY", "")
if not api_key:
    raise SystemExit("Missing GROQ_API_KEY. Set it in your environment or backend/.env")

headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

response = requests.get("https://api.groq.com/openai/v1/models", headers=headers, timeout=30)
print(response.json())
