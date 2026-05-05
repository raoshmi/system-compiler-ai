import json
import time
import sys
import os

# Add the current directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.intent import extract_intent
from backend.architect import design_architecture
from backend.schema import generate_schema
from backend.validator import validate_schema, repair_schema

TEST_CASES = [
    # Normal Prompts
    "Build a CRM with login, contacts, dashboard, and role-based access.",
    "Create a Todo app with categories, deadlines, and sharing features.",
    "E-commerce platform with product catalog, cart, and stripe payments.",
    "Blog platform where writers can post and users can comment.",
    "Fitness tracker with workout logs, progress charts, and user profiles.",
    "Event management system with ticket booking and attendee list.",
    "Inventory system for a small warehouse with stock alerts.",
    "Recipe sharing app with search by ingredients and meal planning.",
    "Project management tool like Trello with boards and cards.",
    "Customer support desk with ticket creation and agent roles.",
    
    # Edge Cases
    "make me an app", # Vague
    "sab admin ho aur sab user bhi ho", # Conflicting
    "login banana hai", # Incomplete
    "App for Martians to track space dust with gravity-defying UI.", # Unusual domain
    "System with 1000 different roles each with 1 unique permission.", # Stress test
    "A platform that builds other platforms automatically.", # Recursive
    "Social media but without any users or posts.", # Logical void
    "Bank app with no security and anyone can withdraw anyone's money.", # Policy test
    "App that only works on Tuesdays between 2 PM and 3 PM.", # Constraint
    "Very long prompt: " + ("Build an app. " * 50) # Length stress
]

def run_evaluation():
    results = []
    print(f"Starting evaluation of {len(TEST_CASES)} cases...")
    
    for i, prompt in enumerate(TEST_CASES):
        print(f"Test {i+1}/{len(TEST_CASES)}: {prompt[:50]}...")
        
        start_time = time.time()
        success = False
        repair_count = 0
        error_count = 0
        
        try:
            intent = extract_intent(prompt)
            arch = design_architecture(intent)
            config = generate_schema(arch)
            
            errors = validate_schema(config)
            if errors:
                config = repair_schema(config, errors)
                repair_count = 1
                errors = validate_schema(config)
            
            error_count = len(errors)
            success = error_count == 0
            
        except Exception as e:
            print(f"Failed: {e}")
            
        latency = time.time() - start_time
        results.append({
            "id": i + 1,
            "prompt": prompt,
            "success": success,
            "latency": latency,
            "repairs": repair_count,
            "errors": error_count
        })

    # Save results
    with open("evaluation_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    # Summary
    success_rate = sum(1 for r in results if r['success']) / len(results) * 100
    avg_latency = sum(r['latency'] for r in results) / len(results)
    
    print("\n--- EVALUATION SUMMARY ---")
    print(f"Success Rate: {success_rate:.2f}%")
    print(f"Avg Latency: {avg_latency:.2f}s")
    print("Results saved to evaluation_results.json")

if __name__ == "__main__":
    run_evaluation()
