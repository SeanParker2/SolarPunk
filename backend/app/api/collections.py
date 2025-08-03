from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import List, Optional
from app.db.database import get_db
from app.models.tables import Collection, Photo, collection_photos
from pydantic import BaseModel
import json

router = APIRouter()

# Pydantic 模型
class PhotoInCollection(BaseModel):
    id: str
    public_id: str
    title: str
    tags: List[str]
    thumbnail_url: str
    aspect_ratio: float
    download_count: int
    is_featured: bool
    
    class Config:
        from_attributes = True

class CollectionResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    slug: str
    cover_photo_id: Optional[str]
    cover_photo: Optional[PhotoInCollection]
    is_published: bool
    view_count: int
    photo_count: int
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True

class CollectionDetailResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    slug: str
    cover_photo_id: Optional[str]
    cover_photo: Optional[PhotoInCollection]
    is_published: bool
    view_count: int
    photos: List[PhotoInCollection]
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True

class CollectionListResponse(BaseModel):
    items: List[CollectionResponse]
    total: int
    page: int
    pages: int
    
def build_thumbnail_url(r2_object_key: str) -> str:
    """构建缩略图URL"""
    from app.core.config import settings
    return f"{settings.cdn_base_url}/images/thumb/{r2_object_key}"

def format_photo_for_response(photo: Photo) -> PhotoInCollection:
    """格式化图片数据用于响应"""
    try:
        tags = json.loads(photo.tags) if photo.tags else []
    except (json.JSONDecodeError, TypeError):
        tags = []
    
    return PhotoInCollection(
        id=photo.id,
        public_id=photo.public_id,
        title=photo.title,
        tags=tags,
        thumbnail_url=build_thumbnail_url(photo.r2_object_key),
        aspect_ratio=photo.aspect_ratio,
        download_count=photo.download_count,
        is_featured=photo.is_featured_bool
    )

@router.get("/collections", response_model=CollectionListResponse)
def get_collections(
    page: int = Query(1, ge=1, description="页码"),
    limit: int = Query(12, ge=1, le=50, description="每页数量"),
    published_only: bool = Query(True, description="只显示已发布的合集"),
    db: Session = Depends(get_db)
):
    """获取合集列表"""
    query = db.query(Collection)
    
    if published_only:
        query = query.filter(Collection.is_published == 'true')
    
    # 按创建时间倒序排列
    query = query.order_by(desc(Collection.created_at))
    
    total = query.count()
    pages = (total + limit - 1) // limit
    
    collections = query.offset((page - 1) * limit).limit(limit).all()
    
    items = []
    for collection in collections:
        # 获取合集中的图片数量
        photo_count = db.query(collection_photos).filter(
            collection_photos.c.collection_id == collection.id
        ).count()
        
        # 格式化封面图片
        cover_photo = None
        if collection.cover_photo:
            cover_photo = format_photo_for_response(collection.cover_photo)
        
        items.append(CollectionResponse(
            id=collection.id,
            title=collection.title,
            description=collection.description,
            slug=collection.slug,
            cover_photo_id=collection.cover_photo_id,
            cover_photo=cover_photo,
            is_published=collection.is_published_bool,
            view_count=collection.view_count,
            photo_count=photo_count,
            created_at=collection.created_at.isoformat(),
            updated_at=collection.updated_at.isoformat()
        ))
    
    return CollectionListResponse(
        items=items,
        total=total,
        page=page,
        pages=pages
    )

@router.get("/collections/{slug}", response_model=CollectionDetailResponse)
def get_collection_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """根据slug获取合集详情"""
    collection = db.query(Collection).filter(
        Collection.slug == slug,
        Collection.is_published == 'true'
    ).first()
    
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # 增加浏览量
    collection.view_count += 1
    db.commit()
    
    # 获取合集中的图片（按order_index排序）
    photos_query = db.query(Photo, collection_photos.c.order_index).join(
        collection_photos, Photo.id == collection_photos.c.photo_id
    ).filter(
        collection_photos.c.collection_id == collection.id
    ).order_by(asc(collection_photos.c.order_index))
    
    photos = [format_photo_for_response(photo) for photo, _ in photos_query.all()]
    
    # 格式化封面图片
    cover_photo = None
    if collection.cover_photo:
        cover_photo = format_photo_for_response(collection.cover_photo)
    
    return CollectionDetailResponse(
        id=collection.id,
        title=collection.title,
        description=collection.description,
        slug=collection.slug,
        cover_photo_id=collection.cover_photo_id,
        cover_photo=cover_photo,
        is_published=collection.is_published_bool,
        view_count=collection.view_count,
        photos=photos,
        created_at=collection.created_at.isoformat(),
        updated_at=collection.updated_at.isoformat()
    )

@router.get("/collections/{collection_id}/photos", response_model=List[PhotoInCollection])
def get_collection_photos(
    collection_id: str,
    db: Session = Depends(get_db)
):
    """获取合集中的所有图片"""
    collection = db.query(Collection).filter(
        Collection.id == collection_id,
        Collection.is_published == 'true'
    ).first()
    
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    # 获取合集中的图片（按order_index排序）
    photos_query = db.query(Photo).join(
        collection_photos, Photo.id == collection_photos.c.photo_id
    ).filter(
        collection_photos.c.collection_id == collection_id
    ).order_by(asc(collection_photos.c.order_index))
    
    photos = [format_photo_for_response(photo) for photo in photos_query.all()]
    
    return photos