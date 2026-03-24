import json
from typing import Dict, List, Any, Optional
from models import OllamaModel


class DynamicQuestionnaireOllama:
    
    def __init__(self):
        self.model = OllamaModel()
        
        self.system_context = """You are an expert Ayurvedic doctor conducting a patient interview. 
Your task is to ask ONE dynamic follow-up question at a time based on the patient's previous answers.

CONTEXT:
You're performing an Ayurvedic assessment covering:
- Prakriti (constitution)
- Vikriti (current imbalance)
- Agni (digestive fire)
- Ama (toxins)
- Location and nature of symptoms
- Duration and patterns
- Associated factors
- Diet and lifestyle
- Sleep and elimination
- Bowel habits

RULES:
1. Ask ONLY ONE question at a time
2. Questions must be context-aware (based on previous answers)
3. Cover different aspects systematically
4. When enough information is gathered (8-10 questions), mark assessment as complete
5. NEVER repeat a question
6. Questions should be specific and Ayurvedically relevant
7. Return ONLY valid JSON, no other text"""
    
    def get_next_question(self, conversation_history: List[Dict[str, str]]) -> Dict[str, Any]:
        context = "Previous conversation:\n"
        for msg in conversation_history:
            role = "Patient" if msg["role"] == "user" else "Doctor"
            context += f"{role}: {msg['content']}\n"
        
        collected = self._extract_collected_info(conversation_history)
        
        prompt = f"""{self.system_context}

{context}

Based on this conversation, generate the next logical question.

Current collected information:
{json.dumps(collected, indent=2)}

IMPORTANT INSTRUCTIONS:
- Return ONLY valid JSON
- Do NOT include any explanations or additional text
- Do NOT include markdown formatting
- Ensure all JSON keys are in double quotes
- Do NOT add trailing commas
- The response must start with {{ and end with }}

Valid JSON example:
{{
    "question": "How long have you had these symptoms?",
    "options": null,
    "assessment_complete": false,
    "collected_info": {{
        "main_symptom": "headache"
    }},
    "next_area": "duration",
    "reasoning": "Need to know duration to assess chronicity"
}}

Your JSON response:"""
        
        try:
            response = self.model.generate(prompt)
            if response:
                json_str = self._extract_json(response)
                if json_str:
                    try:
                        result = json.loads(json_str)
                        if "collected_info" not in result:
                            result["collected_info"] = {}
                        result["collected_info"].update(collected)
                        return result
                    except json.JSONDecodeError:
                        pass
            
            return self._fallback_question(collected)
        except Exception as e:
            print(f"Error: {e}")
            return self._fallback_question(collected)
    
    def _extract_collected_info(self, conversation_history: List[Dict[str, str]]) -> Dict[str, str]:
        collected = {}
        
        for i, msg in enumerate(conversation_history):
            if msg["role"] == "user" and i > 0:
                prev_msg = conversation_history[i-1]
                if prev_msg["role"] == "assistant":
                    question = prev_msg["content"].lower()
                    answer = msg["content"]
                    
                    if any(word in question for word in ["duration", "long", "when", "start"]):
                        collected["duration"] = answer
                    
                    elif any(word in question for word in ["symptom", "problem", "issue", "concern"]):
                        collected["main_symptom"] = answer
                    
                    elif "pain" in question or "ache" in question:
                        collected["pain_description"] = answer
        
        return collected
    
    def _extract_json(self, text: str) -> Optional[str]:
        try:
            start = text.find('{')
            end = text.rfind('}') + 1
            if start >= 0 and end > start:
                json_str = text[start:end]
                json_str = json_str.replace(',}', '}')
                json_str = json_str.replace(',]', ']')
                return json_str
        except:
            pass
        return None
    
    def _fallback_question(self, collected_info: Dict = None) -> Dict[str, Any]:
        if collected_info is None:
            collected_info = {}
        
        return {
            "question": "Can you tell me more about your symptoms and how long you've had them?",
            "options": None,
            "assessment_complete": False,
            "collected_info": collected_info,
            "next_area": "general",
            "reasoning": "Need more information"
        }