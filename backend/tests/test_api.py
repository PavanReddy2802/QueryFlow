# backend/tests/test_api.py

import io
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

def test_query_no_param():
    # Missing 'q' should return 422 Validation Error
    resp = client.get("/query")
    assert resp.status_code == 422

def test_query_dummy():
    # With a simple query param, expect a JSON with matched_chunks list
    resp = client.get("/query", params={"q": "test"})
    assert resp.status_code == 200
    data = resp.json()
    assert "matched_chunks" in data
    assert isinstance(data["matched_chunks"], list)

def test_upload_non_pdf():
    # Uploading a .txt should be rejected with 400
    files = {"file": ("test.txt", io.BytesIO(b"hello"), "text/plain")}
    resp = client.post("/upload-pdf/", files=files)
    assert resp.status_code == 400
    assert resp.json()["detail"] == "Only PDFs supported."
