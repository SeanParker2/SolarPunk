# backend/app/models.py
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import uuid
import datetime

Base = declarative_base()

# 关联表：多对多关系
photo_tags_table = Table('photo_tags', Base.metadata,
    Column('photo_id', UUID(as_uuid=True), ForeignKey('photos.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)

class Photo(Base):
    __tablename__ = 'photos'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    public_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, index=True)
    tags = relationship("Tag", secondary=photo_tags_table, back_populates="photos")
    r2_object_key = Column(String, unique=True, nullable=False)
    aspect_ratio = Column(Float, default=1.77)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # 假设你的模型可以拼接出缩略图URL
    @property
    def thumbnail_url(self):
        # !! 注意: 请确保你的配置中有 CDN_BASE_URL !!
        # 这是一个示例，你需要根据你的对象存储和CDN配置来调整
        return f"https://pub-your-r2-id.r2.dev/images/thumb/{self.r2_object_key}"

class Tag(Base):
    __tablename__ = 'tags'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    photos = relationship("Photo", secondary=photo_tags_table, back_populates="tags")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True, index=True)
    password = Column(String)  # 在生产环境中，这里应该是哈希后的密码
    role = Column(String(32), default='admin')