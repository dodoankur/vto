from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime
from uuid import UUID

# Frame Schemas
class FrameBase(BaseModel):
    name: str
    brand: str
    color: str
    price: float = 0.0
    description: Optional[str] = ""

class FrameCreate(FrameBase):
    image_urls: Optional[Dict[str, str]] = {}

class FrameUpdate(FrameBase):
    pass

class FrameResponse(FrameBase):
    id: UUID
    status: str
    front_image_url: Optional[str] = None
    side_image_url: Optional[str] = None
    back_image_url: Optional[str] = None
    top_image_url: Optional[str] = None
    bottom_image_url: Optional[str] = None
    angle_image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# 3D Model Schemas
class Model3DBase(BaseModel):
    file_path: str
    file_size: Optional[int] = None
    file_format: str = "glb"
    vertices_count: Optional[int] = None
    faces_count: Optional[int] = None
    materials_count: Optional[int] = None
    generation_method: Optional[str] = None
    processing_time: Optional[float] = None

class Model3DCreate(Model3DBase):
    frame_id: UUID

class Model3DResponse(Model3DBase):
    id: UUID
    frame_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Try-On Session Schemas
class TryOnSessionBase(BaseModel):
    frame_id: UUID
    user_id: Optional[str] = None
    session_type: str = "camera"
    device_info: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

class TryOnSessionCreate(TryOnSessionBase):
    pass

class TryOnSessionResponse(TryOnSessionBase):
    id: UUID
    input_image_path: Optional[str] = None
    face_landmarks: Optional[str] = None
    result_image_path: Optional[str] = None
    confidence_score: Optional[float] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Analytics Schemas
class AnalyticsOverview(BaseModel):
    total_frames: int
    ready_frames: int
    processing_frames: int
    total_tryons: int
    total_conversions: int
    conversion_rate: float
    total_revenue: float

class FrameAnalytics(BaseModel):
    frame_id: UUID
    frame_name: str
    frame_brand: str
    tryon_count: int
    conversion_count: int
    conversion_rate: float
    revenue: float
    trend: str  # up, down, stable