#!/usr/bin/env python3
# create_sample_data.py

import os
import sys
import sqlite3
from datetime import datetime
import uuid
from PIL import Image, ImageDraw, ImageFont
import random

# 添加backend目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# 示例图片数据
SAMPLE_PHOTOS = [
    {
        "title": "Green City Skyline",
        "tags": ["green city", "sustainable", "architecture", "future"],
        "description": "A futuristic green city with vertical gardens and solar panels",
        "color": (34, 197, 94)  # green
    },
    {
        "title": "Solar Panel Farm",
        "tags": ["solar energy", "renewable", "technology", "clean energy"],
        "description": "Vast solar panel installation in a desert landscape",
        "color": (59, 130, 246)  # blue
    },
    {
        "title": "Vertical Garden Tower",
        "tags": ["vertical farming", "agriculture", "green building", "sustainability"],
        "description": "Modern building covered with vertical gardens and plants",
        "color": (16, 185, 129)  # emerald
    },
    {
        "title": "Wind Energy Landscape",
        "tags": ["wind energy", "renewable", "landscape", "clean technology"],
        "description": "Wind turbines in a beautiful natural landscape",
        "color": (139, 69, 19)  # brown
    },
    {
        "title": "Eco-Friendly Transportation",
        "tags": ["electric vehicles", "transportation", "sustainable mobility", "future"],
        "description": "Electric buses and bikes in a green urban environment",
        "color": (168, 85, 247)  # purple
    },
    {
        "title": "Sustainable Housing Complex",
        "tags": ["green housing", "sustainable living", "community", "eco-friendly"],
        "description": "Modern eco-friendly housing with solar panels and gardens",
        "color": (245, 158, 11)  # amber
    },
    {
        "title": "Ocean Wave Energy",
        "tags": ["wave energy", "ocean", "renewable energy", "marine technology"],
        "description": "Wave energy converters in the ocean",
        "color": (6, 182, 212)  # cyan
    },
    {
        "title": "Forest Conservation",
        "tags": ["forest", "conservation", "nature", "biodiversity"],
        "description": "Protected forest area with diverse wildlife",
        "color": (34, 197, 94)  # green
    },
    {
        "title": "Smart Grid Infrastructure",
        "tags": ["smart grid", "energy distribution", "technology", "efficiency"],
        "description": "Advanced smart grid system for efficient energy distribution",
        "color": (99, 102, 241)  # indigo
    },
    {
        "title": "Permaculture Garden",
        "tags": ["permaculture", "organic farming", "sustainable agriculture", "food security"],
        "description": "Diverse permaculture garden with various crops and plants",
        "color": (132, 204, 22)  # lime
    }
]

def create_sample_image(title, color, width=800, height=600):
    """创建一个示例图片"""
    # 创建图片
    img = Image.new('RGB', (width, height), color)
    draw = ImageDraw.Draw(img)
    
    # 添加渐变效果
    for i in range(height):
        alpha = i / height
        new_color = tuple(int(c * (1 - alpha * 0.3)) for c in color)
        draw.line([(0, i), (width, i)], fill=new_color)
    
    # 添加一些装饰性元素
    for _ in range(20):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(10, 50)
        circle_color = tuple(min(255, c + random.randint(-50, 50)) for c in color)
        draw.ellipse([x, y, x + size, y + size], fill=circle_color)
    
    # 添加标题文字
    try:
        # 尝试使用系统字体
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 40)
    except:
        # 如果找不到字体，使用默认字体
        font = ImageFont.load_default()
    
    # 计算文字位置
    bbox = draw.textbbox((0, 0), title, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # 添加文字阴影
    draw.text((x + 2, y + 2), title, fill=(0, 0, 0, 128), font=font)
    # 添加主文字
    draw.text((x, y), title, fill=(255, 255, 255), font=font)
    
    return img

def create_thumbnail(original_img, max_size=400):
    """创建缩略图"""
    img = original_img.copy()
    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    return img

def save_images_to_public(photo_data, public_id):
    """保存图片到public目录"""
    # 创建public/images目录
    images_dir = os.path.join('frontend', 'public', 'images')
    os.makedirs(images_dir, exist_ok=True)
    
    # 创建原图
    original_img = create_sample_image(photo_data['title'], photo_data['color'])
    original_path = os.path.join(images_dir, f"{public_id}.webp")
    original_img.save(original_path, 'WEBP', quality=90)
    
    # 创建缩略图
    thumbnail_img = create_thumbnail(original_img)
    thumbnail_path = os.path.join(images_dir, f"{public_id}_thumb.webp")
    thumbnail_img.save(thumbnail_path, 'WEBP', quality=80)
    
    return {
        'original_url': f'/images/{public_id}.webp',
        'thumbnail_url': f'/images/{public_id}_thumb.webp'
    }

def insert_photo_to_db(photo_data, urls, public_id):
    """将图片数据插入数据库"""
    db_path = os.path.join('backend', 'photos.db')
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 插入数据 - 匹配实际的表结构
    photo_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO photos (
            id, public_id, title, tags, r2_object_key, aspect_ratio, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        photo_id,
        public_id,
        photo_data['title'],
        '["' + '","'.join(photo_data['tags']) + '"]',  # JSON格式的tags
        f"images/{public_id}.webp",  # r2_object_key
        800 / 600,  # aspect_ratio
        datetime.now().isoformat()
    ))
    
    conn.commit()
    conn.close()
    
    print(f"✅ 已添加图片: {photo_data['title']} (ID: {public_id})")

def main():
    print("🌱 开始创建示例图片数据...")
    
    # 检查数据库是否存在
    db_path = os.path.join('backend', 'photos.db')
    if not os.path.exists(db_path):
        print("❌ 数据库文件不存在，请先启动后端服务器以创建数据库")
        return
    
    created_count = 0
    
    for photo_data in SAMPLE_PHOTOS:
        try:
            # 生成唯一ID
            public_id = str(uuid.uuid4())[:8]
            
            # 保存图片文件
            urls = save_images_to_public(photo_data, public_id)
            
            # 插入数据库
            insert_photo_to_db(photo_data, urls, public_id)
            
            created_count += 1
            
        except Exception as e:
            print(f"❌ 创建图片 '{photo_data['title']}' 时出错: {e}")
    
    print(f"\n🎉 成功创建了 {created_count} 张示例图片！")
    print("💡 现在可以刷新前端页面查看效果了")

if __name__ == "__main__":
    main()