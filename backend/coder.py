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
    prompt = PROMPT.format(schemas=schemas)
    response = get_llm_response(prompt)
    return parse_json(response)
