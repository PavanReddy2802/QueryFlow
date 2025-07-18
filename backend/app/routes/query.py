# app/routes/query.py
from fastapi import APIRouter, Query, HTTPException
import chromadb

router = APIRouter()

# ✅ Connect to Chroma running on port 8001
chroma_client = chromadb.HttpClient(host="localhost", port=8001)

@router.get("/query")
def query_knowledge_base(q: str = Query(...), collection_name: str = Query(...)):
    try:
        collection = chroma_client.get_collection(name=collection_name)
    except Exception:
        raise HTTPException(status_code=404, detail=f"Collection '{collection_name}' not found.")

    result = collection.query(
        query_texts=[q],
        n_results=5
    )

    return {
        "query": q,
        "matched_chunks": result["documents"][0],
        "matched_ids": result["ids"][0],
        "message": "✅ Top relevant chunks returned using local embeddings."
    } 