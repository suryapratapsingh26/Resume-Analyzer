# Resume Analyzer

FastAPI backend that indexes a PDF resume (chunk + local embeddings) and answers questions using Groq chat completions.

## Backend

1. Create a Groq API key and put it in `backend/.env`:
   - `GROQ_API_KEY=...`
2. Install deps:
   - `pip install -r backend/requirements.txt`
3. Run:
   - From repo root: `uvicorn backend.app.main:app --reload`
   - Or from `backend/`: `uvicorn app.main:app --reload`

Backend endpoints:
- `POST /upload` (multipart file `file`)
- `POST /query` (JSON `{ "q": "..." }`)

## Frontend

1. `cd frontend`
2. `npm install`
3. `npm start`
