
import os
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "ragtutorx-index")
DIMENSION = int(os.getenv("EMBEDDING_DIMENSION", "768"))
CLOUD = os.getenv("PINECONE_CLOUD", "aws")
REGION = os.getenv("PINECONE_REGION", "us-east-1")

if not API_KEY:
    raise ValueError("PINECONE_API_KEY is missing from .env")

pc = Pinecone(api_key=API_KEY)


def initialize_pinecone():
    # Check whether the index already exists
    if not pc.has_index(INDEX_NAME):
        print(f"Creating Pinecone index: {INDEX_NAME}")

        pc.create_index(
            name=INDEX_NAME,
            dimension=DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(
                cloud=CLOUD,
                region=REGION
            )
        )

        print("Index created successfully.")

    else:
        print(f"Index '{INDEX_NAME}' already exists.")

    index = pc.Index(INDEX_NAME)

    # Verify the index configuration
    stats = index.describe_index_stats()

    print("\nPinecone connection successful!")
    print("Index name:", INDEX_NAME)
    print("Vector dimension:", DIMENSION)
    print("Index statistics:", stats)

    return index
