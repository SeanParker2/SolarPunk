# backend/app/crud/crud_photos.py
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.tables import Photo
from app.models.schemas import PhotoCreate
from typing import List, Optional
import math
import json

def create_photo(db: Session, photo: PhotoCreate) -> Photo:
    """创建新的图片记录"""
    db_photo = Photo(
        public_id=photo.public_id,
        title=photo.title,
        tags=json.dumps(photo.tags),
        r2_object_key=photo.r2_object_key,
        aspect_ratio=photo.aspect_ratio
    )
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    return db_photo

def get_photos(db: Session, page: int = 1, limit: int = 20, search: Optional[str] = None, tags: Optional[List[str]] = None) -> tuple[List[Photo], int, int]:
    """获取图片列表，返回 (photos, total, pages)，支持搜索和标签过滤"""
    offset = (page - 1) * limit
    
    # 构建查询
    query = db.query(Photo)
    
    # 搜索过滤
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            Photo.title.ilike(search_term) |
            Photo.tags.ilike(search_term)
        )
    
    # 标签过滤
    if tags:
        for tag in tags:
            tag_term = f"%{tag.strip()}%"
            query = query.filter(Photo.tags.ilike(tag_term))
    
    # 获取总数
    total = query.count()
    
    # 获取分页数据
    photos = query.order_by(desc(Photo.created_at)).offset(offset).limit(limit).all()
    
    # 计算总页数
    pages = math.ceil(total / limit)
    
    return photos, total, pages

def get_photo_by_public_id(db: Session, public_id: str) -> Optional[Photo]:
    """根据public_id获取单张图片"""
    return db.query(Photo).filter(Photo.public_id == public_id).first()