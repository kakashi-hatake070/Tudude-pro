# Nav Bharat AI — Smart City Intelligence & Urban Safety Platform

> **Brand**: **NAV BHARAT AI**  
> **Tagline**: *"Your City. Your Safety. Your Intelligence."*  
> **Platform Classification**: Advanced Full-Stack AI/ML Smart City Intelligence & Urban Safety Platform (Indian Municipal Focus)  
> **Institution**: Vidya Knowledge Park / Vidya Institute of Creative Teaching (VICT), Meerut  
> **Lead Developer**: Kunal Sharma (Bachelor of Computer Applications — Data Science) & Core Team

---

## 🏛️ Executive Summary

**Nav Bharat AI** is an advanced, production-grade civic intelligence and urban safety platform designed specifically for the real-world infrastructure challenges of Indian cities (severe monsoon waterlogging, submerged underpasses, deep craters/potholes, overflowing solid waste, and non-functional streetlights).

The platform bridges ordinary citizens, daily commuters, and municipal authorities through:
- **Privacy-First Anonymous Citizen Identities**: Generated pseudonyms (`CityGuardian_4821`, `UrbanWatcher_2048`, `RoadObserver_9021`), automated EXIF metadata scrubbing, and coordinate fuzzing ($\pm 65\text{m}$) on public map pins.
- **Interactive OpenStreetMap GIS Map**: MapLibre GL JS engine with color-coded markers (Blue = Normal, Orange = Moderate Risk, Red = High Risk, Green = Verified Resolved, Grey = Unverified), GeoJSON flood polygons, and clustering.
- **Hazard-Aware Safe Route Planner**: Custom cost penalty engine that evaluates candidate paths against active waterlogging depth and craters within a 120-meter corridor, suggesting lower-risk alternatives.
- **Python FastAPI AI Microservice**: 5 dedicated AI modules (Multi-class Issue Classifier, YOLO Hazard Detector, Spatial-Temporal-Perceptual Duplicate Matcher, Severity/Water Depth Estimator, and Area Risk Engine).
- **Government Administration Command Center**: Role-based access control for Super Admins, Municipal Officers, and Department Engineers with SLA countdowns, ward metrics, and mandatory before/after photo resolution proof.
- **Modern Design & Telemetry UI**: Integrated components inspired by Tremor (KPI metrics, SLA trackers) and Magic UI (Bento Grids, Real-Time Alert Marquee).

---

## 👥 Core Engineering Team

| Name / Role | Department | Key Contributions |
| :--- | :--- | :--- |
| **Kunal Sharma** (Lead) | Lead AI/ML Architect & Full-Stack Systems | 5-Module FastAPI Microservice, YOLO Computer Vision, OSRM 120m Safe Routing Engine |
| **Backend & Cloud Lead** | Distributed Systems & Database Architect | Node.js Gateway, MongoDB 2dsphere Geospatial Indexing, Socket.IO Real-Time Stream |
| **Frontend & Cartography Lead**| GIS Visualization & UI/UX Specialist | MapLibre GL JS Dynamic Layers, Flood Polygon Rendering, Responsive Design System |
| **Civic Operations & Governance Lead** | Municipal SLA & Urban Workflow Lead | Municipal Command Center, Ward Escalation Matrix, Photo Proof Verification |

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, MapLibre GL JS, Lucide React, React Router v6, Socket.IO Client, Magic UI & Tremor Primitives |
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
cd cityshield-ai

# Install root, backend, and frontend dependencies
npm run install:all

# Set up Python AI microservice virtual environment
cd ai-service
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
cd ..
```

### 3. Running All Services Concurrently

```bash
# Terminal 1: AI Microservice (Port 8000)
npm run dev:ai

# Terminal 2: Backend REST & Socket.IO (Port 5001)
npm run dev:backend

# Terminal 3: Frontend Client (Port 5173)
npm run dev:frontend
```

### 4. Automated Verification Suite

To verify all 15 core system endpoints & AI models:
```bash
node verify_system.js
```

---

## 🔐 Seed Accounts & Test Credentials

The database auto-seeds a rich dataset for Indian metropolitan regions (Bengaluru Silk Board, Koramangala, Indiranagar, MG Road, Delhi NCR, Mumbai, Meerut).

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

## 🛡️ Privacy & Legal Notice

- **Independent Platform**: Nav Bharat AI is an independent civic technology initiative developed for urban safety innovation. Verified reports are shared with relevant municipal corporations.
- **Privacy Assurance**: No citizen names, phone numbers, or private emails are published. EXIF camera data is stripped immediately upon upload, and public map pins are fuzzed by $\pm 65\text{m}$ to protect residential locations.
- **Road Safety Notice**: Nav Bharat AI calculates route safety indices using real-time community reports, AI damage scans, and weather hazard models. Obey all municipal safety barricades during extreme monsoons.
