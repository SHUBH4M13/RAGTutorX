
def validate_output(answer: str):

    if not answer or not answer.strip():
        return False, "The model generated an empty response."

    if len(answer) > 10000:
        return False, "Generated response exceeds the allowed length."

    return True, "Output is valid."
