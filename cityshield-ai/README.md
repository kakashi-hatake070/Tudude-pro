# CityShield AI — Smart City Intelligence & Urban Safety Platform

> **Tagline**: *"Your City. Your Safety. Your Intelligence."*  
> **Platform Classification**: Advanced Full-Stack AI/ML Smart City Intelligence & Urban Safety Platform (Indian Municipal Focus)

---

## 🏛️ Executive Summary

**CityShield AI** is a production-grade, AI-powered civic intelligence and urban safety platform designed specifically for the real-world infrastructure challenges of Indian cities (waterlogging, dangerous potholes, garbage accumulation, dark streets, and monsoonal flood risks).

The platform bridges ordinary citizens, daily commuters, and municipal authorities through:
- **Privacy-First Anonymous Citizen Identities**: Unique generated pseudonyms (`CityGuardian_4821`, `UrbanWatcher_2048`, `RoadObserver_9021`), EXIF metadata scrubbing, and coordinate fuzzing (±65m) on public layers.
- **Interactive GIS Map with Hazard Scoring**: MapLibre GL JS engine with color-coded markers (Blue = Normal, Orange = Moderate Risk, Red = High Risk, Green = Verified Resolved, Grey = Unverified), GeoJSON flood polygons, and clustering.
- **Hazard-Aware Safe Route Planner**: Custom cost penalty engine that evaluates candidate paths against active waterlogging depth and craters within 120m corridors, suggesting lower-risk alternatives.
- **Python FastAPI AI Microservice**: 5 dedicated AI modules (Multi-class Issue Classifier, YOLO Hazard Detector, Spatial-Temporal-Perceptual Duplicate Matcher, Severity/Water Depth Estimator, and Area Risk Engine).
- **Government Administration Command Center**: Role-based access control for Super Admins, Municipal Officers, and Department Engineers with SLA tracking, ward metrics, and mandatory photo resolution proof.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, MapLibre GL JS, Lucide React, React Router v6, Socket.IO Client |
| **Backend API Gateway** | Node.js, Express.js, Socket.IO, JWT Authentication, Multer (EXIF Sanitized), Helmet, CORS |
| **Database & GIS** | MongoDB with Mongoose ODM, GeoJSON Point & Polygon models, 2dsphere Geospatial Indexing (with auto-managed `mongodb-memory-server` fallback) |
| **AI/ML Microservice** | Python 3.9+, FastAPI, Uvicorn, Pillow, NumPy, PyTorch / Vision Heuristics, ImageHash |
| **Mapping & Routing** | MapLibre GL, Carto Positron vector tiles, OpenStreetMap, OSRM routing engine |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ (tested on Node.js v20 / v26)
- Python 3.9+ with pip and venv

### 2. Installation

```bash
# Clone repository
cd cityshield-ai

# Install root, backend, and frontend dependencies
npm run install:all

# Set up Python AI microservice virtual environment
cd ai-service
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
cd ..
```

### 3. Running All Services

#### Option A: Run Services Concurrently

```bash
# Terminal 1: AI Microservice (Port 8000)
npm run dev:ai

# Terminal 2: Backend REST & Socket.IO (Port 5001)
npm run dev:backend

# Terminal 3: Frontend Client (Port 5173)
npm run dev:frontend
```

#### Option B: Automated Verification Suite

To verify all 15 core modules, run:
```bash
node verify_system.js
```

---

## 🔐 Seed Accounts & Test Credentials

The database auto-seeds a rich dataset for Bengaluru (Silk Board, Koramangala, Indiranagar, MG Road).

### Government Officers
| Role | Email | Password | Jurisdiction |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@cityshield.gov.in` | `Admin@1234` | Greater Bengaluru Municipal Corporation |
| **Municipal Officer** | `officer@cityshield.gov.in` | `Admin@1234` | Central Zone Wards 100-115 |
| **Roads Officer** | `roads.officer@cityshield.gov.in` | `Admin@1234` | Roads & Major Infrastructure |

### Demo Citizens
| Anonymous ID | Password | Points | Badges |
| :--- | :--- | :--- | :--- |
| `CityGuardian_4821` | `Citizen@123` | 85 pts | Flood Watcher, Top Verifier |
| `UrbanWatcher_2048` | `Citizen@123` | 120 pts | Road Sentinel, Community Hero |
| `RoadObserver_9021` | `Citizen@123` | 40 pts | Civic Explorer |

---

## 🗺️ Application Routes

### Public Pages
- `/` — Modern Smart City Landing Page
- `/live-map` — Interactive GIS Map with filters & detail drawer
- `/safe-routes` — AI Hazard-Avoidance Route Planner
- `/report` — Citizen Issue Submission with AI preview review
- `/explore` — Sector Location Intelligence & Emergency Facilities
- `/about` — Architecture & Mission Overview
- `/how-it-works` — 5-Step Operational Lifecycle
- `/login` — Citizen Anonymous Login
- `/register` — 1-Click Anonymous Identity Generator

### Citizen Protected Pages
- `/citizen/dashboard` — Points, Badges, and My Reports
- `/citizen/reports` — Historical Report Timeline
- `/citizen/notifications` — Real-Time Hazard Alerts
- `/citizen/profile` — Privacy Shields & Commute Settings

### Government Protected Pages
- `/government/login` — Official Portal Login
- `/government/dashboard` — City-wide KPI Dashboard & Department SLAs
- `/government/reports` — Complaint Assignment & Work Order Queue
- `/government/map` — Municipal GIS Command Center
- `/government/departments` — Department SLA Directory
- `/government/wards` — Ward Directory & Risk Indices
- `/government/analytics` — Infrastructure Failure Analytics
- `/government/audit-logs` — Administrative Audit Trail

---

## 🛡️ Privacy & Legal Disclaimer

- **Independent Platform**: CityShield AI is an independent civic technology initiative, not an official government agency. Verified reports are shared with relevant municipal corporations.
- **Privacy Assurance**: No citizen names, phone numbers, or private emails are published. EXIF camera data is stripped immediately upon upload, and public map pins are fuzzed by ±65m to protect residential locations.
- **Road Safety Notice**: CityShield AI calculates route safety indices using real-time community reports, AI damage scans, and weather hazard models. Road conditions can change rapidly during heavy monsoon showers. Proceed with caution and obey municipal safety barricades.
