from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
import cv2
import numpy as np
from PIL import Image
import mediapipe as mp
import base64
from io import BytesIO
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Virtual Try-On API",
    description="AI-powered virtual try-on for eyewear frames",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Create directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("processed", exist_ok=True)
os.makedirs("static", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

class FaceDetector:
    def __init__(self):
        self.face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
    
    def detect_face_landmarks(self, image: np.ndarray):
        """Detect face landmarks using MediaPipe"""
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_image)
        
        if results.multi_face_landmarks:
            return results.multi_face_landmarks[0]
        return None
    
    def get_eye_landmarks(self, landmarks):
        """Extract eye landmarks for frame positioning"""
        # MediaPipe face mesh eye indices
        left_eye_indices = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
        right_eye_indices = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
        
        h, w = 480, 640  # Default dimensions, will be updated
        
        left_eye_points = []
        right_eye_points = []
        
        for idx in left_eye_indices:
            if idx < len(landmarks.landmark):
                x = int(landmarks.landmark[idx].x * w)
                y = int(landmarks.landmark[idx].y * h)
                left_eye_points.append([x, y])
        
        for idx in right_eye_indices:
            if idx < len(landmarks.landmark):
                x = int(landmarks.landmark[idx].x * w)
                y = int(landmarks.landmark[idx].y * h)
                right_eye_points.append([x, y])
        
        return left_eye_points, right_eye_points

face_detector = FaceDetector()

@app.get("/")
async def root():
    return {"message": "Virtual Try-On API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "virtual-try-on-api"}

@app.post("/api/process-image")
async def process_image(
    file: UploadFile = File(...),
    frame_id: Optional[str] = None
):
    """Process uploaded image for virtual try-on"""
    try:
        # Read and validate image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Detect face landmarks
        landmarks = face_detector.detect_face_landmarks(image)
        if landmarks is None:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Get eye landmarks
        left_eye, right_eye = face_detector.get_eye_landmarks(landmarks)
        
        if not left_eye or not right_eye:
            raise HTTPException(status_code=400, detail="Could not detect eye landmarks")
        
        # Calculate frame position
        left_eye_center = np.mean(left_eye, axis=0)
        right_eye_center = np.mean(right_eye, axis=0)
        
        # Calculate frame dimensions and position
        eye_distance = np.linalg.norm(left_eye_center - right_eye_center)
        frame_width = int(eye_distance * 2.2)
        frame_height = int(frame_width * 0.4)
        
        frame_center_x = int((left_eye_center[0] + right_eye_center[0]) / 2)
        frame_center_y = int((left_eye_center[1] + right_eye_center[1]) / 2)
        
        # Create frame overlay (simplified rectangle for demo)
        overlay = image.copy()
        cv2.rectangle(
            overlay,
            (frame_center_x - frame_width//2, frame_center_y - frame_height//2),
            (frame_center_x + frame_width//2, frame_center_y + frame_height//2),
            (0, 0, 255),  # Red frame
            3
        )
        
        # Add frame details
        cv2.putText(
            overlay,
            f"Frame ID: {frame_id or 'Default'}",
            (frame_center_x - frame_width//2, frame_center_y - frame_height//2 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2
        )
        
        # Save processed image
        processed_filename = f"processed_{file.filename}"
        processed_path = f"processed/{processed_filename}"
        cv2.imwrite(processed_path, overlay)
        
        # Convert to base64 for response
        _, buffer = cv2.imencode('.jpg', overlay)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return {
            "success": True,
            "processed_image": f"data:image/jpeg;base64,{img_base64}",
            "face_detected": True,
            "frame_position": {
                "center_x": frame_center_x,
                "center_y": frame_center_y,
                "width": frame_width,
                "height": frame_height
            },
            "landmarks": {
                "left_eye": left_eye,
                "right_eye": right_eye
            }
        }
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/api/process-camera")
async def process_camera_frame(
    image_data: str,  # Base64 encoded image
    frame_id: Optional[str] = None
):
    """Process camera frame for real-time try-on"""
    try:
        # Decode base64 image
        image_data = image_data.split(',')[1]  # Remove data:image/jpeg;base64, prefix
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Detect face landmarks
        landmarks = face_detector.detect_face_landmarks(image)
        if landmarks is None:
            return {
                "success": False,
                "face_detected": False,
                "message": "No face detected"
            }
        
        # Get eye landmarks
        left_eye, right_eye = face_detector.get_eye_landmarks(landmarks)
        
        if not left_eye or not right_eye:
            return {
                "success": False,
                "face_detected": True,
                "message": "Could not detect eye landmarks"
            }
        
        # Calculate frame position
        left_eye_center = np.mean(left_eye, axis=0)
        right_eye_center = np.mean(right_eye, axis=0)
        
        eye_distance = np.linalg.norm(left_eye_center - right_eye_center)
        frame_width = int(eye_distance * 2.2)
        frame_height = int(frame_width * 0.4)
        
        frame_center_x = int((left_eye_center[0] + right_eye_center[0]) / 2)
        frame_center_y = int((left_eye_center[1] + right_eye_center[1]) / 2)
        
        return {
            "success": True,
            "face_detected": True,
            "frame_position": {
                "center_x": frame_center_x,
                "center_y": frame_center_y,
                "width": frame_width,
                "height": frame_height
            },
            "landmarks": {
                "left_eye": left_eye,
                "right_eye": right_eye
            }
        }
        
    except Exception as e:
        logger.error(f"Error processing camera frame: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing camera frame: {str(e)}")

@app.get("/api/frames")
async def get_frames():
    """Get available frames"""
    # Mock frame data - in production, this would come from a database
    frames = [
        {
            "id": "1",
            "name": "Classic Black",
            "brand": "Ray-Ban",
            "price": 159,
            "category": "sunglasses",
            "image_url": "/static/frames/classic_black.jpg",
            "model_url": "/static/models/classic_black.glb"
        },
        {
            "id": "2",
            "name": "Aviator Gold",
            "brand": "Oakley",
            "price": 189,
            "category": "sunglasses",
            "image_url": "/static/frames/aviator_gold.jpg",
            "model_url": "/static/models/aviator_gold.glb"
        },
        {
            "id": "3",
            "name": "Modern Blue",
            "brand": "Warby Parker",
            "price": 95,
            "category": "prescription",
            "image_url": "/static/frames/modern_blue.jpg",
            "model_url": "/static/models/modern_blue.glb"
        }
    ]
    
    return {"frames": frames}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)