
import uuid
import shutil

from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse

from ingestion.pdf_loader import extract_text_from_pdf
from ingestion.chunker import chunk_pages
from embeddings.embedding_model import generate_embeddings
from vectorstore.vector_store import store_chunks

from api.schemas import ChatRequest
from fastapi.middleware.cors import CORSMiddleware
from services.rag_service import ask_question


app = FastAPI(
    title="RAGTutorX API",
    description="Textbook-based RAG Question Answering System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB


@app.get("/")
def home():
    return {
        "message": "Welcome to RAGTutorX API",
        "status": "running"
    }


@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):

    if not file.filename or Path(file.filename).suffix.lower() != ".pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    document_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{document_id}.pdf"

    try:
        # Read and validate the uploaded file
        content = await file.read(MAX_FILE_SIZE + 1)

        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="PDF exceeds the 20 MB limit."
            )

        if not content.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=400,
                detail="Invalid PDF file."
            )

        file_path.write_bytes(content)

        # 1. Extract text
        pages = extract_text_from_pdf(str(file_path))

        if not pages:
            raise HTTPException(
                status_code=400,
                detail="No extractable text found in this PDF."
            )

        # 2. Generate chunks
        chunks = chunk_pages(
            pages,
            chunk_size=500,
            chunk_overlap=100
        )

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="Could not generate text chunks."
            )

        # 3. Generate embeddings
        texts = [chunk["text"] for chunk in chunks]
        embeddings = generate_embeddings(texts)

        # 4. Store vectors in Pinecone
        total_vectors = store_chunks(
            chunks=chunks,
            embeddings=embeddings,
            user_id=user_id,
            document_id=document_id
        )

        return {
            "message": "PDF uploaded and processed successfully.",
            "document_id": document_id,
            "user_id": user_id,
            "total_pages": len(pages),
            "total_chunks": len(chunks),
            "total_vectors": total_vectors
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="PDF processing failed. Check the backend logs."
        )

    finally:
        # Remove temporary PDF after processing
        if file_path.exists():
            file_path.unlink()

        await file.close()


@app.post("/api/chat/ask")
def chat(request: ChatRequest):

    try:
        result = ask_question(
            question=request.question,
            user_id=request.user_id,
            document_id=request.document_id
        )

        return JSONResponse(content=result)

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate an answer. Check the backend logs."
        )
