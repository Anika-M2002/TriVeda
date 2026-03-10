from google import genai
from google.genai import types
import json
import datetime
import re
import random
from typing import Dict, List, Any, Optional
from enum import Enum

class TimePreference(str, Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    EVENING = "evening"

class AIReceptionistGemini:
    def __init__(self, client):
        self.client = client
        
        # Sumeet's Model Cycler - The ultimate free-tier survival tool
        self.models = [
            'gemini-2.0-flash',
            'gemini-flash-latest',
            'gemini-2.0-flash-lite',
            'gemini-2.5-flash',
        ]
        self.current_model_index = 0
        
        self.search_doctor_declaration = types.FunctionDeclaration(
            name="search_doctor_availability",
            description="Search for available doctor appointments based on specialty, date, and time preference",
            parameters={
                "type": "object",
                "properties": {
                    "specialty": {
                        "type": "string",
                        "description": "The medical specialty or doctor type needed"
                    },
                    "date": {
                        "type": "string",
                        "description": "The requested appointment date in YYYY-MM-DD format"
                    },
                    "time_preference": {
                        "type": "string",
                        "enum": ["morning", "afternoon", "evening"],
                        "description": "Preferred time of day for the appointment"
                    }
                },
                "required": ["specialty", "date", "time_preference"]
            }
        )
        
        self.tool = types.Tool(
            function_declarations=[self.search_doctor_declaration]
        )
        
        self.system_instruction = """You are an AI Receptionist for an Ayurvedic clinic. Your role is to help patients book appointments with the right specialists.

RULES:
1. When a patient wants to book an appointment, use the search_doctor_availability function
2. Extract specialty, date, and time preference from their request
3. Be friendly and professional
4. After receiving available slots, present them clearly to the patient
5. Ask which slot they prefer
6. Keep responses concise and helpful
7. When the patient says thank you, thanks, or expresses gratitude, respond warmly and offer further assistance
8. When the patient says goodbye, bye, or exit, end the conversation gracefully"""
        
        self.conversations: Dict[str, List[Dict[str, str]]] = {}
        
        self.farewell_phrases = [
            "thank you", "thanks", "thank you so much", "thanks a lot",
            "goodbye", "bye", "see you", "take care", "have a great day",
            "that's all", "that is all", "i'm done", "i am done", "all done"
        ]
    
    def get_current_model(self) -> str:
        return self.models[self.current_model_index]
    
    def switch_to_next_model(self) -> bool:
        if self.current_model_index < len(self.models) - 1:
            self.current_model_index += 1
            print(f"--> [API LIMIT HIT] Switching to backup model: {self.models[self.current_model_index]}")
            return True
        return False
    
    def extract_text_from_response(self, response) -> str:
        try:
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                    text_parts = []
                    for part in candidate.content.parts:
                        if hasattr(part, 'text') and part.text:
                            text_parts.append(part.text)
                    if text_parts:
                        return " ".join(text_parts)
            if hasattr(response, 'text'):
                return response.text
        except Exception as e:
            print(f"Error extracting text: {e}")
        
        return "I understand. How can I help you?"
    
    def search_doctor_availability(self, specialty: str, date: str, time_preference: str) -> List[str]:
        # Sumeet's dummy data for MVP testing
        available_slots = {
            ("Panchakarma specialist", "morning"): ["09:00 AM", "10:30 AM"],
            ("Panchakarma specialist", "afternoon"): ["02:00 PM", "03:30 PM"],
            ("Panchakarma specialist", "evening"): ["05:00 PM", "06:30 PM"],
            ("Cardiologist", "morning"): ["08:30 AM", "11:00 AM"],
            ("Dentist", "morning"): ["09:00 AM", "11:30 AM"],
            ("Kayachikitsa", "morning"): ["10:00 AM", "12:00 PM"],
        }
        
        key = (specialty, time_preference)
        if key in available_slots:
            return available_slots[key]
        else:
            if time_preference == "morning":
                return ["09:00 AM", "10:30 AM", "11:30 AM"]
            elif time_preference == "afternoon":
                return ["02:00 PM", "03:30 PM", "04:30 PM"]
            else:
                return ["05:00 PM", "06:30 PM", "07:30 PM"]
    
    def format_time_input(self, time_str: str) -> str:
        time_str = time_str.lower().strip().replace(' ', '')
        patterns = [
            (r'^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$', lambda m: self._format_time_match(m)),
            (r'^(\d{1,2})[.:](\d{2})\s*(am|pm)?$', lambda m: self._format_time_match(m)),
        ]
        for pattern, formatter in patterns:
            match = re.match(pattern, time_str)
            if match:
                return formatter(match)
        return time_str
    
    def _format_time_match(self, match) -> str:
        hour = int(match.group(1))
        minute = match.group(2) if len(match.groups()) > 1 and match.group(2) else "00"
        ampm = match.group(3) if len(match.groups()) > 2 and match.group(3) else None
        if not ampm:
            ampm = "AM" if hour < 12 or hour == 24 else "PM"
        return f"{hour:02d}:{minute} {ampm.upper()}"
    
    def check_conversation_end(self, message: str) -> bool:
        message_lower = message.lower().strip()
        if message_lower in ['exit', 'quit', 'bye', 'goodbye', 'end', 'stop']:
            return True
        for phrase in self.farewell_phrases:
            if phrase in message_lower and len(message_lower) < 30:
                return True
        return False
    
    def call_nodejs_backend(self, specialty: str, date: str, time_preference: str) -> List[str]:
        return self.search_doctor_availability(specialty, date, time_preference)
    
    def process_message(self, message: str, conversation_id: Optional[str] = None) -> Dict[str, Any]:
        
        if self.check_conversation_end(message):
            response_text = random.choice([
                "Thank you for visiting! Have a great day!",
                "It was a pleasure helping you. Take care!"
            ])
            return {
                "response": response_text,
                "function_call": None,
                "available_slots": None,
                "booking_complete": True,
                "conversation_state": "ended",
                "conversation_id": conversation_id,
                "conversation_ended": True
            }
        
        if not conversation_id:
            conversation_id = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []
            
        self.conversations[conversation_id].append({"role": "user", "content": message})
        
        contents = []
        for msg in self.conversations[conversation_id][-5:]:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))
        
        self.current_model_index = 0
        
        while self.current_model_index < len(self.models):
            current_model = self.get_current_model()
            try:
                response = self.client.models.generate_content(
                    model=current_model,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        tools=[self.tool],
                        system_instruction=self.system_instruction,
                        temperature=0.3,
                    )
                )
                
                if (response.candidates and 
                    response.candidates[0].content.parts and 
                    response.candidates[0].content.parts[0].function_call):
                    
                    function_call = response.candidates[0].content.parts[0].function_call
                    args = {key: value for key, value in function_call.args.items()}
                    
                    if function_call.name == "search_doctor_availability":
                        available_slots = self.call_nodejs_backend(
                            specialty=args.get("specialty"),
                            date=args.get("date"),
                            time_preference=args.get("time_preference")
                        )
                        slots_text = ", ".join(available_slots)
                        response_text = f"I found slots for a {args.get('specialty')} on {args.get('date')} ({args.get('time_preference')}): {slots_text}. Which time works best for you?"
                        
                        self.conversations[conversation_id].append({"role": "assistant", "content": response_text})
                        
                        return {
                            "response": response_text,
                            "function_call": {"name": function_call.name, "args": args},
                            "available_slots": available_slots,
                            "booking_complete": False,
                            "conversation_state": "checking_availability",
                            "conversation_id": conversation_id,
                            "conversation_ended": False
                        }
                
                response_text = self.extract_text_from_response(response)
                self.conversations[conversation_id].append({"role": "assistant", "content": response_text})
                
                return {
                    "response": response_text,
                    "function_call": None,
                    "available_slots": None,
                    "booking_complete": False,
                    "conversation_state": "conversing",
                    "conversation_id": conversation_id,
                    "conversation_ended": False
                }
                
            except Exception as e:
                error_str = str(e)
                # ADD THIS LINE:
                print(f"⚠️ ACTUAL API ERROR on {current_model}: {error_str}")
                
                if "429" in error_str or "quota" in error_str.lower() or "resource exhausted" in error_str.lower():
                    if self.switch_to_next_model():
                        continue
                    else:
                        break
                else:
                    break
                    
        return self._fallback_response(message, conversation_id)
    
    def _fallback_response(self, message: str, conversation_id: str) -> Dict[str, Any]:
        fallback_text = "I understand you'd like to book an appointment. Could you please tell me which specialist you'd like to see and your preferred date and time?"
        if conversation_id and conversation_id in self.conversations:
            self.conversations[conversation_id].append({"role": "assistant", "content": fallback_text})
            
        return {
            "response": fallback_text,
            "function_call": None,
            "available_slots": None,
            "booking_complete": False,
            "conversation_state": "collecting_info",
            "conversation_id": conversation_id,
            "conversation_ended": False
        }
    
    def confirm_booking(self, conversation_id: str, selected_time: str) -> Dict[str, Any]:
        if conversation_id not in self.conversations:
            return {"response": "I couldn't find your conversation. Please start over.", "booking_complete": False, "conversation_id": conversation_id}
        
        formatted_time = self.format_time_input(selected_time)
        confirmation_text = f"Great! I've booked your appointment for {formatted_time}. You'll receive a confirmation email shortly."
        self.conversations[conversation_id].append({"role": "assistant", "content": confirmation_text})
        
        return {"response": confirmation_text, "booking_complete": True, "conversation_id": conversation_id}