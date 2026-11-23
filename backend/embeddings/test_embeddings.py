
from ingestion.pdf_loader import extract_text_from_pdf
from ingestion.chunker import chunk_pages
from embeddings.embedding_model import generate_embeddings


if __name__ == "__main__":

    pdf_path = "data/your_actual_filename.pdf"

    # Step 1: Extract PDF text
    pages = extract_text_from_pdf(pdf_path)

    # Step 2: Generate chunks
    chunks = chunk_pages(
        pages,
        chunk_size=500,
        chunk_overlap=100
    )

    # Step 3: Extract chunk text
    chunk_texts = [chunk["text"] for chunk in chunks]

    # Step 4: Generate embeddings
    vectors = generate_embeddings(chunk_texts)

    # Step 5: Verify
    print("\nTotal chunks:", len(chunks))
    print("Total embeddings:", len(vectors))

    if vectors:
        print("Vector dimension:", len(vectors[0]))
        print("First vector:", vectors[0][:10])
