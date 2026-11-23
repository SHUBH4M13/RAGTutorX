
from ingestion.pdf_loader import extract_text_from_pdf
from ingestion.chunker import chunk_pages
from embeddings.embedding_model import generate_embeddings
from vectorstore.vector_store import store_chunks


if __name__ == "__main__":

    # Replace with your actual PDF filename
    pdf_path = "data/sampledata.pdf"

    # Temporary test identities
    user_id = "test-user-001"
    document_id = "sample-document-001"

    # 1. Extract PDF text
    print("\nStep 1: Extracting PDF text...")
    pages = extract_text_from_pdf(pdf_path)

    # 2. Generate chunks
    print("\nStep 2: Generating chunks...")
    chunks = chunk_pages(
        pages,
        chunk_size=500,
        chunk_overlap=100
    )

    # 3. Generate embeddings
    print("\nStep 3: Generating embeddings...")
    texts = [chunk["text"] for chunk in chunks]
    embeddings = generate_embeddings(texts)

    # 4. Store vectors in Pinecone
    print("\nStep 4: Uploading to Pinecone...")

    total = store_chunks(
        chunks=chunks,
        embeddings=embeddings,
        user_id=user_id,
        document_id=document_id
    )

    print("\nPipeline completed!")
    print("Pages processed:", len(pages))
    print("Chunks generated:", len(chunks))
    print("Vectors uploaded:", total)
