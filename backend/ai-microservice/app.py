import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

# IMPORTANT: These imports only work if services/__init__.py exists!
from services.config import GeminiConfig
from services.receptionist import AIReceptionistGemini

# Setup
# Remember to export GEMINI_API_KEY="your_key" in your terminal first!
client = GeminiConfig.setup()
receptionist = AIReceptionistGemini(client)

app = FastAPI(title="Triveda AI Microservice")

# Pydantic Schemas for validation
class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    function_call: Optional[Dict[str, Any]] = None
    available_slots: Optional[List[str]] = None
    conversation_id: str
    error: Optional[str] = None

@app.post("/api/receptionist/chat", response_model=ChatResponse)
async def chat_endpoint(chat_data: ChatMessage):
    """Endpoint for the Node.js backend to send user messages to the AI"""
    try:
        result = receptionist.process_message(
            message=chat_data.message,
            conversation_id=chat_data.conversation_id
        )
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Triveda AI Backend"}