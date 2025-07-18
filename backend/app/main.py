from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pdf_upload, query  # ✅ make sure both are imported

app = FastAPI()

# Register your exception handlers if used
from .exceptions import register_exception_handlers
register_exception_handlers(app)

# ✅ Add CORS if frontend is used
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ✅ ✅ MOST IMPORTANT: Include your route modules
app.include_router(pdf_upload.router)
app.include_router(query.router)

@app.get("/health")
def health():
    return {"status": "ok"}  