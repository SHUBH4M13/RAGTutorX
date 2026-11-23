
from vectorstore.pinecone_client import initialize_pinecone


def store_chunks(
    chunks,
    embeddings,
    user_id,
    document_id,
    batch_size=100
):
    if len(chunks) != len(embeddings):
        raise ValueError("Number of chunks and embeddings must match.")

    if not user_id or not document_id:
        raise ValueError("user_id and document_id are required.")

    index = initialize_pinecone()

    # Use a separate namespace for each user
    namespace = user_id

    records = []

    for chunk, embedding in zip(chunks, embeddings):
        record = {
            "id": (
                f"{document_id}-"
                f"page{chunk['page_number']}-"
                f"chunk{chunk['chunk_index']}"
            ),
            "values": embedding,
            "metadata": {
                "user_id": user_id,
                "document_id": document_id,
                "page_number": chunk["page_number"],
                "chunk_index": chunk["chunk_index"],
                "text": chunk["text"]
            }
        }

        records.append(record)

    # Upload in batches
    for start in range(0, len(records), batch_size):
        batch = records[start:start + batch_size]

        index.upsert(
            vectors=batch,
            namespace=namespace
        )

        print(
            f"Uploaded {min(start + batch_size, len(records))}"
            f"/{len(records)} vectors"
        )

    print("\nAll vectors stored successfully!")

    return len(records)
