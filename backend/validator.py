import datetime
import json
from utils import get_llm_response, parse_json

def log_error(error_msg: str):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open("errors.log", "a") as f:
        f.write(f"[{timestamp}] {error_msg}\n")

def validate_schema(config: dict):
    errors = []
    
    # Safely get schemas with defaults to prevent KeyErrors
    db_schema = config.get('dbSchema', {})
    api_schema = config.get('apiSchema', {})
    ui_schema = config.get('uiSchema', {})
    auth_schema = config.get('authSchema', {})

    db_tables = {t.get('name') for t in db_schema.get('tables', []) if t.get('name')}
    api_endpoints = {e.get('path') for e in api_schema.get('endpoints', []) if e.get('path')}
    auth_roles = set(auth_schema.get('roles', []))

    # 1. Check if API roles exist in Auth Schema
    for endpoint in api_schema.get('endpoints', []):
        path = endpoint.get('path', 'unknown')
        for role in endpoint.get('roles', []):
            if role not in auth_roles:
                msg = f"API endpoint {path} references undefined role: {role}"
                errors.append(msg)
                log_error(msg)

    # 2. Check if UI components call existing API endpoints
    for page in ui_schema.get('pages', []):
        route = page.get('route', 'unknown')
        for comp in page.get('components', []):
            if 'dataBinding' in comp and 'apiEndpoint' in comp['dataBinding']:
                endpoint = comp['dataBinding']['apiEndpoint']
                if endpoint and endpoint not in api_endpoints:
                    msg = f"UI Component {comp.get('id', 'unknown')} in {route} references undefined API: {endpoint}"
                    errors.append(msg)
                    log_error(msg)

    # 3. Check if Auth Rules refer to valid roles
    for rule in auth_schema.get('rules', []):
        role = rule.get('role')
        if role and role not in auth_roles:
            msg = f"Auth rule defined for undefined role: {role}"
            errors.append(msg)
            log_error(msg)

    return errors

SURGICAL_REPAIR_PROMPT = """
The following application configuration has validation errors. 
REPAIR ONLY the specific broken sections. DO NOT change the working parts.

Validation Errors:
{errors}

Original Config:
{config}

Return the COMPLETE fixed configuration in JSON format.
"""

def repair_schema(config: dict, errors: list):
    prompt = SURGICAL_REPAIR_PROMPT.format(errors="\n".join(errors), config=json.dumps(config, indent=2))
    response = get_llm_response(prompt)
    return parse_json(response)
