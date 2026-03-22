from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import json
import requests
import logging
import time
import re

app = FastAPI(title="Ayurvedic Triage Microservice", version="1.0.0")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2"

AVAILABLE_DEPARTMENTS = [
    {"id": "d1", "name": "Gastroenterology", "description": "Deals with digestive disorders, stomach problems, IBS, heartburn, acidity, and gastrointestinal conditions."},
    {"id": "d2", "name": "Neurology", "description": "Deals with headaches, migraines, nerve pain, neuropathy, neurological disorders, and nervous system conditions."},
    {"id": "d3", "name": "Orthopedics", "description": "Deals with bone, joint, muscular issues, back pain, arthritis, fractures, and musculoskeletal conditions."},
    {"id": "d4", "name": "Cardiology", "description": "Deals with heart conditions, palpitations, chest pain, hypertension, and circulatory disorders."},
    {"id": "d5", "name": "Pulmonology", "description": "Deals with respiratory issues, cough, asthma, breathing difficulties, chest congestion, and lung conditions."},
    {"id": "d6", "name": "Dermatology", "description": "Deals with skin conditions, rashes, itching, eczema, psoriasis, acne, and allergic skin reactions."},
    {"id": "d7", "name": "Psychiatry", "description": "Deals with mental health, anxiety, depression, insomnia, stress, and emotional disorders."},
    {"id": "d8", "name": "ENT", "description": "Deals with ear, nose, throat issues, sinus problems, hearing loss, and upper respiratory conditions."},
    {"id": "d9", "name": "Rheumatology", "description": "Deals with arthritis, autoimmune conditions, joint inflammation, and connective tissue disorders."},
    {"id": "d10", "name": "Endocrinology", "description": "Deals with hormonal imbalances, diabetes, thyroid disorders, and metabolic issues."},
    {"id": "d11", "name": "Urology", "description": "Deals with urinary tract issues, kidney stones, bladder problems, and male reproductive system."},
    {"id": "d12", "name": "General Medicine", "description": "Deals with general health issues, fevers, infections, and other conditions."}
]

class TriageRequest(BaseModel):
    raw_symptoms: str
    explicit_symptoms: List[str] = Field(default_factory=list)
    explicit_severity: Optional[str] = None
    explicit_duration: Optional[str] = None

class TriageResponse(BaseModel):
    final_symptoms: List[str]
    final_severity: str
    final_duration: str
    dosha_indicator: str
    recommended_department_id: str
    recommended_department_name: str
    recommended_department_description: str

def call_ollama(prompt: str, system_prompt: str = None) -> str:
    try:
        full_prompt = f"System: {system_prompt}\n\nUser: {prompt}" if system_prompt else prompt
        payload = {
            "model": MODEL_NAME,
            "prompt": full_prompt,
            "stream": False,
            "options": {"temperature": 0.1, "num_predict": 300}
        }
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        response.raise_for_status()
        return response.json().get("response", "")
    except Exception as e:
        logger.error(f"Ollama error: {e}")
        return ""

def extract_missing_info(raw_symptoms: str) -> Dict[str, Any]:
    system_prompt = "Extract medical information. Return ONLY JSON."
    user_prompt = f"""Patient: "{raw_symptoms}"
Return: {{"symptoms": ["symptom1", "symptom2"], "severity": "Mild/Moderate/High", "duration": "X days/weeks"}}"""
    
    try:
        response = call_ollama(user_prompt, system_prompt)
        if response:
            response = re.sub(r'```json|```', '', response).strip()
            extracted = json.loads(response)
            return {
                "extracted_symptoms": extracted.get("symptoms", []),
                "extracted_severity": extracted.get("severity", "Moderate"),
                "extracted_duration": extracted.get("duration", "Not specified")
            }
    except:
        pass
    
    
    text = raw_symptoms.lower()
    symptoms = []
    
    if "ear pain" in text or "ear ache" in text:
        symptoms.append("Ear pain")
    if "burning" in text and "urinating" in text:
        symptoms.append("Burning urination")
    if "frequent urge" in text:
        symptoms.append("Frequent urination")
    if "heart" in text and "palpitations" in text:
        symptoms.append("Heart palpitations")
    if "chest discomfort" in text:
        symptoms.append("Chest discomfort")
    if "headache" in text:
        symptoms.append("Headache")
    if "nausea" in text:
        symptoms.append("Nausea")
    
    severity = "High" if any(w in text for w in ["severe", "sharp", "intense"]) else "Moderate"
    duration_match = re.search(r'(\d+)\s*(days?|weeks?|months?)', text)
    duration = f"{duration_match.group(1)} {duration_match.group(2)}" if duration_match else "Not specified"
    
    return {
        "extracted_symptoms": symptoms if symptoms else ["General symptoms"],
        "extracted_severity": severity,
        "extracted_duration": duration
    }

def determine_department(symptoms_text: str) -> tuple:
    """Direct symptom-to-department mapping"""
    text = symptoms_text.lower()
    
    
    rules = [
        
        (["ear pain", "ear ache", "ear infection", "fullness in ear"], "d8", "ENT", "Deals with ear, nose, throat issues."),
        
        
        (["burning urination", "burning while urinating", "frequent urge", "urinary"], "d11", "Urology", "Deals with urinary tract issues."),
        
        
        (["heart palpitations", "palpitations", "irregular heartbeat", "chest discomfort", "chest pain"], "d4", "Cardiology", "Deals with heart conditions."),
        
        
        (["headache", "migraine", "throbbing headache", "nerve pain"], "d2", "Neurology", "Deals with headaches and neurological conditions."),
        
        
        (["rash", "skin rash", "itching", "burning skin"], "d6", "Dermatology", "Deals with skin conditions."),
        
        
        (["knee pain", "joint pain", "swollen knee", "stiffness", "crack when walking"], "d3", "Orthopedics", "Deals with bone, joint, and muscular issues."),
        
        
        (["anxiety", "worry", "racing thoughts", "difficulty sleeping", "insomnia"], "d7", "Psychiatry", "Deals with mental health."),
        
        
        (["thirst", "frequent urination", "fatigue", "blurry vision", "diabetes"], "d10", "Endocrinology", "Deals with hormonal and metabolic issues."),
        
        
        (["cough", "mucus", "chest congestion", "difficulty breathing"], "d5", "Pulmonology", "Deals with respiratory issues."),
        
        
        (["stomach", "burning sensation", "acid reflux", "nausea"], "d1", "Gastroenterology", "Deals with digestive disorders."),
        
        
        (["morning stiffness", "multiple joints", "autoimmune"], "d9", "Rheumatology", "Deals with arthritis and autoimmune conditions."),
    ]
    
    
    for keywords, dept_id, dept_name, dept_desc in rules:
        for keyword in keywords:
            if keyword in text:
                return dept_id, dept_name, dept_desc
    
    
    return "d12", "General Medicine", "Deals with general health issues."

def determine_dosha(symptoms_text: str) -> str:
    text = symptoms_text.lower()
    
    if any(w in text for w in ["burning", "rash", "acid", "inflammation", "red", "hot", "throbbing"]):
        return "Pitta"
    elif any(w in text for w in ["pain", "sharp", "anxiety", "nervous", "dry", "irregular", "palpitations"]):
        return "Vata"
    elif any(w in text for w in ["mucus", "congestion", "heavy", "swelling", "stiff"]):
        return "Kapha"
    else:
        return "Vata"

def merge_symptoms(explicit: List[str], extracted: List[str]) -> List[str]:
    all_symptoms = explicit.copy()
    for s in extracted:
        if s.lower() not in [x.lower() for x in all_symptoms]:
            all_symptoms.append(s)
    return all_symptoms if all_symptoms else ["General symptoms"]

def normalize_severity(sev: str) -> str:
    if not sev:
        return "Moderate"
    sev_lower = sev.lower()
    if sev_lower in ["high", "severe", "critical"]:
        return "High"
    elif sev_lower in ["mild", "low"]:
        return "Mild"
    else:
        return "Moderate"

@app.post("/api/triage", response_model=TriageResponse)
async def triage_patient(request: TriageRequest):
    try:
        logger.info(f"Processing: {request.raw_symptoms}")
        
        
        extracted = extract_missing_info(request.raw_symptoms)
        
        
        final_symptoms = merge_symptoms(request.explicit_symptoms, extracted["extracted_symptoms"])
        symptoms_text = " ".join(final_symptoms).lower()
        
        
        final_severity = normalize_severity(request.explicit_severity or extracted["extracted_severity"])
        final_duration = request.explicit_duration or extracted["extracted_duration"]
        dosha = determine_dosha(symptoms_text)
        
        
        dept_id, dept_name, dept_desc = determine_department(symptoms_text)
        
        logger.info(f"Department selected: {dept_name} ({dept_id})")
        
        return TriageResponse(
            final_symptoms=final_symptoms,
            final_severity=final_severity,
            final_duration=final_duration,
            dosha_indicator=dosha,
            recommended_department_id=dept_id,
            recommended_department_name=dept_name,
            recommended_department_description=dept_desc
        )
        
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)