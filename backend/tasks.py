from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv()

# Celery configuration
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

# Create Celery app
celery_app = Celery(
    "virtual_tryon",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

@celery_app.task
def generate_3d_model_task(frame_id: str):
    """Generate 3D model from frame images using photogrammetry"""
    try:
        from database import SessionLocal
        from models import Frame, Model3D
        from services.model_service import ModelService
        import uuid
        import time
        from datetime import datetime
        
        db = SessionLocal()
        model_service = ModelService()
        
        try:
            # Get frame data
            frame = db.query(Frame).filter(Frame.id == frame_id).first()
            if not frame:
                return {"error": "Frame not found"}
            
            # Update frame status
            frame.status = "processing"
            db.commit()
            
            # Collect image paths
            image_paths = []
            for angle in ["front", "side", "back", "top", "bottom", "angle"]:
                image_url = getattr(frame, f"{angle}_image_url")
                if image_url:
                    # Convert URL to file path
                    file_path = image_url.replace("/static/", "static/")
                    if os.path.exists(file_path):
                        image_paths.append(file_path)
            
            if len(image_paths) < 3:
                frame.status = "error"
                db.commit()
                return {"error": "Not enough images for 3D reconstruction"}
            
            # Create model record
            model_id = str(uuid.uuid4())
            model_path = f"static/models/{frame.name.lower().replace(' ', '_')}_{model_id}.glb"
            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            
            model_data = {
                "id": model_id,
                "frame_id": frame_id,
                "file_path": model_path,
                "file_format": "glb",
                "status": "generating"
            }
            
            # Create model record in database
            db_model = Model3D(**model_data)
            db.add(db_model)
            db.commit()
            
            # Simulate 3D model generation
            # In a real implementation, you would use:
            # - OpenMVG for structure from motion
            # - OpenMVS for dense reconstruction
            # - Blender Python API for mesh processing
            # - PyTorch3D for ML-based reconstruction
            
            start_time = time.time()
            
            # For demo purposes, we'll create a simple placeholder model
            success = create_placeholder_3d_model(image_paths, model_path)
            
            processing_time = time.time() - start_time
            
            if success:
                # Get file size
                file_size = os.path.getsize(model_path) if os.path.exists(model_path) else 0
                
                # Update model with results
                model_service.mark_model_ready(
                    db, model_id, model_path, file_size, 
                    10000, 8000, 2, processing_time
                )
                
                # Update frame status
                frame.status = "ready"
                db.commit()
                
                return {
                    "success": True,
                    "model_id": model_id,
                    "file_path": model_path,
                    "processing_time": processing_time
                }
            else:
                # Mark as error
                model_service.mark_model_error(db, model_id, "3D reconstruction failed")
                frame.status = "error"
                db.commit()
                
                return {"error": "3D model generation failed"}
                
        finally:
            db.close()
            
    except Exception as e:
        # Update frame status to error
        try:
            from database import SessionLocal
            from models import Frame
            db = SessionLocal()
            frame = db.query(Frame).filter(Frame.id == frame_id).first()
            if frame:
                frame.status = "error"
                db.commit()
            db.close()
        except:
            pass
        
        return {"error": str(e)}

def create_placeholder_3d_model(image_paths, output_path):
    """Create a placeholder 3D model for demonstration"""
    try:
        import trimesh
        import numpy as np
        
        # Create a simple rectangular frame mesh
        # This is just a placeholder - in reality you would use photogrammetry
        
        # Frame dimensions
        width = 0.14  # 14cm
        height = 0.05  # 5cm
        depth = 0.01   # 1cm
        
        # Create vertices for a simple rectangular frame
        vertices = np.array([
            # Front face
            [-width/2, -height/2, 0],
            [width/2, -height/2, 0],
            [width/2, height/2, 0],
            [-width/2, height/2, 0],
            # Back face
            [-width/2, -height/2, -depth],
            [width/2, -height/2, -depth],
            [width/2, height/2, -depth],
            [-width/2, height/2, -depth],
        ])
        
        # Create faces (triangles)
        faces = np.array([
            # Front face
            [0, 1, 2], [0, 2, 3],
            # Back face
            [4, 6, 5], [4, 7, 6],
            # Left face
            [0, 3, 7], [0, 7, 4],
            # Right face
            [1, 5, 6], [1, 6, 2],
            # Top face
            [3, 2, 6], [3, 6, 7],
            # Bottom face
            [0, 4, 5], [0, 5, 1],
        ])
        
        # Create mesh
        mesh = trimesh.Trimesh(vertices=vertices, faces=faces)
        
        # Add some basic material
        mesh.visual.face_colors = [100, 100, 100, 255]  # Gray color
        
        # Export as GLB
        mesh.export(output_path, file_type='glb')
        
        return True
        
    except Exception as e:
        print(f"Error creating placeholder model: {e}")
        return False

@celery_app.task
def process_tryon_task(session_id: str, image_path: str, frame_id: str):
    """Process a try-on session asynchronously"""
    try:
        from database import SessionLocal
        from services.tryon_service import TryOnService
        
        db = SessionLocal()
        tryon_service = TryOnService()
        
        try:
            result = await tryon_service.process_tryon(db, frame_id, image_path)
            return result
        finally:
            db.close()
            
    except Exception as e:
        return {"error": str(e)}