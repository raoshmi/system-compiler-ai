from utils import get_llm_response, parse_json, safe_format

PROMPT = """
Analyze the following user requirement for a software application.
If a conversation history is provided, use it to understand the context of refinements.
Extract the key components into a structured JSON format.

{history_context}
User Requirement: "{query}"

Output Format:
{{
  "appName": "string",
  "entities": ["string"],
  "actions": ["string"],
  "roles": ["string"],
  "features": ["string"],
  "constraints": ["string"]
}}
"""

def extract_intent(query: str, history: list = []):
    history_context = ""
    if history:
        history_context = "Conversation History:\n" + "\n".join([f"{m['role'].upper()}: {m['content']}" for m in history])
    
    prompt = safe_format(PROMPT, query=query, history_context=history_context)
    response = get_llm_response(prompt)
    return parse_json(response)
