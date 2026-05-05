import datetime
import json
from .utils import get_llm_response, parse_json

def log_error(error_msg: str):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open("errors.log", "a") as f:
        f.write(f"[{timestamp}] {error_msg}\n")

def validate_schema(config: dict):
    errors = []
    
    db_tables = {t['name'] for t in config['dbSchema']['tables']}
    api_endpoints = {e['path'] for e in config['apiSchema']['endpoints']}
    auth_roles = set(config['authSchema']['roles'])

    # 1. Check if API roles exist in Auth Schema
    for endpoint in config['apiSchema']['endpoints']:
        for role in endpoint['roles']:
            if role not in auth_roles:
                msg = f"API endpoint {endpoint['path']} references undefined role: {role}"
                errors.append(msg)
                log_error(msg)

    # 2. Check if UI components call existing API endpoints
    for page in config['uiSchema']['pages']:
        for comp in page['components']:
            if 'dataBinding' in comp and 'apiEndpoint' in comp['dataBinding']:
                endpoint = comp['dataBinding']['apiEndpoint']
                if endpoint and endpoint not in api_endpoints:
                    msg = f"UI Component {comp['id']} in {page['route']} references undefined API: {endpoint}"
                    errors.append(msg)
                    log_error(msg)

    # 3. Check if Auth Rules refer to valid roles
    for rule in config['authSchema']['rules']:
        if rule['role'] not in auth_roles:
            msg = f"Auth rule defined for undefined role: {rule['role']}"
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
