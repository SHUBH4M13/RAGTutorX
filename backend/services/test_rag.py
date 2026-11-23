
from services.rag_service import ask_question


if __name__ == "__main__":

    user_id = "test-user-001"
    document_id = "sample-document-001"

    question = "Explain the main concepts discussed in this chapter."

    print("\nStudent Question:")
    print(question)

    print("\nGenerating answer...")

    try:
        result = ask_question(
            question=question,
            user_id=user_id,
            document_id=document_id
        )

        print("\n========== RAGTUTORX ANSWER ==========")
        print(result["answer"])

        print("\n========== SOURCES ==========")

        for source in result["sources"]:
            print(f"\nPage: {source['page_number']}")
            print(f"Similarity: {source['score']:.4f}")
            print(f"Chunk ID: {source['chunk_id']}")

    except Exception as error:
        print("RAG pipeline failed:", str(error))
