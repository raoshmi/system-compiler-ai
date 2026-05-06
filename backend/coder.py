from utils import get_llm_response, parse_json

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
{
  "reactCode": "string (The complete Next.js page code)",
  "apiCode": "string (The FastAPI routes)",
  "dbCode": "string (The SQL migrations)"
}
"""

def generate_full_code(schemas: dict):
    try:
        prompt = PROMPT.format(schemas=schemas)
        response = get_llm_response(prompt)
        return parse_json(response)
    except Exception as e:
        print(f"ERROR: Code generation failed - {str(e)}")
        # MOCK FALLBACK
        return {
            "reactCode": "\"use client\";\n\nimport React from 'react';\n\nexport default function Dashboard() {\n  return (\n    <div className=\"p-8\">\n      <h1 className=\"text-2xl font-bold\">Mock Dashboard</h1>\n      <p className=\"mt-4\">This is a placeholder component because the AI service is currently unavailable.</p>\n    </div>\n  );\n}",
            "apiCode": "from fastapi import APIRouter\n\nrouter = APIRouter()\n\n@router.get(\"/health\")\nasync def health():\n    return {\"status\": \"ok\", \"note\": \"Mock API active\"}",
            "dbCode": "CREATE TABLE mock_data (\n  id UUID PRIMARY KEY,\n  created_at TIMESTAMP DEFAULT NOW()\n);"
        }
