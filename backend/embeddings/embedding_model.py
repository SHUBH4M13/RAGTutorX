
from sentence_transformers import SentenceTransformer

MODEL_NAME = "BAAI/bge-base-en-v1.5"

# Load the model once and reuse it
model = SentenceTransformer(MODEL_NAME)


def generate_embeddings(texts: list[str]):
    """
    Convert a list of text chunks into normalized embedding vectors.
    """

    if not texts:
        return []

    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
        show_progress_bar=True
    )

    return embeddings.tolist()


def generate_query_embedding(query: str):
    """
    Generate an embedding for a user's search query.
    BGE recommends this instruction for retrieval queries.
    """

    query_text = (
        "Represent this sentence for searching relevant passages: "
        + query
    )

    embedding = model.encode(
        query_text,
        normalize_embeddings=True
    )

    return embedding.tolist()
