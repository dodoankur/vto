import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://user:password@localhost/virtual_tryon"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # AWS S3
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"
    s3_bucket: str = "virtual-tryon-assets"
    
    # Cloudinary (alternative to S3)
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    
    # Redis (for Celery)
    redis_url: str = "redis://localhost:6379"
    
    # MediaPipe settings
    face_detection_confidence: float = 0.5
    face_tracking_confidence: float = 0.5
    
    class Config:
        env_file = ".env"

settings = Settings()
