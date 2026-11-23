
import re
from langchain_text_splitters import RecursiveCharacterTextSplitter


EXERCISE_HEADINGS = [
    "Understanding the text",
    "Talking about the text",
    "Thinking about language",
    "Working with words",
    "Things to do",
]


def remove_exercise_sections(text: str) -> str:
    """
    Keep the chapter narrative and remove textbook exercise sections.
    """
    positions = []

    for heading in EXERCISE_HEADINGS:
        match = re.search(re.escape(heading), text, re.IGNORECASE)

        if match:
            positions.append(match.start())

    if positions:
        text = text[:min(positions)]

    return text.strip()


def chunk_pages(pages, chunk_size=900, chunk_overlap=150):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    all_chunks = []

    for page in pages:
        page_text = remove_exercise_sections(page["text"])

        if not page_text:
            continue

        chunks = splitter.split_text(page_text)

        for chunk_index, chunk_text in enumerate(chunks):
            all_chunks.append({
                "text": chunk_text,
                "page_number": page["page_number"],
                "chunk_index": chunk_index,
            })

    return all_chunks
