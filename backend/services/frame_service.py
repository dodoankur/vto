from sqlalchemy.orm import Session
from typing import List, Optional
from models import Frame
from schemas import FrameCreate, FrameResponse
from datetime import datetime

class FrameService:
    async def create_frame(self, db: Session, frame_data: FrameCreate) -> FrameResponse:
        """Create a new frame"""
        db_frame = Frame(
            name=frame_data.name,
            brand=frame_data.brand,
            color=frame_data.color,
            price=frame_data.price,
            description=frame_data.description,
            front_image_url=frame_data.image_urls.get("front"),
            side_image_url=frame_data.image_urls.get("side"),
            back_image_url=frame_data.image_urls.get("back"),
            top_image_url=frame_data.image_urls.get("top"),
            bottom_image_url=frame_data.image_urls.get("bottom"),
            angle_image_url=frame_data.image_urls.get("angle"),
            status="draft"
        )
        
        db.add(db_frame)
        db.commit()
        db.refresh(db_frame)
        
        return FrameResponse.from_orm(db_frame)
    
    async def get_frames(self, db: Session, skip: int = 0, limit: int = 100) -> List[FrameResponse]:
        """Get all frames with pagination"""
        frames = db.query(Frame).offset(skip).limit(limit).all()
        return [FrameResponse.from_orm(frame) for frame in frames]
    
    async def get_frame(self, db: Session, frame_id: str) -> Optional[FrameResponse]:
        """Get a specific frame by ID"""
        frame = db.query(Frame).filter(Frame.id == frame_id).first()
        if frame:
            return FrameResponse.from_orm(frame)
        return None
    
    async def update_frame(self, db: Session, frame_id: str, frame_data: FrameCreate) -> Optional[FrameResponse]:
        """Update a frame"""
        frame = db.query(Frame).filter(Frame.id == frame_id).first()
        if not frame:
            return None
        
        for field, value in frame_data.dict(exclude_unset=True).items():
            if field == "image_urls":
                # Update individual image URLs
                for angle, url in value.items():
                    setattr(frame, f"{angle}_image_url", url)
            else:
                setattr(frame, field, value)
        
        frame.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(frame)
        
        return FrameResponse.from_orm(frame)
    
    async def delete_frame(self, db: Session, frame_id: str) -> bool:
        """Delete a frame"""
        frame = db.query(Frame).filter(Frame.id == frame_id).first()
        if not frame:
            return False
        
        db.delete(frame)
        db.commit()
        return True
    
    async def get_analytics_overview(self, db: Session) -> dict:
        """Get analytics overview data"""
        from models import TryOnSession, Model3D
        
        # Count frames by status
        total_frames = db.query(Frame).count()
        ready_frames = db.query(Frame).filter(Frame.status == "ready").count()
        processing_frames = db.query(Frame).filter(Frame.status == "processing").count()
        
        # Count try-ons
        total_tryons = db.query(TryOnSession).count()
        
        # Calculate conversion rate (simplified)
        conversions = db.query(TryOnSession).filter(TryOnSession.result_image_path.isnot(None)).count()
        conversion_rate = (conversions / total_tryons * 100) if total_tryons > 0 else 0
        
        # Calculate revenue (simplified)
        total_revenue = db.query(Frame.price).join(TryOnSession).filter(
            TryOnSession.result_image_path.isnot(None)
        ).sum() or 0
        
        return {
            "total_frames": total_frames,
            "ready_frames": ready_frames,
            "processing_frames": processing_frames,
            "total_tryons": total_tryons,
            "total_conversions": conversions,
            "conversion_rate": round(conversion_rate, 2),
            "total_revenue": float(total_revenue)
        }
    
    async def get_frame_analytics(self, db: Session) -> List[dict]:
        """Get frame performance analytics"""
        from models import TryOnSession
        from sqlalchemy import func
        
        # Get frame statistics
        frame_stats = db.query(
            Frame.id,
            Frame.name,
            Frame.brand,
            Frame.price,
            func.count(TryOnSession.id).label('tryon_count'),
            func.count(TryOnSession.result_image_path).label('conversion_count')
        ).outerjoin(TryOnSession).group_by(Frame.id).all()
        
        analytics = []
        for stat in frame_stats:
            conversion_rate = (stat.conversion_count / stat.tryon_count * 100) if stat.tryon_count > 0 else 0
            revenue = stat.conversion_count * stat.price
            
            # Determine trend (simplified)
            trend = "stable"
            if conversion_rate > 15:
                trend = "up"
            elif conversion_rate < 5:
                trend = "down"
            
            analytics.append({
                "frame_id": str(stat.id),
                "frame_name": stat.name,
                "frame_brand": stat.brand,
                "tryon_count": stat.tryon_count,
                "conversion_count": stat.conversion_count,
                "conversion_rate": round(conversion_rate, 2),
                "revenue": float(revenue),
                "trend": trend
            })
        
        return sorted(analytics, key=lambda x: x['tryon_count'], reverse=True)