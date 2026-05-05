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
    try:
        # Stage 1: Intent
        intent = extract_intent(request.prompt)
        
        # Stage 2: Architecture
        architecture = design_architecture(intent)
        
        # Stage 3: Schema
        config = generate_schema(architecture)
        
        # Stage 4: Validation & Repair
        errors = validate_schema(config)
        repair_count = 0
        if errors:
            config = repair_schema(config, errors)
            repair_count += 1
            # Re-validate after repair
            errors = validate_schema(config)

        end_time = time.time()
        
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
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
