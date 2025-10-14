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
  - Aligns and scales the selected frame’s 3D model to fit the face
- Returns a generated image: **user + eyewear** composite.

### 🎥 Option B — Real-Time Try-On
- Users activate their webcam.
- The app uses **MediaPipe FaceMesh** (468+ facial landmarks) for tracking.
- The frame model dynamically overlays the user’s face in real-time.
- Includes “**Take Snapshot**” button to capture try-on preview.

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
