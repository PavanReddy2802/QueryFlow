# app/routes/pdf_upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
import fitz  # PyMuPDF
import uuid
import chromadb
from sentence_transformers import SentenceTransformer

router = APIRouter()

# ✅ Load local embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# ✅ Connect to external Chroma server on port 8001
chroma_client = chromadb.HttpClient(host="localhost", port=8001)

# ✅ Simple text splitter
def split_text(text, max_tokens=200):
    return [text[i:i + max_tokens] for i in range(0, len(text), max_tokens)]

@router.post("/upload-pdf/")
async def upload_pdf(
    file: UploadFile = File(...),
    collection_name: str = Query(..., description="Name of the collection to store the embeddings")
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDFs are supported.")

    contents = await file.read()
    text = ""

    try:
        with fitz.open(stream=contents, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF error: {str(e)}")

    chunks = split_text(text, max_tokens=500)
    if not chunks:
        raise HTTPException(status_code=400, detail="No text to embed.")

    try:
        collection = chroma_client.get_or_create_collection(name=collection_name)
        embeddings = embedding_model.encode(chunks)

        for i, chunk in enumerate(chunks):
            collection.add(
                embeddings=[embeddings[i].tolist()],
                documents=[chunk],
                ids=[str(uuid.uuid4())]
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding error: {str(e)}")

    return {
        "filename": file.filename,
        "text_chunks": len(chunks),
        "collection": collection_name,
        "message": f"✅ PDF embedded using local model into collection '{collection_name}'"
    }  