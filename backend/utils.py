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
            print("DEBUG: Trying Gemini (gemini-1.5-flash)...")
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
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
            print("DEBUG: Trying OpenRouter (google/gemini-2.0-flash-lite-001)...")
            with httpx.Client() as client:
                response = client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {openrouter_key}",
                        "HTTP-Referer": "https://github.com/raoshmi/system-compiler-ai",
                        "X-Title": "AppForge AI"
                    },
                    json={
                        "model": "google/gemini-2.0-flash-lite-001",
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

def fix_truncated_json(json_str: str) -> str:
    """Attempt to fix truncated JSON by closing open strings, then braces/brackets."""
    # 1. Fix unterminated string if necessary
    # Count quotes to see if we're inside a string
    quotes = json_str.count('"')
    # If odd number of quotes and it doesn't end with a quote
    if quotes % 2 != 0:
        json_str += '"'
    
    # 2. Close open braces/brackets
    stack = []
    # Re-scan for balance after potential string fix
    for char in json_str:
        if char == '{':
            stack.append('}')
        elif char == '[':
            stack.append(']')
        elif char == '}' or char == ']':
            if stack and stack[-1] == char:
                stack.pop()
    
    # Append the closing characters in reverse order
    return json_str + "".join(reversed(stack))

def parse_json(text: str) -> dict:
    try:
        # 1. Find the first '{'
        start = text.find('{')
        if start == -1:
            raise Exception("No JSON block found.")
        
        json_content = text[start:].strip()
        if json_content.endswith('```'):
            json_content = json_content[:-3].strip()
            
        # 2. Try raw_decode to handle "Extra Data" gracefully
        decoder = json.JSONDecoder()
        try:
            # Clean characters that break the decoder first
            clean_str = re.sub(r',\s*([\]}])', r'\1', json_content)
            result, index = decoder.raw_decode(clean_str)
            return result
        except json.JSONDecodeError as e:
            # If it's a truncation error, try fixing it
            if "Expecting" in str(e) or "Unterminated" in str(e):
                fixed = fix_truncated_json(json_content)
                # Clean fixed version
                fixed = re.sub(r',\s*([\]}])', r'\1', fixed)
                try:
                    res, _ = decoder.raw_decode(fixed)
                    return res
                except:
                    # Final attempt with simple json.loads
                    return json.loads(fixed)
            else:
                raise e
            
    except Exception as e:
        print(f"DEBUG: Military Parser Error: {e}")
        err = Exception(f"JSON Parse Failed: {str(e)}")
        err.raw_content = text[:1000]
        raise err
