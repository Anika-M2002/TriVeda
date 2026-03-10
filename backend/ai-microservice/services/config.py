import os
from google import genai
from dotenv import load_dotenv # <-- Add this

# Load the .env file automatically
load_dotenv() # <-- Add this

class GeminiConfig:
    """Centralized configuration for the Gemini Client"""
    @staticmethod
    def setup(api_key: str = None):
        if api_key:
            client = genai.Client(api_key=api_key)
        else:
            api_key = os.getenv("GEMINI_API_KEY")
            if api_key:
                client = genai.Client(api_key=api_key)
            else:
                raise ValueError("Gemini API key not found! Set the GEMINI_API_KEY environment variable.")
        
        return client