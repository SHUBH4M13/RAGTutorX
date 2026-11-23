
import re


def extract_cited_pages(answer: str) -> set[int]:
    """
    Extract page references such as [Page 3] or [Page 12].
    """
    matches = re.findall(
        r"\[Page\s+(\d+)\]",
        answer,
        re.IGNORECASE
    )

    return {int(page) for page in matches}


def validate_citations(answer: str, chunks: list[dict]):
    """
    Ensure every cited page exists in the retrieved context.
    """

    available_pages = {
        int(chunk["page_number"])
        for chunk in chunks
        if chunk.get("page_number") is not None
    }

    cited_pages = extract_cited_pages(answer)

    if not cited_pages:
        return False, "No page citations found in the answer."

    invalid_pages = cited_pages - available_pages

    if invalid_pages:
        return False, f"Invalid page citations: {sorted(invalid_pages)}"

    return True, "All citations reference retrieved pages."
