import os
import sys
import importlib.util
from typing import Any, Dict, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from NLP707070 import (
    TriageRequest,
    TriageResponse,
    determine_department,
    determine_dosha,
    extract_missing_info,
    logger,
    merge_symptoms,
    normalize_severity,
)

app = FastAPI(title="Triveda AI Microservice", version="1.0.0")


class RagAskRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    top_k: int = Field(default=5, ge=1, le=10)


class RagAskResponse(BaseModel):
    answer: str
    confidence: float = 0.0
    total_sources: int = 0
    processing_time: float = 0.0
    herb_sources: list[Dict[str, Any]] = Field(default_factory=list)
    research_sources: list[Dict[str, Any]] = Field(default_factory=list)


_rag_bot = None
_rag_error: Optional[str] = None


def _get_rag_bot():
    global _rag_bot, _rag_error
    if _rag_bot is not None:
        return _rag_bot
    if _rag_error is not None:
        return None

    try:
        rag_dir = os.path.join(os.path.dirname(__file__), "RAG_MODEL")
        rag_file = os.path.join(rag_dir, "RAG_code.py")

        spec = importlib.util.spec_from_file_location("rag_code_module", rag_file)
        if spec is None or spec.loader is None:
            raise RuntimeError(f"Unable to load RAG module from {rag_file}")

        rag_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(rag_module)
        UnifiedAyurvedicRAGBot = rag_module.UnifiedAyurvedicRAGBot

        _rag_bot = UnifiedAyurvedicRAGBot(
            herbs_file=os.path.join(rag_dir, "herbs.json"),
            pubmed_file=os.path.join(rag_dir, "pubmed_data", "pubmed_for_rag.json"),
        )
        return _rag_bot
    except Exception as exc:
        _rag_error = str(exc)
        logger.error(f"RAG initialization failed: {_rag_error}")
        return None


@app.post("/api/triage", response_model=TriageResponse)
async def triage_patient(request: TriageRequest):
    try:
        logger.info(f"Processing triage request: {request.raw_symptoms[:120]}")

        extracted = extract_missing_info(request.raw_symptoms)
        final_symptoms = merge_symptoms(request.explicit_symptoms, extracted["extracted_symptoms"])
        symptoms_text = " ".join(final_symptoms).lower()

        final_severity = normalize_severity(request.explicit_severity or extracted["extracted_severity"])
        final_duration = request.explicit_duration or extracted["extracted_duration"]
        dosha = determine_dosha(symptoms_text)

        dept_id, dept_name, dept_desc = determine_department(symptoms_text)

        return TriageResponse(
            final_symptoms=final_symptoms,
            final_severity=final_severity,
            final_duration=final_duration,
            dosha_indicator=dosha,
            recommended_department_id=dept_id,
            recommended_department_name=dept_name,
            recommended_department_description=dept_desc,
        )
    except Exception as exc:
        logger.error(f"Triage error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/rag/ask", response_model=RagAskResponse)
async def rag_ask(request: RagAskRequest):
    query = request.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="query is required")

    bot = _get_rag_bot()
    if bot is None:
        raise HTTPException(
            status_code=503,
            detail=f"RAG model is unavailable. {_rag_error or 'Initialization failed.'}",
        )

    try:
        result = bot.query(query, top_k=request.top_k)
        return RagAskResponse(
            answer=str(result.get("answer") or "No response generated."),
            confidence=float(result.get("confidence") or 0.0),
            total_sources=int(result.get("total_sources") or 0),
            processing_time=float(result.get("processing_time") or 0.0),
            herb_sources=result.get("herb_sources") or [],
            research_sources=result.get("research_sources") or [],
        )
    except Exception as exc:
        logger.error(f"RAG query error: {exc}")
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(exc)}")


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Triveda AI Backend",
        "rag_initialized": _rag_bot is not None,
        "rag_error": _rag_error,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

