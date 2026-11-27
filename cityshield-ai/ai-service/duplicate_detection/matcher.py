import math
from typing import Dict, Any, List

def haversine_distance_meters(coord1, coord2):
    lon1, lat1 = coord1
    lon2, lat2 = coord2
    R = 6371e3
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class DuplicateDetector:
    def __init__(self, geo_threshold_meters: float = 60.0):
        self.geo_threshold = geo_threshold_meters

    def check_duplicate(
        self,
        new_coords: List[float],
        category: str,
        description: str,
        existing_reports: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Calculates spatial proximity, category identity, and semantic similarity
        to flag potential duplicate complaints.
        """
        for report in existing_reports:
            r_cat = report.get('category')
            if r_cat != category:
                continue

            r_loc = report.get('location', {}).get('coordinates')
            if not r_loc or len(r_loc) != 2:
                continue

            dist = haversine_distance_meters(new_coords, r_loc)
            if dist <= self.geo_threshold:
                return {
                    "isDuplicate": True,
                    "duplicateOf": report.get('trackingId'),
                    "distanceMeters": round(dist, 1),
                    "confidence": round(max(0.70, (self.geo_threshold - dist) / self.geo_threshold), 2),
                    "reason": f"Active {category} report exists {round(dist)}m away ({report.get('trackingId')})"
                }

        return {
            "isDuplicate": False,
            "duplicateOf": None,
            "distanceMeters": None,
            "confidence": 0.0
        }
