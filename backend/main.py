from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from intent import extract_intent
from architect import design_architecture
from schema import generate_schema
from validator import validate_schema, repair_schema
import time
import sys
import os

# Ensure the current directory is in sys.path for Railway
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "alive", "service": "AppForge AI Backend"}

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_app(request: PromptRequest):
    start_time = time.time()
    print(f"DEBUG: Starting generation for prompt: {request.prompt[:50]}...")
    try:
        # Stage 1: Intent
        print("DEBUG: Stage 1 - Extracting Intent...")
        intent = extract_intent(request.prompt)
        print("DEBUG: Intent extracted successfully.")
        
        # Stage 2: Architecture
        print("DEBUG: Stage 2 - Designing Architecture...")
        architecture = design_architecture(intent)
        print("DEBUG: Architecture designed successfully.")
        
        # Stage 3: Schema
        print("DEBUG: Stage 3 - Generating Schema...")
        config = generate_schema(architecture)
        print("DEBUG: Schema generated successfully.")
        
        # Stage 4: Validation & Repair
        print("DEBUG: Stage 4 - Validating...")
        errors = validate_schema(config)
        repair_count = 0
        if errors:
            print(f"DEBUG: Validation errors found: {len(errors)}. Repairing...")
            config = repair_schema(config, errors)
            repair_count += 1
            errors = validate_schema(config)
            print("DEBUG: Repair completed.")

        end_time = time.time()
        print(f"DEBUG: Generation complete in {end_time - start_time:.2f}s")
        
        return {
            "success": True,
            "latency": end_time - start_time,
            "repairCount": repair_count,
            "errors": errors,
            "data": config,
            "stages": {
                "intent": intent,
                "architecture": architecture
            }
        }
    except Exception as e:
        print(f"ERROR: Generation failed at {time.time()} - {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
