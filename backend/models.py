from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    try_ons = relationship("TryOn", back_populates="user")

class Frame(Base):
    __tablename__ = "frames"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)  # sunglasses, prescription, sports
    description = Column(Text)
    image_url = Column(String)
    model_url = Column(String)  # 3D model URL
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Frame specifications
    lens_width = Column(Float)
    bridge_width = Column(Float)
    temple_length = Column(Float)
    lens_height = Column(Float)
    
    # Relationships
    try_ons = relationship("TryOn", back_populates="frame")
    frame_images = relationship("FrameImage", back_populates="frame")

class FrameImage(Base):
    __tablename__ = "frame_images"
    
    id = Column(Integer, primary_key=True, index=True)
    frame_id = Column(Integer, ForeignKey("frames.id"))
    angle = Column(String, nullable=False)  # front, side, back, top, bottom, detail
    image_url = Column(String, nullable=False)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    frame = relationship("Frame", back_populates="frame_images")

class TryOn(Base):
    __tablename__ = "try_ons"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    frame_id = Column(Integer, ForeignKey("frames.id"))
    original_image_url = Column(String, nullable=False)
    processed_image_url = Column(String)
    try_on_type = Column(String, nullable=False)  # upload, camera
    status = Column(String, default="processing")  # processing, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Face detection data
    face_detected = Column(Boolean, default=False)
    eye_landmarks = Column(Text)  # JSON string of eye landmark coordinates
    frame_position = Column(Text)  # JSON string of frame position data
    
    # Relationships
    user = relationship("User", back_populates="try_ons")
    frame = relationship("Frame", back_populates="try_ons")

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    event_type = Column(String, nullable=False)  # try_on, frame_view, conversion
    frame_id = Column(Integer, ForeignKey("frames.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    metadata = Column(Text)  # JSON string for additional data
