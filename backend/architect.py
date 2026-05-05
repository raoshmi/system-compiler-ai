from .utils import get_llm_response, parse_json

PROMPT = """
Based on the extracted intent below, design the high-level architecture of the application.
Define the main modules, data flows, and how the roles interact.

Intent:
{intent}

Output Format:
{{
  "architectureType": "string (e.g., Monolith, Microservices)",
  "modules": [
    {{
      "name": "string",
      "description": "string",
      "dependencies": ["string"]
    }}
  ],
  "dataFlows": [
    {{
      "from": "string",
      "to": "string",
      "description": "string"
    }}
  ],
  "keyIntegrations": ["string"]
}}
"""

def design_architecture(intent: dict):
    prompt = PROMPT.format(intent=intent)
    response = get_llm_response(prompt)
    return parse_json(response)
