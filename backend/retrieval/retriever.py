
from embeddings.embedding_model import generate_query_embedding
from vectorstore.pinecone_client import initialize_pinecone


def retrieve_relevant_chunks(
    query: str,
    user_id: str,
    document_id: str,
    top_k: int = 5,
    similarity_threshold: float = 0.45
):
    if not query.strip():
        raise ValueError("Search query cannot be empty.")

    if not user_id or not document_id:
        raise ValueError("user_id and document_id are required.")

    # 1. Convert the question into an embedding
    query_vector = generate_query_embedding(query)

    # 2. Connect to Pinecone
    index = initialize_pinecone()

    # 3. Search within the user's namespace and document
    results = index.query(
        vector=query_vector,
        top_k=top_k,
        namespace=user_id,
        filter={
            "document_id": {"$eq": document_id}
        },
        include_metadata=True
    )

    # 4. Extract relevant chunks
    relevant_chunks = []

    for match in results.matches:
        score = match.score or 0

        if score < similarity_threshold:
            continue

        metadata = match.metadata or {}

        relevant_chunks.append({
            "chunk_id": match.id,
            "text": metadata.get("text", ""),
            "page_number": metadata.get("page_number"),
            "chunk_index": metadata.get("chunk_index"),
            "score": score
        })

    return relevant_chunks
