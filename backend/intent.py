from utils import get_llm_response, parse_json, safe_format

PROMPT = """
Analyze the following user requirement for a software application.
Extract the key components into a structured JSON format.

User Requirement: "{query}"

Output Format:
{
  "appName": "string",
  "entities": ["string"],
  "actions": ["string"],
  "roles": ["string"],
  "features": ["string"],
  "constraints": ["string"]
}
"""

def extract_intent(query: str):
    prompt = safe_format(PROMPT, query=query)
    response = get_llm_response(prompt)
    return parse_json(response)
