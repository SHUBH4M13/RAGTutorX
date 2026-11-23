
from vectorstore.pinecone_client import initialize_pinecone


if __name__ == "__main__":
    try:
        index = initialize_pinecone()
        print("\nPinecone is ready for vector storage!")

    except Exception as error:
        print("Pinecone connection failed:", str(error))
