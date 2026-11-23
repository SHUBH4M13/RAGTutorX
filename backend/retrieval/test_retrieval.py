
from retrieval.retriever import retrieve_relevant_chunks


if __name__ == "__main__":

    user_id = "user_2"
    document_id = "fbb7fc6d-d9dc-4071-a226-a8fbe1d97cc6"

    question = "What made the peddler finally change his ways?"

    chunks = retrieve_relevant_chunks(
        query=question,
        user_id=user_id,
        document_id=document_id,
        top_k=15,
        similarity_threshold=0.0
    )

    print("\n========== RETRIEVAL DEBUG ==========")

    for i, chunk in enumerate(chunks, start=1):

        print(f"\n--- Result {i} ---")
        print("Page:", chunk["page_number"])
        print("Score:", round(chunk["score"], 4))
        print("Chunk ID:", chunk["chunk_id"])
        print("Text:", chunk["text"])

