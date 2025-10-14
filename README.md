# 🕶️ Virtual Try-On Web App

A **production-ready Virtual Try-On application** that allows users to try eyewear frames virtually — either by uploading a selfie or using their webcam for real-time augmented reality preview.  
Inspired by platforms like **Luna.io**, this app combines **Next.js**, **3D modeling**, and **computer vision** to deliver a realistic and scalable try-on experience.

---

## 🚀 Project Overview

This project enables users to:
1. **Upload a selfie** and see themselves wearing selected frames.  
2. **Try on frames in real-time** using webcam-based facial tracking.  

It also supports **3D model generation** of frames using multiple angle images (currently 6 JPG images per frame).

---

## 🧱 Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **UI & Animations:** Tailwind CSS + Framer Motion
- **3D Rendering:** Three.js / React Three Fiber
- **Face Tracking:** MediaPipe / TensorFlow.js
- **State Management:** Zustand or Redux Toolkit

### Backend
- **Language:** Python (**preferred**) for better ML/Computer Vision support  
  _(Optionally, Node.js can be used if preferred for consistency across stack)_
- **Framework:** FastAPI (or Flask alternative)
- **Computer Vision & ML Libraries:** OpenCV, MediaPipe, Dlib, PyTorch (for 3D fitting)
- **Storage:** AWS S3 or Cloudinary (for images, processed results, and 3D assets)
- **Database:** PostgreSQL or MongoDB (for frame metadata, user history)
- **Job Queue:** Celery (for Python) or BullMQ (for Node.js) for async processing

---

## 🧩 Core Features

### 🕶️ Frame 3D Model Generation
- Each frame consists of **6 high-resolution JPG images** taken from different angles.
- The backend generates a **3D model (GLB/GLTF format)** using:
  - Photogrammetry tools (OpenMVG, OpenMVS, or Meshroom)
  - Or ML-based 3D reconstruction (PyTorch3D / Blender Python API)
- Optimized models (<5MB) are rendered using Three.js on frontend.

### 📸 Option A — Selfie Upload Try-On
- User uploads a front-facing selfie.
- Backend processes:
  - Detects face landmarks (eyes, nose bridge, ears)
  - Aligns and scales the selected frame's 3D model to fit the face
- Returns a generated image: **user + eyewear** composite.

### 🎥 Option B — Real-Time Try-On
- Users activate their webcam.
- The app uses **MediaPipe FaceMesh** (468+ facial landmarks) for tracking.
- The frame model dynamically overlays the user's face in real-time.
- Includes "**Take Snapshot**" button to capture try-on preview.

---

## 🧑‍💻 Admin Panel
- Upload and manage frame images (6-angle JPGs)
- Auto-generate and preview 3D models
- Analytics dashboard:
  - Number of try-ons (upload/live)
  - Frame popularity
  - Conversion rates per frame

---

## 🔒 Security & Deployment
- JWT-based authentication (users/admin)
- HTTPS + secure CORS configuration
- Docker-based deployment
- CDN for asset delivery
- Cloud hosting options:
  - DigitalOcean App Platform (preferred)
  - AWS / GCP alternatives

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL or MongoDB
- AWS S3 / Cloudinary account for image storage
- (Optional) Blender for local 3D model generation

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd virtual-tryon
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:3000/admin

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Run database migrations
alembic upgrade head

# Start the backend
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Celery Worker (for 3D model generation)
```bash
cd backend
celery -A tasks worker --loglevel=info
```

---

## 📁 Project Structure

```
virtual-tryon/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   │   ├── admin/          # Admin panel pages
│   │   │   ├── frames/     # Frame management
│   │   │   ├── models/     # 3D model management
│   │   │   └── analytics/  # Analytics dashboard
│   │   ├── try-on/         # Virtual try-on interface
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable React components
│   └── services/           # API service functions
├── backend/                # FastAPI backend application
│   ├── services/          # Business logic services
│   ├── models/            # Database models
│   ├── schemas/           # Pydantic schemas
│   ├── tasks.py           # Celery tasks
│   └── main.py            # FastAPI application
├── docker-compose.yml     # Multi-service Docker setup
└── README.md
```

---

## 🎯 Key Features Implemented

### ✅ Admin Panel
- **Frame Management**: Upload frame images from 6 different angles
- **3D Model Generation**: Automatic 3D model creation from uploaded images
- **Model Preview**: Interactive 3D model viewer with Three.js
- **Analytics Dashboard**: Track frame performance and user engagement
- **Real-time Status**: Monitor processing status of 3D model generation

### ✅ Virtual Try-On
- **Camera Integration**: Real-time webcam feed for live try-on
- **Photo Upload**: Upload selfie for virtual try-on
- **Frame Selection**: Browse and select from available frames
- **3D Preview**: Interactive 3D model preview
- **Face Detection**: MediaPipe-based facial landmark detection

### ✅ Backend API
- **RESTful API**: Complete CRUD operations for frames and models
- **File Upload**: Multi-angle image upload with validation
- **3D Processing**: Asynchronous 3D model generation with Celery
- **Face Detection**: OpenCV and MediaPipe integration
- **Database**: PostgreSQL with SQLAlchemy ORM

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/virtual_tryon

# Redis (for Celery)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=virtual-tryon-assets
```

---

## 🚀 Deployment

### Production Deployment

1. **Set up production environment variables**
2. **Configure reverse proxy (Nginx)**
3. **Set up SSL certificates**
4. **Deploy with Docker Compose**

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📊 API Endpoints

### Frame Management
- `POST /api/frames` - Create new frame
- `GET /api/frames` - List all frames
- `GET /api/frames/{id}` - Get specific frame
- `PUT /api/frames/{id}` - Update frame
- `DELETE /api/frames/{id}` - Delete frame

### 3D Models
- `GET /api/models` - List all 3D models
- `GET /api/models/{id}` - Get specific model
- `POST /api/models/{frame_id}/generate` - Generate 3D model
- `GET /api/models/{id}/download` - Download model file

### Try-On
- `POST /api/tryon/sessions` - Create try-on session
- `POST /api/tryon/process` - Process try-on with image

### Analytics
- `GET /api/analytics/overview` - Get overview statistics
- `GET /api/analytics/frames` - Get frame performance data

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Three.js** for 3D rendering capabilities
- **MediaPipe** for facial landmark detection
- **FastAPI** for the robust backend framework
- **Next.js** for the modern frontend framework