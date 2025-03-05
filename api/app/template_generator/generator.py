import os
import re
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
# load_dotenv()

# Initialize OpenAI client
client = OpenAI(
    api_key="185c416c-0b2c-43fd-a6ae-8e942b9b6482",
    base_url="https://ark.cn-beijing.volces.com/api/v3",
)

# List of reserved keywords to avoid
RESERVED_KEYWORDS = [
    "id", "name", "type", "class", "function", "var", "let", "const", "enum",
    "import", "export", "default", "return", "if", "else", "switch", "case",
    "break", "continue", "for", "while", "do", "try", "catch", "finally",
    "throw", "new", "this", "super", "extends", "implements", "interface",
    "private", "protected", "public", "static", "package", "true", "false",
    "null", "undefined", "NaN", "Infinity"
]

def credential_template_generator(description, num_attributes):
    """
    Generate a credential template based on the description and the number of attributes.
    
    Args:
        description (str): Description of the credential's purpose and requirements
        num_attributes (int): Number of attributes to include in the template
        
    Returns:
        dict: JSON credential template with appropriate attributes and data types
    """
    try:
        # Create prompt for the model
        prompt = f"""
        You are a credential template design expert. Create a credential template based on this description:
        
        "{description}"
        
        Please identify the {num_attributes} most important attributes for this credential.

        IMPORTANT CONSTRAINTS:
        1. Do NOT use any of these reserved keywords as attribute names: {', '.join(RESERVED_KEYWORDS)}
        2. Instead of using generic names like "name" or "id", use more specific descriptive names like "holder_name" or "certificate_id".
        3. EVERY attribute must be directly relevant to the specific credential described
        4. If you cannot think of {num_attributes} relevant attributes, use fewer rather than making up irrelevant ones
        
        For each attribute:
        1. Choose an appropriate name
        2. Assign one of these data types: string, int, dateTime, or decimal
        3. Order them by importance

        First, analyze what information would typically be included in this type of credential.
        Then select only the most relevant attributes based on standard industry practices for this credential type.
        Finally, make sure your output has the same number of attribute names as {num_attributes}.

        Return ONLY a valid JSON object where keys are attribute names and values are data types.
        Example format:
        {{
            "degree_type": "string",
            "institution_name": "string",
            "graduation_date": "dateTime",
            "holder_name": "string",
            "holder_age": "int",
            "course_average_score": "decimal"
        }}
        """

        # Call the API to generate template
        response = client.chat.completions.create(
            model="deepseek-r1-distill-qwen-32b-250120", 
            messages=[
                {"role": "system", "content": "You are a credential template design expert who creates structured JSON templates."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            timeout=30.0  # 设置30秒超时
        )
        
        # Extract and parse the JSON response
        result = response.choices[0].message.content
        
        # Find the JSON part in the response
        json_match = re.search(r'\{.*\}', result, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            template = json.loads(json_str)
            return template
        else:
            print("Error: Could not extract JSON template from response.")
            print("API returned:", result)
            return {}
            
    except Exception as e:
        print(f"Error generating credential template: {str(e)}")
        return {}

def validate_template(template):
    """Validate that the template contains only the allowed data types"""
    allowed_types = ["string", "int", "dateTime", "decimal"]
    validated_template = template.copy()
    for attr, data_type in template.items():
        if data_type not in allowed_types:
            print(f"Warning: Invalid data type '{data_type}' for attribute '{attr}'. Using 'string' instead.")
            validated_template[attr] = "string"
    return validated_template
