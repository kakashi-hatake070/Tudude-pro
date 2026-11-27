import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from classification.classifier import IssueClassifier
from detection.detector import HazardDetector
from duplicate_detection.matcher import DuplicateDetector
from severity.estimator import SeverityEstimator
from risk_engine.risk_calculator import AreaRiskEngine

app = FastAPI(
    title="CityShield AI — Vision & Hazard Intelligence Microservice",
    description="Microservice providing YOLO object detection, multi-class image classification, duplicate detection, and severity estimation for civic infrastructure.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate models
classifier = IssueClassifier()
detector = HazardDetector()
duplicate_detector = DuplicateDetector()
severity_estimator = SeverityEstimator()
risk_engine = AreaRiskEngine()

class ClassifyRequest(BaseModel):
    filePath: Optional[str] = None
    hintedCategory: Optional[str] = None

class DetectHazardsRequest(BaseModel):
    filePath: Optional[str] = None
    category: Optional[str] = 'waterlogging'

class DuplicateCheckRequest(BaseModel):
    coordinates: List[float]
    category: str
    description: Optional[str] = ""
    recentReports: Optional[List[Dict[str, Any]]] = []

class SeverityRequest(BaseModel):
    filePath: Optional[str] = None
    category: str

class AreaRiskRequest(BaseModel):
    rainfallMmPerHour: float
    activeHazardsCount: int
    waterloggingHazardsCount: int
    isFloodBasin: Optional[bool] = False

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "CityShield AI Vision & Hazard Microservice",
        "version": "1.0.0",
        "models": ["VisionClassifier-v1", "HazardYOLO-v1", "DuplicateMatcher", "SeverityEstimator", "AreaRiskEngine"]
    }

@app.post("/ai/classify-issue")
def classify_issue(payload: ClassifyRequest):
    result = classifier.classify_image(payload.filePath or "", payload.hintedCategory)
    detected = detector.detect_objects(payload.filePath or "", result["category"])
    severity = severity_estimator.estimate_severity(payload.filePath or "", result["category"])
    
    return {
        **result,
        "detectedObjects": detected,
        "severity": severity
    }

@app.post("/ai/detect-hazards")
def detect_hazards(payload: DetectHazardsRequest):
    detections = detector.detect_objects(payload.filePath or "", payload.category or "waterlogging")
    return {"detectedObjects": detections, "count": len(detections)}

@app.post("/ai/detect-duplicates")
def detect_duplicates(payload: DuplicateCheckRequest):
    return duplicate_detector.check_duplicate(
        payload.coordinates,
        payload.category,
        payload.description or "",
        payload.recentReports or []
    )

@app.post("/ai/estimate-severity")
def estimate_severity(payload: SeverityRequest):
    return severity_estimator.estimate_severity(payload.filePath or "", payload.category)

@app.post("/ai/calculate-risk")
def calculate_risk(payload: AreaRiskRequest):
    return risk_engine.calculate_area_risk(
        payload.rainfallMmPerHour,
        payload.activeHazardsCount,
        payload.waterloggingHazardsCount,
        payload.isFloodBasin
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
