# CityShield AI — REST & AI API Specifications

Base URL: `http://localhost:5001/api`  
AI Microservice Base URL: `http://localhost:8000`

---

## 1. Authentication Endpoints

### Citizen Registration
- **`POST /api/auth/register`**
- **Body**: `{ "password": "string", "email": "optional@example.com" }`
- **Response 201**:
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": {
      "id": "mongo_id",
      "anonymousId": "CityGuardian_4821",
      "citizenPoints": 25,
      "badges": ["Civic Explorer"]
    }
  }
  ```

### Citizen Login
- **`POST /api/auth/login`**
- **Body**: `{ "anonymousId": "CityGuardian_4821", "password": "password" }`
- **Response 200**: User object and session JWT.

### Government Login
- **`POST /api/government/login`**
- **Body**: `{ "email": "admin@cityshield.gov.in", "password": "password" }`
- **Response 200**: Officer profile and government session JWT.

---

## 2. Civic Reporting Endpoints

### Create Report
- **`POST /api/reports`** (Supports `multipart/form-data`)
- **Fields**:
  - `category`: `waterlogging` | `potholes` | `garbage` | `damaged_roads` | `streetlights` | `drainage` | `accidents` | `other`
  - `title`: string
  - `description`: string
  - `longitude`: float
  - `latitude`: float
  - `address`: string
  - `wardNumber`: integer
  - `media`: File (optional, max 25MB)
- **Response 201**: Returns created `IssueReport` with generated tracking ID (`CS-2026-XXXX`), fuzzed approximate coordinates, and AI analysis result.

### List Reports (GIS Filtered)
- **`GET /api/reports`**
- **Query Params**:
  - `category`: string (optional)
  - `status`: string (optional)
  - `priority`: string (optional)
  - `wardNumber`: integer (optional)
  - `lng`, `lat`, `radiusKm`: Geospatial circle search (optional)
  - `bbox`: `minLng,minLat,maxLng,maxLat` Geospatial box search (optional)
  - `limit`, `page`: Pagination (default 50, 1)

### Upvote & Verify
- **`POST /api/reports/:trackingId/upvote`**
- **`POST /api/reports/:trackingId/verify`**
  - **Body**: `{ "status": "confirmed" | "disputed" | "cleared", "comments": "string" }`

---

## 3. Safe Route Planning

### Calculate Hazard-Aware Safe Route
- **`POST /api/routing/safe-route`**
- **Body**:
  ```json
  {
    "origin": [77.6234, 12.9175],
    "destination": [77.6402, 12.9698],
    "travelMode": "driving",
    "riskPreference": "lowest_risk"
  }
  ```
- **Response 200**:
  ```json
  {
    "success": true,
    "origin": { "lng": 77.6234, "lat": 12.9175 },
    "destination": { "lng": 77.6402, "lat": 12.9698 },
    "recommendedRouteId": "route-1",
    "routes": [
      {
        "routeId": "route-1",
        "label": "Primary Route",
        "distanceKm": 6.8,
        "estimatedMinutes": 18,
        "riskScore": 25,
        "riskLevel": "Low Risk",
        "hazardCount": 1,
        "warnings": [],
        "geometry": { "type": "LineString", "coordinates": [[77.6234, 12.9175], "..."] }
      }
    ],
    "disclaimer": "CityShield AI assesses road risks based on community reports..."
  }
  ```

---

## 4. Government Administration

- **`GET /api/government/dashboard/stats`** — KPI counts, department resolution rates, ward breakdowns.
- **`PATCH /api/government/reports/:trackingId/status`** — Transition status (`submitted`, `in_progress`, `resolved`), assign department, upload resolution proof photo.
- **`GET /api/government/wards`** — Ward boundary polygons and incident statistics.
- **`GET /api/government/departments`** — Department list and SLA targets.
- **`GET /api/government/audit-logs`** — Administrative audit log ledger.

---

## 5. AI Microservice Endpoints (Port 8000)

- **`POST /ai/classify-issue`**: Multi-class classification and confidence.
- **`POST /ai/detect-hazards`**: YOLO normalized bounding box object detection.
- **`POST /ai/detect-duplicates`**: Geographic distance, timestamp, and perceptual image matching.
- **`POST /ai/estimate-severity`**: Damage score (0-100), level, and water depth estimation in cm.
- **`POST /ai/calculate-risk`**: Area risk calculation combining precipitation and hazard density.
