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
   cd virtual-try-on-app
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
```bash
# Create database
createdb virtual_tryon

# Run migrations (when implemented)
alembic upgrade head
```

---

## 🚀 Features Implemented

### ✅ Core Features
- [x] Next.js frontend with modern UI
- [x] FastAPI backend with computer vision
- [x] MediaPipe face detection and landmark extraction
- [x] Image upload and processing
- [x] Real-time camera try-on interface
- [x] Frame gallery with search and filtering
- [x] Docker containerization
- [x] Database models and configuration
- [x] CORS and API configuration

### 🔄 In Progress
- [ ] 3D frame rendering with Three.js
- [ ] Advanced face alignment algorithms
- [ ] JWT authentication system
- [ ] Admin panel for frame management
- [ ] Analytics dashboard
- [ ] Cloud storage integration

### 📋 Planned Features
- [ ] 3D model generation from multiple angles
- [ ] Advanced frame fitting algorithms
- [ ] User accounts and try-on history
- [ ] Social sharing features
- [ ] Mobile app integration
- [ ] AR/VR support

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

---

## 📊 API Endpoints

### Core Endpoints
- `POST /api/process-image` - Process uploaded selfie
- `POST /api/process-camera` - Process camera frame
- `GET /api/frames` - Get available frames
- `GET /health` - Health check

### Authentication (Coming Soon)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token

### Admin (Coming Soon)
- `POST /api/admin/frames` - Create frame
- `PUT /api/admin/frames/{id}` - Update frame
- `DELETE /api/admin/frames/{id}` - Delete frame
- `GET /api/admin/analytics` - Get analytics

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- MediaPipe for face detection and landmark extraction
- Three.js for 3D rendering capabilities
- Next.js and FastAPI for the robust framework foundation
- Inspired by platforms like Luna.io and Warby Parker's virtual try-on features