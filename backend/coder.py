from utils import get_llm_response, parse_json

PROMPT = """
Convert the following application schemas into production-ready code.
You must provide:
1. React (Next.js) Components for the UI Schema.
2. FastAPI Route Handlers for the API Schema.
3. SQL (PostgreSQL) Migration Script for the DB Schema.

Schemas:
{schemas}

Output Format:
{{
  "reactCode": "string (The complete Next.js page code)",
  "apiCode": "string (The FastAPI routes)",
  "dbCode": "string (The SQL migrations)"
}}
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
