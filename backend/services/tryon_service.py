from sqlalchemy.orm import Session
from typing import Optional
from models import TryOnSession
from schemas import TryOnSessionCreate, TryOnSessionResponse
from datetime import datetime
import cv2
import mediapipe as mp
import numpy as np
import json
import os

class TryOnService:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
    
    async def create_session(self, db: Session, session_data: TryOnSessionCreate) -> TryOnSessionResponse:
        """Create a new try-on session"""
        db_session = TryOnSession(
            frame_id=session_data.frame_id,
            user_id=session_data.user_id,
            session_type=session_data.session_type,
            device_info=session_data.device_info,
            user_agent=session_data.user_agent,
            ip_address=session_data.ip_address
        )
        
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        return TryOnSessionResponse.from_orm(db_session)
    
    async def get_session(self, db: Session, session_id: str) -> Optional[TryOnSessionResponse]:
        """Get a try-on session by ID"""
        session = db.query(TryOnSession).filter(TryOnSession.id == session_id).first()
        if session:
            return TryOnSessionResponse.from_orm(session)
        return None
    
    async def process_tryon(self, db: Session, frame_id: str, image_path: str) -> dict:
        """Process a virtual try-on with face detection and frame overlay"""
        try:
            # Load the image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError("Could not load image")
            
            # Convert BGR to RGB
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Detect face landmarks
            face_landmarks = self._detect_face_landmarks(rgb_image)
            
            if face_landmarks is None:
                return {
                    "success": False,
                    "error": "No face detected in the image"
                }
            
            # Process the try-on
            result_image_path = await self._overlay_frame(image, face_landmarks, frame_id)
            
            # Calculate confidence score
            confidence_score = self._calculate_confidence(face_landmarks)
            
            # Create or update session
            session = db.query(TryOnSession).filter(
                TryOnSession.frame_id == frame_id,
                TryOnSession.input_image_path == image_path
            ).first()
            
            if session:
                session.result_image_path = result_image_path
                session.face_landmarks = json.dumps(face_landmarks)
                session.confidence_score = confidence_score
                session.completed_at = datetime.utcnow()
                db.commit()
            else:
                # Create new session
                new_session = TryOnSession(
                    frame_id=frame_id,
                    input_image_path=image_path,
                    result_image_path=result_image_path,
                    face_landmarks=json.dumps(face_landmarks),
                    confidence_score=confidence_score,
                    completed_at=datetime.utcnow()
                )
                db.add(new_session)
                db.commit()
            
            return {
                "success": True,
                "result_image_path": result_image_path,
                "confidence_score": confidence_score,
                "face_landmarks": face_landmarks
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _detect_face_landmarks(self, image):
        """Detect face landmarks using MediaPipe"""
        with self.mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5
        ) as face_mesh:
            results = face_mesh.process(image)
            
            if results.multi_face_landmarks:
                # Get the first face
                face_landmarks = results.multi_face_landmarks[0]
                
                # Convert to numpy array
                h, w, _ = image.shape
                landmarks = []
                for landmark in face_landmarks.landmark:
                    landmarks.append([landmark.x * w, landmark.y * h, landmark.z * w])
                
                return np.array(landmarks)
        
        return None
    
    async def _overlay_frame(self, image, face_landmarks, frame_id):
        """Overlay the frame on the face"""
        # This is a simplified implementation
        # In a real application, you would:
        # 1. Load the 3D frame model
        # 2. Align it with the face landmarks
        # 3. Render it on the image
        
        # For now, we'll just draw a simple rectangle around the eyes
        h, w, _ = image.shape
        
        # Get eye landmarks (simplified)
        left_eye = face_landmarks[33]  # Left eye corner
        right_eye = face_landmarks[362]  # Right eye corner
        
        # Calculate frame position and size
        eye_distance = np.linalg.norm(right_eye - left_eye)
        frame_width = int(eye_distance * 2.5)
        frame_height = int(eye_distance * 1.2)
        
        # Center the frame
        center_x = int((left_eye[0] + right_eye[0]) / 2)
        center_y = int((left_eye[1] + right_eye[1]) / 2)
        
        # Draw frame rectangle
        x1 = center_x - frame_width // 2
        y1 = center_y - frame_height // 2
        x2 = center_x + frame_width // 2
        y2 = center_y + frame_height // 2
        
        # Draw the frame
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 3)
        
        # Save the result
        result_path = f"static/tryon/result_{frame_id}_{datetime.utcnow().timestamp()}.jpg"
        os.makedirs(os.path.dirname(result_path), exist_ok=True)
        cv2.imwrite(result_path, image)
        
        return result_path
    
    def _calculate_confidence(self, face_landmarks):
        """Calculate confidence score for face detection"""
        # This is a simplified confidence calculation
        # In a real application, you would consider:
        # - Face pose angle
        # - Lighting conditions
        # - Image quality
        # - Landmark visibility
        
        if face_landmarks is None:
            return 0.0
        
        # Simple confidence based on landmark count
        landmark_count = len(face_landmarks)
        if landmark_count >= 468:  # Full face mesh
            return 0.9
        elif landmark_count >= 100:  # Partial face
            return 0.7
        else:
            return 0.5