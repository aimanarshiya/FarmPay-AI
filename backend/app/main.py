
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FarmPay AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to FarmPay AI"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/message")
def get_message():
    return {
        "message": "Welcome to FarmPay AI!",
        "description": "Smarter Farming. Better Selling. Simpler Payments.",
        "backend": "FastAPI connected successfully",
    }
