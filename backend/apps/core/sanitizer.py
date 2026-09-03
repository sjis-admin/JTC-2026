import html
import re
from django.utils.html import strip_tags

# Regex to strip potentially dangerous JavaScript protocol patterns and event handlers
UNSAFE_JS_PATTERN = re.compile(r'(?i)(javascript:|data:|vbscript:|on\w+\s*=)')

def sanitize_text(value: str, max_length: int = None) -> str:
    """
    Sanitizes user input string:
    1. Strips all HTML/XML tags
    2. Strips unsafe javascript: protocols
    3. Trims whitespace
    4. Truncates to max_length if specified
    """
    if not value or not isinstance(value, str):
        return ''
    
    # Strip HTML tags
    cleaned = strip_tags(value)
    # Remove javascript/event handler injections
    cleaned = UNSAFE_JS_PATTERN.sub('', cleaned)
    # Normalize excessive whitespaces
    cleaned = ' '.join(cleaned.split())
    
    if max_length and len(cleaned) > max_length:
        cleaned = cleaned[:max_length]
        
    return cleaned
