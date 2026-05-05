import sys
import os

# Add the current directory to path so we can import 'backend'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.intent import extract_intent
from backend.architect import design_architecture
from backend.schema import generate_schema
from backend.validator import validate_schema

def test_pipeline():
    prompt = "Build a CRM with login, contacts, and dashboard. Admins can see analytics."
    print(f"Testing Prompt: {prompt}")
    
    try:
        print("Stage 1: Intent...")
        intent = extract_intent(prompt)
        print("Intent extracted.")
        
        print("Stage 2: Architecture...")
        arch = design_architecture(intent)
        print("Architecture designed.")
        
        print("Stage 3: Schema...")
        config = generate_schema(arch)
        print("Schema generated.")
        
        print("Stage 4: Validation...")
        errors = validate_schema(config)
        if errors:
            print(f"Validation errors found: {errors}")
        else:
            print("Validation successful!")
            
    except Exception as e:
        print(f"Error during pipeline: {e}")

if __name__ == "__main__":
    test_pipeline()
