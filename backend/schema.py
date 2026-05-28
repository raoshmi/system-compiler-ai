from utils import get_llm_response, parse_json, safe_format

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
    ],
    "openApiSpec": "string (YAML OpenAPI 3.0 spec snippet)"
  }},
  "uiSchema": {{
    "pages": [
      {{ "route": "string", "title": "string", "layout": "string", "components": [{{ "id": "string", "type": "string", "props": {{}}, "dataBinding": {{ "apiEndpoint": "string" }} }}] }}
    ]
  }},
  "authSchema": {{
    "roles": ["string"],
    "rules": [{{ "role": "string", "permissions": ["string"] }}],
    "ssoConfig": {{ "providers": ["google", "github"], "enabled": "boolean" }}
  }},
  "storageSchema": {{
    "buckets": [{{ "name": "string", "access": "public|private", "maxSizeMB": "number" }}]
  }},
  "emailSchema": {{
    "templates": [{{ "id": "string", "subject": "string", "trigger": "string" }}]
  }},
  "paymentSchema": {{
    "provider": "stripe",
    "plans": [{{ "id": "string", "name": "string", "amount": "number", "currency": "string", "interval": "month|year|one-time" }}]
  }}
}}

CRITICAL CONSTRAINT: Every "apiEndpoint" referenced in the "uiSchema" MUST exist as a "path" in the "apiSchema".
"""

def generate_schema(architecture: dict):
    prompt = safe_format(PROMPT, architecture=architecture)
    response = get_llm_response(prompt)
    return parse_json(response)
