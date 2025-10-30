import logging
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any
import pandas as pd
import joblib  # <-- joblib instead of pickle
import os

MODEL_PATH = '/ml-model/model.pkl'  # Updated model storage path
LOG_DIR = '/app/logs'
LOG_FILE = os.path.join(LOG_DIR, 'backend.log')
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    handlers=[logging.FileHandler(LOG_FILE), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI()

class AnalyzeRequest(BaseModel):
    logs: List[str]

class AnalyzeResponse(BaseModel):
    root_cause_category: str
    confidence: float
    features: Dict[str, Any]

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    return response

@app.get("/health")
def health():
    logger.info("Health check requested.")
    return {"status": "ok"}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(data: AnalyzeRequest):
    logs = data.logs
    logger.info(f"/analyze - Request logs: {logs}")
    if not logs:
        logger.error("/analyze - No logs provided.")
        raise HTTPException(status_code=400, detail="No logs provided.")
    # Feature extraction
    error_count = sum('error' in line.lower() for line in logs)
    warning_count = sum('warning' in line.lower() for line in logs)
    info_count = sum('info' in line.lower() for line in logs)
    log_length = len(logs)
    features = {
        "error_count": error_count,
        "warning_count": warning_count,
        "info_count": info_count,
        "log_length": log_length
    }
    df = pd.DataFrame([features])
    # Load model
    if not os.path.exists(MODEL_PATH):
        logger.error("/analyze - Model file not found.")
        raise HTTPException(status_code=500, detail="Model not found.")
    model = joblib.load(MODEL_PATH)
    pred_proba = model.predict_proba(df)[0]
    pred_idx = pred_proba.argmax()
    pred_label = model.classes_[pred_idx]
    confidence = float(pred_proba[pred_idx])
    logger.info(f"/analyze - Prediction: category={pred_label}, confidence={confidence:.4f}, features={features}")
    return AnalyzeResponse(
        root_cause_category=str(pred_label),
        confidence=confidence,
        features=features
    )
