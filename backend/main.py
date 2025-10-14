from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from datetime import datetime

from database import get_db, engine
from models import Base, Frame, Model3D, TryOnSession
from schemas import FrameCreate, FrameResponse, Model3DCreate, Model3DResponse, TryOnSessionCreate
from services.frame_service import FrameService
from services.model_service import ModelService
from services.tryon_service import TryOnService
from tasks import generate_3d_model_task

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Virtual Try-On API",
    description="API for virtual try-on frame management and 3D model generation",
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

# Mount static files
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize services
frame_service = FrameService()
model_service = ModelService()
tryon_service = TryOnService()

@app.get("/")
async def root():
    return {"message": "Virtual Try-On API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Frame Management Endpoints
@app.post("/api/frames", response_model=FrameResponse)
async def create_frame(
    name: str = Form(...),
    brand: str = Form(...),
    color: str = Form(...),
    price: float = Form(0),
    description: str = Form(""),
    front_image: UploadFile = File(None),
    side_image: UploadFile = File(None),
    back_image: UploadFile = File(None),
    top_image: UploadFile = File(None),
    bottom_image: UploadFile = File(None),
    angle_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """Create a new frame with uploaded images"""
    try:
        # Save uploaded images
        image_urls = {}
        for angle, file in [
            ("front", front_image),
            ("side", side_image),
            ("back", back_image),
            ("top", top_image),
            ("bottom", bottom_image),
            ("angle", angle_image)
        ]:
            if file and file.filename:
                filename = f"{uuid.uuid4()}_{angle}_{file.filename}"
                file_path = f"static/frames/{filename}"
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                
                with open(file_path, "wb") as buffer:
                    content = await file.read()
                    buffer.write(content)
                
                image_urls[angle] = f"/static/frames/{filename}"
        
        # Create frame data
        frame_data = FrameCreate(
            name=name,
            brand=brand,
            color=color,
            price=price,
            description=description,
            image_urls=image_urls
        )
        
        frame = await frame_service.create_frame(db, frame_data)
        
        # Start 3D model generation if we have enough images
        if len([url for url in image_urls.values() if url]) >= 3:
            generate_3d_model_task.delay(frame.id)
        
        return frame
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/frames", response_model=List[FrameResponse])
async def get_frames(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all frames"""
    return await frame_service.get_frames(db, skip=skip, limit=limit)

@app.get("/api/frames/{frame_id}", response_model=FrameResponse)
async def get_frame(frame_id: str, db: Session = Depends(get_db)):
    """Get a specific frame by ID"""
    frame = await frame_service.get_frame(db, frame_id)
    if not frame:
        raise HTTPException(status_code=404, detail="Frame not found")
    return frame

@app.put("/api/frames/{frame_id}", response_model=FrameResponse)
async def update_frame(
    frame_id: str,
    frame_data: FrameCreate,
    db: Session = Depends(get_db)
):
    """Update a frame"""
    frame = await frame_service.update_frame(db, frame_id, frame_data)
    if not frame:
        raise HTTPException(status_code=404, detail="Frame not found")
    return frame

@app.delete("/api/frames/{frame_id}")
async def delete_frame(frame_id: str, db: Session = Depends(get_db)):
    """Delete a frame"""
    success = await frame_service.delete_frame(db, frame_id)
    if not success:
        raise HTTPException(status_code=404, detail="Frame not found")
    return {"message": "Frame deleted successfully"}

# 3D Model Management Endpoints
@app.get("/api/models", response_model=List[Model3DResponse])
async def get_models(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all 3D models"""
    return await model_service.get_models(db, skip=skip, limit=limit)

@app.get("/api/models/{model_id}", response_model=Model3DResponse)
async def get_model(model_id: str, db: Session = Depends(get_db)):
    """Get a specific 3D model by ID"""
    model = await model_service.get_model(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

@app.post("/api/models/{frame_id}/generate")
async def generate_model(frame_id: str, db: Session = Depends(get_db)):
    """Manually trigger 3D model generation for a frame"""
    frame = await frame_service.get_frame(db, frame_id)
    if not frame:
        raise HTTPException(status_code=404, detail="Frame not found")
    
    # Start generation task
    task = generate_3d_model_task.delay(frame_id)
    
    return {"message": "3D model generation started", "task_id": task.id}

@app.get("/api/models/{model_id}/download")
async def download_model(model_id: str, db: Session = Depends(get_db)):
    """Download a 3D model file"""
    model = await model_service.get_model(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    if not os.path.exists(model.file_path):
        raise HTTPException(status_code=404, detail="Model file not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        path=model.file_path,
        filename=f"{model.frame_name.lower().replace(' ', '-')}.glb",
        media_type="application/octet-stream"
    )

# Try-On Session Endpoints
@app.post("/api/tryon/sessions")
async def create_tryon_session(
    session_data: TryOnSessionCreate,
    db: Session = Depends(get_db)
):
    """Create a new try-on session"""
    session = await tryon_service.create_session(db, session_data)
    return session

@app.get("/api/tryon/sessions/{session_id}")
async def get_tryon_session(session_id: str, db: Session = Depends(get_db)):
    """Get a try-on session"""
    session = await tryon_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@app.post("/api/tryon/process")
async def process_tryon(
    frame_id: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Process a virtual try-on with uploaded image"""
    try:
        # Save uploaded image
        filename = f"{uuid.uuid4()}_{image.filename}"
        file_path = f"static/tryon/{filename}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
        
        # Process try-on
        result = await tryon_service.process_tryon(db, frame_id, file_path)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Analytics Endpoints
@app.get("/api/analytics/overview")
async def get_analytics_overview(db: Session = Depends(get_db)):
    """Get analytics overview data"""
    return await frame_service.get_analytics_overview(db)

@app.get("/api/analytics/frames")
async def get_frame_analytics(db: Session = Depends(get_db)):
    """Get frame performance analytics"""
    return await frame_service.get_frame_analytics(db)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)