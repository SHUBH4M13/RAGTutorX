
from ingestion.pdf_loader import extract_text_from_pdf
from ingestion.chunker import chunk_pages


if __name__ == "__main__":

    pdf_path = "data/sampledata.pdf"

    pages = extract_text_from_pdf(pdf_path)

    chunks = chunk_pages(
        pages,
        chunk_size=500,
        chunk_overlap=100
    )

    print("Total extracted pages:", len(pages))
    print("Total generated chunks:", len(chunks))

    for chunk in chunks[:5]:
        print("\n-----------------------------")
        print("Page:", chunk["page_number"])
        print("Chunk:", chunk["chunk_index"])
        print("Text:", chunk["text"])
