# backend/app/models/tables.py
from sqlalchemy import Column, String, Float, DateTime, Text, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

# 关联表：合集与图片的多对多关系
collection_photos = Table(
    'collection_photos',
    Base.metadata,
    Column('collection_id', String(36), ForeignKey('collections.id'), primary_key=True),
    Column('photo_id', String(36), ForeignKey('photos.id'), primary_key=True),
    Column('order_index', Integer, default=0)  # 用于排序
)

class Photo(Base):
    __tablename__ = "photos"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    public_id = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    tags = Column(Text, nullable=False, default="[]")
    r2_object_key = Column(String(255), nullable=False)
    aspect_ratio = Column(Float, nullable=False)
    download_count = Column(Integer, default=0, nullable=False)
    is_featured = Column(String(5), default='false', nullable=False)  # 使用字符串以兼容SQLite
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关系
    collections = relationship("Collection", secondary=collection_photos, back_populates="photos")
    
    @property
    def thumbnail_url(self):
        from app.core.config import settings
        return f"{settings.cdn_base_url}/images/thumb/{self.r2_object_key}"
    
    @property
    def is_featured_bool(self):
        """返回布尔值的is_featured属性"""
        return self.is_featured.lower() == 'true'

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(32), default='admin')

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    description = Column(Text, nullable=True)

class Collection(Base):
    __tablename__ = "collections"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)  # URL友好的标识符
    cover_photo_id = Column(String(36), ForeignKey('photos.id'), nullable=True)
    is_published = Column(String(5), default='false', nullable=False)  # 是否发布
    view_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 关系
    photos = relationship("Photo", secondary=collection_photos, back_populates="collections")
    cover_photo = relationship("Photo", foreign_keys=[cover_photo_id])
    
    @property
    def is_published_bool(self):
        """返回布尔值的is_published属性"""
        return self.is_published.lower() == 'true'