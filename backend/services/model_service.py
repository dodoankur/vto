from sqlalchemy.orm import Session
from typing import List, Optional
from models import Model3D
from schemas import Model3DCreate, Model3DResponse
from datetime import datetime

class ModelService:
    async def create_model(self, db: Session, model_data: Model3DCreate) -> Model3DResponse:
        """Create a new 3D model record"""
        db_model = Model3D(
            frame_id=model_data.frame_id,
            file_path=model_data.file_path,
            file_size=model_data.file_size,
            file_format=model_data.file_format,
            vertices_count=model_data.vertices_count,
            faces_count=model_data.faces_count,
            materials_count=model_data.materials_count,
            generation_method=model_data.generation_method,
            processing_time=model_data.processing_time,
            status="generating"
        )
        
        db.add(db_model)
        db.commit()
        db.refresh(db_model)
        
        return Model3DResponse.from_orm(db_model)
    
    async def get_models(self, db: Session, skip: int = 0, limit: int = 100) -> List[Model3DResponse]:
        """Get all 3D models with pagination"""
        models = db.query(Model3D).offset(skip).limit(limit).all()
        return [Model3DResponse.from_orm(model) for model in models]
    
    async def get_model(self, db: Session, model_id: str) -> Optional[Model3DResponse]:
        """Get a specific 3D model by ID"""
        model = db.query(Model3D).filter(Model3D.id == model_id).first()
        if model:
            return Model3DResponse.from_orm(model)
        return None
    
    async def get_model_by_frame(self, db: Session, frame_id: str) -> Optional[Model3DResponse]:
        """Get 3D model by frame ID"""
        model = db.query(Model3D).filter(Model3D.frame_id == frame_id).first()
        if model:
            return Model3DResponse.from_orm(model)
        return None
    
    async def update_model(self, db: Session, model_id: str, **kwargs) -> Optional[Model3DResponse]:
        """Update a 3D model"""
        model = db.query(Model3D).filter(Model3D.id == model_id).first()
        if not model:
            return None
        
        for key, value in kwargs.items():
            if hasattr(model, key):
                setattr(model, key, value)
        
        model.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(model)
        
        return Model3DResponse.from_orm(model)
    
    async def delete_model(self, db: Session, model_id: str) -> bool:
        """Delete a 3D model"""
        model = db.query(Model3D).filter(Model3D.id == model_id).first()
        if not model:
            return False
        
        # Delete the file if it exists
        import os
        if os.path.exists(model.file_path):
            os.remove(model.file_path)
        
        db.delete(model)
        db.commit()
        return True
    
    async def mark_model_ready(self, db: Session, model_id: str, file_path: str, 
                              file_size: int, vertices_count: int, faces_count: int,
                              processing_time: float) -> Optional[Model3DResponse]:
        """Mark a model as ready with file information"""
        return await self.update_model(
            db, model_id,
            status="ready",
            file_path=file_path,
            file_size=file_size,
            vertices_count=vertices_count,
            faces_count=faces_count,
            processing_time=processing_time
        )
    
    async def mark_model_error(self, db: Session, model_id: str, error_message: str = None) -> Optional[Model3DResponse]:
        """Mark a model as failed"""
        return await self.update_model(
            db, model_id,
            status="error"
        )