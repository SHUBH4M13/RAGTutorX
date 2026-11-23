
from guardrails.citation_guard import (
    extract_cited_pages,
    validate_citations
)

# Simulated retrieved textbook chunks
chunks = [
    {
        "page_number": 2,
        "text": "Machine learning is a branch of AI."
    },
    {
        "page_number": 5,
        "text": "Deep learning uses neural networks."
    }
]

# Test 1: Valid citations
answer1 = """
Machine learning is a branch of artificial intelligence.
[Page 2]

Deep learning uses neural networks.
[Page 5]
"""

# Test 2: Invalid citation
answer2 = """
Machine learning is a branch of artificial intelligence.
[Page 10]
"""

# Test 3: Missing citations
answer3 = """
Machine learning is a branch of artificial intelligence.
"""


for i, answer in enumerate(
    [answer1, answer2, answer3],
    start=1
):
    print(f"\nTest {i}")

    print("Cited pages:", extract_cited_pages(answer))

    valid, message = validate_citations(answer, chunks)

    print("Valid:", valid)
    print("Message:", message)
