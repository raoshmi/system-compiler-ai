from utils import get_llm_response, parse_json

PROMPT = """
Generate the complete technical schema for the application based on the architecture.
You MUST provide: Database Schema, API Schema, UI Schema, and Auth Rules.

Architecture:
{architecture}

Output Format (Strict JSON):
{{
  "dbSchema": {{
    "tables": [
      {{ "name": "string", "columns": [{{ "name": "string", "type": "string", "required": "boolean", "primaryKey": "boolean", "foreignKey": {{ "table": "string", "column": "string" }} }}] }}
    ]
  }},
  "apiSchema": {{
    "endpoints": [
      {{ "path": "string", "method": "GET|POST|PUT|DELETE", "description": "string", "authRequired": "boolean", "roles": ["string"] }}
    ]
  }},
  "uiSchema": {{
    "pages": [
      {{ "route": "string", "title": "string", "layout": "string", "components": [{{ "id": "string", "type": "string", "props": {{}}, "dataBinding": {{ "apiEndpoint": "string" }} }}] }}
    ]
  }},
  "authSchema": {{
    "roles": ["string"],
    "rules": [{{ "role": "string", "permissions": ["string"] }}]
  }}
}}
"""

def generate_schema(architecture: dict):
    prompt = PROMPT.format(architecture=architecture)
    response = get_llm_response(prompt)
    return parse_json(response)
