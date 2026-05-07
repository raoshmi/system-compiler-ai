from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import os
import json

# Import our custom modules
from utils import get_llm_response, parse_json
from intent import extract_intent
from architect import design_architecture
from schema import generate_schema
from validator import validate_schema, repair_schema

app = FastAPI(title="AppForge AI Compiler")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
async def root():
    return {"status": "healthy", "service": "AppForge AI Backend"}

@app.get("/debug")
async def debug_status():
    """Check the status of environment variables (keys are masked)."""
    return {
        "GROQ_KEY": "SET" if os.getenv("GROQ_API_KEY") else "MISSING",
        "GEMINI_KEY": "SET" if os.getenv("GEMINI_API_KEY") else "MISSING",
        "OPENROUTER_KEY": "SET" if os.getenv("OPENROUTER_API_KEY") else "MISSING",
        "ENVIRONMENT": os.getenv("NODE_ENV", "development")
    }

def get_dynamic_mock(prompt: str):
    prompt_lower = prompt.lower()
    mock_data = {
        "dbSchema": { "tables": [{ "name": "contacts", "columns": [{ "name": "id", "type": "uuid", "primaryKey": True }, { "name": "name", "type": "string" }] }] },
        "apiSchema": { "endpoints": [{ "path": "/api/contacts", "method": "GET", "description": "Get contacts" }] },
        "uiSchema": { "pages": [{ "route": "/dashboard", "title": "Dashboard", "layout": "grid", "components": [] }] },
        "authSchema": { "roles": ["user"], "rules": [] }
    }
    if "gaming" in prompt_lower or "game" in prompt_lower:
        mock_data["uiSchema"]["pages"][0]["title"] = "Gaming Platform Alpha"
    return mock_data

@app.post("/generate")
async def generate_app(request: PromptRequest):
    start_time = time.time()
    try:
        # Step 1: Extract Intent
        print(f"DEBUG: Processing prompt: {request.prompt[:50]}...")
        intent_raw = extract_intent(request.prompt)
        
        # Step 2: Design Architecture
        arch_raw = design_architecture(intent_raw)
        
        # Step 3: Generate Schema
        config = generate_schema(arch_raw)
        
        # Step 4: Validate and optional Repair
        errors = validate_schema(config)
        repair_count = 0
        if errors and repair_count < 1:
            config = repair_schema(config, errors)
            repair_count += 1
            
        latency = round(time.time() - start_time, 2)
        
        return {
            "success": True,
            "latency": latency,
            "repairCount": repair_count,
            "errors": errors,
            "data": config
        }
        
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR in Pipeline: {error_msg}")
        
        # Determine if it's a parse error or provider error
        is_parse_error = "parse" in error_msg.lower()
        
        # Provide a smart mock with error details
        mock_data = get_dynamic_mock(request.prompt)
        
        # Determine which keys are missing for the error message
        status = {
            "GROQ": "SET" if os.getenv("GROQ_API_KEY") else "MISSING",
            "GEMINI": "SET" if os.getenv("GEMINI_API_KEY") else "MISSING",
            "OPENROUTER": "SET" if os.getenv("OPENROUTER_API_KEY") else "MISSING"
        }
        
        latency = round(time.time() - start_time, 2)
        return {
            "success": False,
            "error": error_msg,
            "latency": latency,
            "repairCount": 0,
            "key_status": status,
            "errors": [f"System Error: {error_msg}"],
            "raw_response": getattr(e, 'raw_content', 'Unavailable' if is_parse_error else 'N/A'),
            "data": mock_data
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
