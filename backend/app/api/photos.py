from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.crud.crud_photos import get_photos as crud_get_photos, get_photo_by_public_id
from app.models.schemas import PhotoListResponse, PhotoResponse, PhotoDetail
from app.core.config import settings
from app.models import Photo
from typing import List, Optional
import json

router = APIRouter()

def build_thumbnail_url(r2_object_key: str) -> str:
    """根据R2对象键构建缩略图URL"""
    # 将 images/original/xxx.webp 转换为 images/thumb/xxx.webp
    thumb_key = r2_object_key.replace("images/original/", "images/thumb/")
    return f"{settings.r2_public_url}/{thumb_key}"

def build_download_url(r2_object_key: str, size: str = "original") -> str:
    """根据R2对象键构建下载URL，支持不同尺寸"""
    if size == "small":
        # 将 images/original/xxx.webp 转换为 images/small/xxx.webp
        small_key = r2_object_key.replace("images/original/", "images/small/")
        return f"{settings.r2_public_url}/{small_key}"
    elif size == "large":
        # 将 images/original/xxx.webp 转换为 images/large/xxx.webp
        large_key = r2_object_key.replace("images/original/", "images/large/")
        return f"{settings.r2_public_url}/{large_key}"
    else:
        # 默认返回原图
        return f"{settings.r2_public_url}/{r2_object_key}"

@router.get("/photos", response_model=PhotoListResponse)
def get_photos(
    page: int = Query(1, ge=1), 
    limit: int = Query(20, ge=1, le=100),
    q: Optional[str] = Query(None, description="搜索关键词"),
    search: Optional[str] = Query(None, description="搜索关键词（兼容性）"),
    tags: Optional[str] = Query(None, description="标签过滤，多个标签用逗号分隔"),
    db: Session = Depends(get_db)
):
    """获取图片列表，支持搜索和标签过滤"""
    # 使用q参数，如果没有则使用search参数（向后兼容）
    search_query = q or search
    tag_list = tags.split(',') if tags else None
    photos, total, pages = crud_get_photos(db, page=page, limit=limit, search=search_query, tags=tag_list)
    
    items = [
        PhotoResponse(
            public_id=photo.public_id,
            title=photo.title,
            tags=json.loads(photo.tags) if photo.tags else [],
            thumbnail_url=build_thumbnail_url(photo.r2_object_key),
            aspect_ratio=photo.aspect_ratio
        )
        for photo in photos
    ]
    
    return PhotoListResponse(
        items=items,
        total=total,
        page=page,
        pages=pages,
        limit=limit
    )

@router.get("/photos/{public_id}", response_model=PhotoDetail)
def get_photo_detail(public_id: str, db: Session = Depends(get_db)):
    """获取单张图片详情"""
    photo = get_photo_by_public_id(db, public_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    return PhotoDetail(
        public_id=photo.public_id,
        title=photo.title,
        tags=json.loads(photo.tags) if photo.tags else [],
        download_url=build_download_url(photo.r2_object_key),
        aspect_ratio=photo.aspect_ratio
    )

@router.get("/photos/{public_id}/download/{size}")
def get_download_url(public_id: str, size: str, db: Session = Depends(get_db)):
    """获取指定尺寸的下载URL"""
    if size not in ["small", "large", "original"]:
        raise HTTPException(status_code=400, detail="Invalid size. Must be 'small', 'large', or 'original'")
    
    photo = get_photo_by_public_id(db, public_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    download_url = build_download_url(photo.r2_object_key, size)
    return {"download_url": download_url, "size": size}

@router.post("/photos/{public_id}/download")
def record_download(public_id: str, db: Session = Depends(get_db)):
    """记录图片下载次数"""
    photo = db.query(Photo).filter(Photo.public_id == public_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    # 增加下载计数
    photo.download_count = (photo.download_count or 0) + 1
    db.commit()
    
    return {"message": "Download recorded", "download_count": photo.download_count}