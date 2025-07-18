Project Name: QueryFlow.
Description
QueryFlow is a full-stack web application that enables users to visually build and execute AI-powered workflows through a drag-and-drop interface. Users can create custom query-processing flows by connecting components such as:

User Query Input

Document Knowledge Base (PDF upload + Embedding)

LLM Engine (OpenAI GPT, Gemini)

Chat Output


SETUP AND WORKING:

🧱 Tech Stack
Layer	Tech
Frontend	React + React Flow
Backend	FastAPI
Database	ChromaDB (running on localhost:8001)
Embeddings	SentenceTransformer (local model)

backend/
├── app/
│   ├── main.py              # FastAPI main app
│   ├── routes/
│   │   ├── pdf_upload.py    # Upload + embedding logic
│   │   └── query.py         # Query logic using ChromaDB
│   └── exceptions.py        # Custom error handlers
└── requirements.txt

frontend/
├── src/
│   ├── QueryNode.js         # Handles search queries
│   ├── LLMNode.js           # Parses and summarizes chunks
│   ├── OutputNode.js        # Displays final result
│   └── App.js, index.js     # React Flow graph




 Setup Instructions:

 Commands used for starting the server:
 to start react frontend: npm start .
 for backend : uvicorn app.main:app --reload --port 8000
 to start chromaD:  chroma run --host localhost --port 8001 --path ./chroma_db

 
 Backend Setup
Navigate to backend directory:

bash
Copy
Edit
cd backend
Create virtual environment and activate:

bash
Copy
Edit
python -m venv .venv
.venv\Scripts\activate  # on Windows
Install dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Run ChromaDB separately:

bash
Copy
Edit
chroma run --path ./chroma_db
Start FastAPI server:

bash
Copy
Edit
uvicorn app.main:app --reload --port 8000


 Frontend Setup
Navigate to frontend:

bash
Copy
Edit
cd frontend
Install packages:

bash
Copy
Edit
npm install
Run the frontend:

bash
Copy
Edit
npm start
 How It Works
PDF Upload:

Go to Swagger UI or use cURL to POST to /upload-pdf/?collection_name=pavan_resume.

Extracts and splits text → generates embeddings → stores in ChromaDB.

QueryNode:

User types questions like “What are the certifications?”

Fetches top-matching chunks from ChromaDB.

LLMNode:

Takes the chunked response and the prompt.

Simulates LLM behavior (e.g., detects email, phone, skills via regex).

OutputNode:

Shows the final generated result clearly to the user.

 Example Queries
Query in QueryNode	Prompt in LLMNode	Output
"List my skills"	"What are the skills?"	 Skills: C, Python, Java...
"Show certifications"	"Certifications?"	 Certifications: Python, SFDC
"My contact info"	"What is my phone/email?"   Phone: ...,  Email: ...

 No OpenAI is used — fully local embedding.

 LLMNode uses pattern-matching, not real LLM.


Future Enhancements
Replace LLMNode logic with real LLMs (OpenAI, Gemini, etc.)

Upload and query multiple resumes.

Use real semantic search ranking in LLMNode.


Author
Sheelam Pavan Kumar
GitHub: (https://github.com/PavanReddy2802)
LinkedIn:(https://www.linkedin.com/in/sheelam-pavan-kumar/)