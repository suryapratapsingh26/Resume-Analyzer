"""
Legacy entrypoint kept for convenience.

The real FastAPI app now lives at `backend/app/main.py`.
Run it with:
  uvicorn backend.app.main:app --reload
"""

from backend.app.main import app  # re-export for tooling


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
