# backend/app/models/schemas.py
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class PhotoBase(BaseModel):
    public_id: str
    title: str
    tags: List[str]
    aspect_ratio: float

class PhotoCreate(PhotoBase):
    r2_object_key: str

class PhotoResponse(PhotoBase):
    thumbnail_url: str

class PhotoDetail(PhotoBase):
    download_url: str
    license: str = "Free to use under SolarPunk License (CC0)."

class PhotoListResponse(BaseModel):
    items: List[PhotoResponse]
    total: int
    page: int
    pages: int
    limit: int

class PhotoDB(PhotoBase):
    id: UUID
    r2_object_key: str
    created_at: datetime
    
    class Config:
        from_attributes = True