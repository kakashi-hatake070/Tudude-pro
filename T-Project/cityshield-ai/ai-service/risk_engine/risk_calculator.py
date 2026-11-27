from typing import Dict, Any, List

class AreaRiskEngine:
    def __init__(self):
        print("[AI Microservice] Initializing Area Risk & Rainfall Hazard Engine...")

    def calculate_area_risk(
        self,
        rainfall_mm_per_hour: float,
        active_hazards_count: int,
        waterlogging_hazards_count: int,
        is_flood_basin: bool = False
    ) -> Dict[str, Any]:
        """
        Calculates composite area safety risk index (0 to 100)
        from precipitation, hazard density, and historical drainage capacity.
        """
        base_score = 15.0

        # Rainfall factor: heavy rain in Indian urban areas rapidly floods low points
        if rainfall_mm_per_hour > 25.0:
            base_score += 40.0
        elif rainfall_mm_per_hour > 10.0:
            base_score += 25.0
        elif rainfall_mm_per_hour > 2.0:
            base_score += 10.0

        # Active hazards multiplier
        base_score += waterlogging_hazards_count * 12.0
        base_score += (active_hazards_count - waterlogging_hazards_count) * 4.0

        # Geographical terrain flood basin indicator
        if is_flood_basin:
            base_score += 20.0

        risk_score = min(100.0, max(5.0, base_score))

        if risk_score >= 70.0:
            risk_level = "High Risk"
            recommendation = "Severe waterlogging or road damage reported. Avoid travel or detour via elevated corridors."
        elif risk_score >= 35.0:
            risk_level = "Moderate Risk"
            recommendation = "Caution advised. Moderate potholes and localized puddle accumulation."
        else:
            risk_level = "Low Risk"
            recommendation = "Standard urban driving conditions. No severe disruptions reported."

        return {
            "riskScore": round(risk_score, 1),
            "riskLevel": risk_level,
            "recommendation": recommendation,
            "factors": {
                "rainfallMmPerHour": rainfall_mm_per_hour,
                "waterloggingIncidents": waterlogging_hazards_count,
                "otherHazards": active_hazards_count - waterlogging_hazards_count,
                "isFloodBasin": is_flood_basin
            }
        }
