
import re


MAX_QUESTION_LENGTH = 1000

SUSPICIOUS_PATTERNS = [
    r"ignore\s+(all\s+)?previous\s+instructions",
    r"disregard\s+(all\s+)?instructions",
    r"reveal\s+(your\s+)?system\s+prompt",
    r"show\s+me\s+your\s+hidden\s+instructions",
    r"act\s+as\s+if\s+you\s+have\s+no\s+restrictions",
]


def validate_question(question: str):

    if not isinstance(question, str):
        return False, "Question must be a string."

    question = question.strip()

    if not question:
        return False, "Question cannot be empty."

    if len(question) > MAX_QUESTION_LENGTH:
        return False, "Question is too long. Maximum 1000 characters."

    for pattern in SUSPICIOUS_PATTERNS:
        if re.search(pattern, question, re.IGNORECASE):
            return False, "Potential prompt injection detected."

    return True, "Question is valid."
