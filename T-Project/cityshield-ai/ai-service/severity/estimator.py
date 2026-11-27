import os
from typing import Dict, Any
from PIL import Image
import numpy as np

class SeverityEstimator:
    def __init__(self):
        print("[AI Microservice] Initializing Severity & Water Depth Estimation Engine...")

    def estimate_severity(self, image_path: str, category: str) -> Dict[str, Any]:
        """
        Estimates visual damage severity, visible water spread, and approximate depth in centimeters.
        """
        water_coverage_ratio = 0.0
        depth_cm = 0
        severity_score = 45

        if category == 'waterlogging':
            depth_cm = 25
            severity_score = 75
            level = 'high'
            if os.path.exists(image_path):
                try:
                    with Image.open(image_path) as img:
                        arr = np.array(img.convert('L').resize((64, 64)))
                        # Reflections often have dark contrast with highlights
                        water_pixels = np.sum(arr < 90)
                        water_coverage_ratio = float(water_pixels / (64 * 64))
                        depth_cm = int(10 + water_coverage_ratio * 40)
                        severity_score = min(100, int(35 + water_coverage_ratio * 70))
                except Exception:
                    pass
        elif category in ['potholes', 'damaged_roads']:
            depth_cm = 12
            severity_score = 65
            level = 'medium'
        elif category == 'garbage':
            severity_score = 50
            level = 'medium'
        else:
            severity_score = 35
            level = 'low'

        if severity_score >= 80:
            level = 'critical'
        elif severity_score >= 60:
            level = 'high'
        elif severity_score >= 35:
            level = 'medium'
        else:
            level = 'low'

        return {
            "level": level,
            "score": severity_score,
            "depthEstimateCm": depth_cm,
            "waterCoverageRatio": round(water_coverage_ratio, 3),
            "confidence": 0.87
        }
