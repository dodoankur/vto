from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

class Frame(Base):
    __tablename__ = "frames"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    brand = Column(String(255), nullable=False)
    color = Column(String(100), nullable=False)
    price = Column(Float, default=0.0)
    description = Column(Text)
    
    # Image URLs for different angles
    front_image_url = Column(String(500))
    side_image_url = Column(String(500))
    back_image_url = Column(String(500))
    top_image_url = Column(String(500))
    bottom_image_url = Column(String(500))
    angle_image_url = Column(String(500))
    
    # Status
    status = Column(String(50), default="draft")  # draft, processing, ready, error
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    model_3d = relationship("Model3D", back_populates="frame", uselist=False)
    tryon_sessions = relationship("TryOnSession", back_populates="frame")

class Model3D(Base):
    __tablename__ = "models_3d"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    frame_id = Column(UUID(as_uuid=True), ForeignKey("frames.id"), nullable=False)
    
    # Model file information
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)  # in bytes
    file_format = Column(String(10), default="glb")  # glb, gltf, obj
    
    # 3D model properties
    vertices_count = Column(Integer)
    faces_count = Column(Integer)
    materials_count = Column(Integer)
    
    # Status
    status = Column(String(50), default="generating")  # generating, ready, error
    
    # Generation info
    generation_method = Column(String(100))  # photogrammetry, ml_reconstruction
    processing_time = Column(Float)  # in seconds
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    frame = relationship("Frame", back_populates="model_3d")

class TryOnSession(Base):
    __tablename__ = "tryon_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    frame_id = Column(UUID(as_uuid=True), ForeignKey("frames.id"), nullable=False)
    
    # Session data
    user_id = Column(String(255))  # Optional user identification
    session_type = Column(String(50), default="camera")  # camera, upload
    
    # Input data
    input_image_path = Column(String(500))
    face_landmarks = Column(Text)  # JSON string of face detection data
    
    # Output data
    result_image_path = Column(String(500))
    confidence_score = Column(Float)
    
    # Session metadata
    device_info = Column(String(255))
    user_agent = Column(String(500))
    ip_address = Column(String(45))
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Relationships
    frame = relationship("Frame", back_populates="tryon_sessions")

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Metrics
    date = Column(DateTime, nullable=False)
    metric_type = Column(String(50), nullable=False)  # tryon, conversion, revenue
    metric_value = Column(Float, nullable=False)
    
    # Dimensions
    frame_id = Column(UUID(as_uuid=True), ForeignKey("frames.id"))
    device_type = Column(String(50))  # desktop, mobile, tablet
    user_type = Column(String(50))  # new, returning
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)