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
            temperature=0.1 # Keep it deterministic
        )
    )
    return response.text

def parse_json(text: str) -> dict:
    text = text.strip()
    try:
        return json.loads(text)
    except Exception as e:
        # Fallback for markdown blocks
        if "```" in text:
            # Try to find content between ```json and ``` or just ``` and ```
            try:
                if "```json" in text:
                    content = text.split("```json")[1].split("```")[0].strip()
                else:
                    content = text.split("```")[1].split("```")[0].strip()
                return json.loads(content)
            except:
                pass
        
        # Last resort: try to find the first '{' and last '}'
        try:
            start = text.find('{')
            end = text.rfind('}')
            if start != -1 and end != -1:
                return json.loads(text[start:end+1])
        except:
            pass
            
        raise e
