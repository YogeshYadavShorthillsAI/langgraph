# main.py

from fastapi import FastAPI, Request
from pydantic import BaseModel
from langgraph_backend import process_message

app = FastAPI()
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
# Allow CORS from all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:8080"] if you're using http.server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class QueryInput(BaseModel):
    message: str
    thread_id: str  # Optional: multi-thread sessions

@app.post("/ask")
def ask_question(payload: QueryInput):
    try:
        reply = process_message(payload.message, thread_id=payload.thread_id)
        return {"response": reply}
    except Exception as e:
        return {"error": str(e)}
