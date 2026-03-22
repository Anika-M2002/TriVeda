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

# @app.post("/api/receptionist/chat", response_model=ChatResponse)
# async def chat_endpoint(chat_data: ChatMessage):
#     """Endpoint for the Node.js backend to send user messages to the AI"""
#     try:
#         result = receptionist.process_message(
#             message=chat_data.message,
#             conversation_id=chat_data.conversation_id
#         )
#         return ChatResponse(**result)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/triage", response_model=TriageResponse)
async def triage_patient(request: TriageRequest):
    """
    Main triage endpoint
    """
    try:
        logger.info(f"\n{'='*60}")
        logger.info(f"NEW TRIAGE REQUEST")
        logger.info(f"Symptoms: {request.raw_symptoms[:100]}...")
        logger.info(f"Available departments: {[d['name'] for d in request.available_departments]}")
        logger.info(f"{'='*60}")
        
        
        extracted_info = extract_missing_info(request.raw_symptoms)
        logger.info(f"Extracted: {extracted_info}")
        
        
        final_symptoms = merge_symptoms(
            request.explicit_symptoms,
            extracted_info["extracted_symptoms"]
        )
        
        
        if request.explicit_severity:
            final_severity = normalize_severity(request.explicit_severity)
        else:
            final_severity = normalize_severity(extracted_info["extracted_severity"])
        
        
        if request.explicit_duration:
            final_duration = request.explicit_duration
        else:
            final_duration = extracted_info["extracted_duration"]
        
        
        dosha_indicator, recommended_department_id = determine_dosha_and_department(
            final_symptoms,
            request.available_departments
        )
        
        response = TriageResponse(
            final_symptoms=final_symptoms,
            final_severity=final_severity,
            final_duration=final_duration,
            dosha_indicator=dosha_indicator,
            recommended_department_id=recommended_department_id
        )
        
        logger.info(f"\nFINAL RESPONSE:")
        logger.info(f"  Department: {recommended_department_id}")
        logger.info(f"  Dosha: {dosha_indicator}")
        logger.info(f"{'='*60}\n")
        
        return response
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Triveda AI Backend"}

