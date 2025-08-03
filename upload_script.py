#!/usr/bin/env python3
# upload_script.py
"""
SolarPunk Image Hub - 内容管理脚本
用法: python upload_script.py <image_file_path>
"""

import sys
import os
from pathlib import Path
from PIL import Image
import boto3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import uuid
from datetime import datetime

# 添加backend目录到Python路径
sys.path.append(str(Path(__file__).parent / "backend"))

from app.core.config import settings
from app.models.tables import Photo
from app.crud.crud_photos import create_photo
from app.models.schemas import PhotoCreate

def setup_database():
    """设置数据库连接"""
    engine = create_engine(settings.database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal()

def setup_r2_client():
    """设置R2客户端"""
    return boto3.client(
        's3',
        endpoint_url=settings.r2_endpoint_url,
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        region_name='auto'
    )

def process_image(image_path: str) -> tuple[bytes, bytes, float]:
    """处理图片：生成缩略图和原图，返回(原图字节, 缩略图字节, 宽高比)"""
    with Image.open(image_path) as img:
        # 转换为RGB模式（如果需要）
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')
        
        # 计算宽高比
        aspect_ratio = img.width / img.height
        
        # 生成缩略图（宽度400px）
        thumbnail = img.copy()
        thumbnail.thumbnail((400, int(400 / aspect_ratio)), Image.Resampling.LANCZOS)
        
        # 保存原图为WebP格式
        from io import BytesIO
        original_buffer = BytesIO()
        img.save(original_buffer, format='WEBP', quality=90, optimize=True)
        original_bytes = original_buffer.getvalue()
        
        # 保存缩略图为WebP格式
        thumb_buffer = BytesIO()
        thumbnail.save(thumb_buffer, format='WEBP', quality=85, optimize=True)
        thumb_bytes = thumb_buffer.getvalue()
        
        return original_bytes, thumb_bytes, aspect_ratio

def upload_to_r2(r2_client, original_bytes: bytes, thumb_bytes: bytes, file_id: str) -> str:
    """上传图片到R2，返回原图的object_key"""
    original_key = f"images/original/{file_id}.webp"
    thumb_key = f"images/thumb/{file_id}.webp"
    
    # 上传原图
    r2_client.put_object(
        Bucket=settings.r2_bucket_name,
        Key=original_key,
        Body=original_bytes,
        ContentType='image/webp'
    )
    
    # 上传缩略图
    r2_client.put_object(
        Bucket=settings.r2_bucket_name,
        Key=thumb_key,
        Body=thumb_bytes,
        ContentType='image/webp'
    )
    
    return original_key

def get_user_input() -> tuple[str, str, list[str]]:
    """获取用户输入的图片信息"""
    print("\n请输入图片信息:")
    
    public_id = input("Public ID (例: SolarPunk-city-garden-01): ").strip()
    while not public_id:
        print("Public ID 不能为空！")
        public_id = input("Public ID: ").strip()
    
    title = input("图片标题: ").strip()
    while not title:
        print("标题不能为空！")
        title = input("图片标题: ").strip()
    
    tags_input = input("标签 (用逗号分隔): ").strip()
    tags = [tag.strip() for tag in tags_input.split(',') if tag.strip()]
    if not tags:
        tags = ['SolarPunk']  # 默认标签
    
    return public_id, title, tags

def main():
    if len(sys.argv) != 2:
        print("用法: python upload_script.py <image_file_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    # 检查文件是否存在
    if not os.path.exists(image_path):
        print(f"错误: 文件 {image_path} 不存在")
        sys.exit(1)
    
    try:
        print(f"正在处理图片: {image_path}")
        
        # 处理图片
        original_bytes, thumb_bytes, aspect_ratio = process_image(image_path)
        print(f"图片处理完成，宽高比: {aspect_ratio:.2f}")
        
        # 获取用户输入
        public_id, title, tags = get_user_input()
        
        # 生成唯一文件ID
        file_id = str(uuid.uuid4())
        
        # 设置R2客户端
        r2_client = setup_r2_client()
        
        # 上传到R2
        print("正在上传到 Cloudflare R2...")
        r2_object_key = upload_to_r2(r2_client, original_bytes, thumb_bytes, file_id)
        print("上传完成")
        
        # 保存到数据库
        print("正在保存到数据库...")
        db = setup_database()
        try:
            photo_data = PhotoCreate(
                public_id=public_id,
                title=title,
                tags=tags,
                r2_object_key=r2_object_key,
                aspect_ratio=aspect_ratio
            )
            create_photo(db, photo_data)
            db.commit()
            print("数据库保存完成")
        finally:
            db.close()
        
        print("\n✅ Success!")
        print(f"图片已成功上传: {public_id}")
        print(f"标题: {title}")
        print(f"标签: {', '.join(tags)}")
        
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()