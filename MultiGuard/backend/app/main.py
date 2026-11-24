from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import reviews

app = FastAPI(
    title="MultiGuard API",
    description="Multi-domain fraud and deception detection platform",
    version="1.0.0"
)
app.include_router(reviews.router)

# Add CORS middleware for front and back-end communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to the MultiGuard API!",
        "status": "running"
        }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

@app.get("/api/test")
def test_connection():
    return {
        "success": True,
        "message": "React successfully connected to the MultiGuard backend!"
    }