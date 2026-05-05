import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

load_dotenv()

# Configure Gemini
# Ensure GEMINI_API_KEY is set in environment
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_llm_response(prompt: str, model_name: str = "gemini-1.5-flash") -> str:
    model = genai.GenerativeModel(model_name)
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.1, # Keep it deterministic
            response_mime_type="application/json"
        )
    )
    return response.text

def parse_json(text: str) -> dict:
    try:
        return json.loads(text)
    except Exception as e:
        # Fallback for minor formatting issues
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
            return json.loads(text)
        raise e
