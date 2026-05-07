import os
import json
import re
import google.generativeai as genai
from groq import Groq
import httpx
import unicodedata
from dotenv import load_dotenv

load_dotenv()

def safe_format(template, **kwargs):
    """Safely format a string by escaping curly braces in values."""
    safe_kwargs = {k: str(v).replace("{", "{{").replace("}", "}}") for k, v in kwargs.items()}
    return template.format(**safe_kwargs)

def get_llm_response(prompt: str) -> str:
    # 1. Try Gemini (High Context & Reliable)
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            print("DEBUG: Trying Gemini (gemini-1.5-pro)...")
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-pro")
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=8000,
                    temperature=0.1
                )
            )
            if response and response.text:
                return response.text
        except Exception as e:
            print(f"DEBUG: Gemini failed: {e}")

    # 2. Try OpenRouter (Free Fallback - very reliable)
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    if openrouter_key:
        try:
            print("DEBUG: Trying OpenRouter (google/gemini-2.0-flash-exp:free)...")
            with httpx.Client() as client:
                response = client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {openrouter_key}",
                        "HTTP-Referer": "https://github.com/raoshmi/system-compiler-ai",
                        "X-Title": "AppForge AI"
                    },
                    json={
                        "model": "google/gemini-2.0-flash-exp:free",
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": 8000,
                        "temperature": 0.1
                    },
                    timeout=90.0
                )
                if response.status_code == 200:
                    return response.json()["choices"][0]["message"]["content"]
                else:
                    print(f"DEBUG: OpenRouter API error: {response.text}")
        except Exception as e:
            print(f"DEBUG: OpenRouter failed: {e}")

    # 3. Try Groq (Last Resort because of tight limits)
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        try:
            print("DEBUG: Trying Groq (llama-3.1-8b-instant)...")
            client = Groq(api_key=groq_key)
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are an expert app architect. Return ONLY valid, clean JSON."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"DEBUG: Groq failed: {e}")

    raise Exception("All AI providers (Gemini, OpenRouter, Groq) failed.")

def parse_json(text: str) -> dict:
    try:
        # Find first '{' and last '}'
        start = text.find('{')
        end = text.rfind('}')
        if start == -1 or end == -1:
            raise Exception("No JSON block found.")
        
        json_str = text[start:end+1]
        
        # Aggressive cleaning
        # Remove trailing commas before closing braces/brackets
        json_str = re.sub(r',\s*([\]}])', r'\1', json_str)
        # Remove control characters
        json_str = "".join(ch for ch in json_str if unicodedata.category(ch)[0] != "C" or ch in "\n\r\t")
        
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            # Try to fix unquoted keys if necessary (very common with some LLMs)
            json_str = re.sub(r'(\w+):', r'"\1":', json_str)
            return json.loads(json_str)
            
    except Exception as e:
        print(f"DEBUG: Parse Error: {e}")
        err = Exception(f"JSON Parse Failed: {str(e)}")
        err.raw_content = text[:1000]
        raise err
