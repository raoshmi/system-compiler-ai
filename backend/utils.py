import os
from groq import Groq
from dotenv import load_dotenv
import json
import time

# Load .env
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Configure Groq
groq_key = os.getenv("GROQ_API_KEY")
groq_client = None
if groq_key:
    groq_client = Groq(api_key=groq_key)

import google.generativeai as genai
# Configure Gemini as fallback
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def get_llm_response(prompt: str, model_name: str = "llama-3-3-70b-versatile") -> str:
    # Priority 1: Gemini (Best for Large Context)
    if api_key:
        print("DEBUG: Using Gemini (High Capacity)...")
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"ERROR: Gemini failed - {str(e)}")

    # Priority 2: Groq 70b (Higher TPM than 8b)
    if groq_client:
        model = "llama-3.3-70b-versatile"
        print(f"DEBUG: Calling Groq AI ({model})...")
        try:
            chat_completion = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "Expert architect. Return ONLY compact JSON. No talk."},
                    {"role": "user", "content": prompt}
                ],
                model=model,
                temperature=0.1,
                max_tokens=4096, 
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"ERROR: Groq failed - {str(e)}")
            raise e
    
    raise Exception("No working AI API Key found.")

def parse_json(text: str) -> dict:
    # Aggressive cleaning
    text = text.strip()
    # Remove markdown code blocks if present
    if "```" in text:
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        else:
            text = text.split("```")[1].split("```")[0].strip()

    try:
        return json.loads(text)
    except Exception as e:
        # If it's an unterminated string error, try to close the braces/quotes
        error_msg = str(e)
        if "Unterminated string" in error_msg or "Expecting" in error_msg:
            # Try to fix by adding closing braces/brackets
            temp_text = text
            # Close open quotes first
            if temp_text.count('"') % 2 != 0:
                temp_text += '"'
            
            # Balance braces
            open_braces = temp_text.count('{')
            close_braces = temp_text.count('}')
            if open_braces > close_braces:
                temp_text += '}' * (open_braces - close_braces)
            
            # Balance brackets
            open_brackets = temp_text.count('[')
            close_brackets = temp_text.count(']')
            if open_brackets > close_brackets:
                temp_text += ']' * (open_brackets - close_brackets)
                
            try:
                return json.loads(temp_text)
            except:
                pass

        # One last resort: find first { and last }
        try:
            start = text.find('{')
            end = text.rfind('}')
            if start != -1 and end != -1:
                return json.loads(text[start:end+1])
        except:
            pass
        raise e

def safe_format(template, **kwargs):
    result = template
    for key, value in kwargs.items():
        placeholder = "{" + key + "}"
        result = result.replace(placeholder, str(value))
    return result
