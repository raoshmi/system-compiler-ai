from utils import get_llm_response, parse_json, safe_format

PROMPT = """
You are an expert full-stack developer. Convert the following application schemas into production-ready, high-quality code.
The code should be modern, clean, and follow best practices.

Required Components:
1. React (Next.js 15) Component: Use Tailwind CSS for styling, Lucide icons, and Framer Motion for animations. Ensure it's a "use client" component.
2. FastAPI Route Handlers: Use Pydantic models for request/response validation, follow RESTful patterns, and include proper error handling.
3. SQL (PostgreSQL) Migration Script: Include table definitions with proper constraints (PK, FK, NOT NULL), indexes for performance, and initial seed data if relevant.

Schemas:
{schemas}

Output must be a VALID JSON object with exactly these keys:
{{
  "reactCode": "string (The complete Next.js page code)",
  "apiCode": "string (The FastAPI routes)",
  "dbCode": "string (The SQL migrations)"
}}
"""

def generate_full_code(schemas: dict):
    try:
        prompt = safe_format(PROMPT, schemas=schemas)
        response = get_llm_response(prompt)
        return parse_json(response)
    except Exception as e:
        print(f"ERROR: Code generation failed - {str(e)}")
        # DYNAMIC MOCK FALLBACK
        app_name = "Application"
        return {
            "reactCode": f"\"use client\";\n\nimport React from 'react';\n\nexport default function Dashboard() {{\n  return (\n    <div className=\"p-8 text-white\">\n      <h1 className=\"text-3xl font-bold mb-4\">Mock {app_name}</h1>\n      <div className=\"p-6 bg-white/5 rounded-xl border border-white/10\">\n        <p className=\"text-white/60\">This is a high-fidelity preview component.</p>\n        <p className=\"mt-2\">To generate real production code, please add your <b>GEMINI_API_KEY</b> to the backend .env file.</p>\n      </div>\n    </div>\n  );\n}}",
            "apiCode": f"# Mock API for {app_name}\nfrom fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get(\"/status\")\nasync def status():\n    return {{\"status\": \"mock_active\", \"message\": \"AI Key Missing\"}}",
            "dbCode": f"-- Mock Migrations\nCREATE TABLE mock_metadata (\n  id SERIAL PRIMARY KEY,\n  info TEXT\n);"
        }
