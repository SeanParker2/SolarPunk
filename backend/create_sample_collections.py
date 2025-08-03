#!/usr/bin/env python3
"""
创建示例Collection数据的脚本
"""

from sqlalchemy import create_engine, select, insert
from sqlalchemy.orm import sessionmaker
from app.models.tables import Collection, Photo, collection_photos
from app.core.config import settings

def create_sample_collections():
    
    # 创建同步引擎
    engine = create_engine(settings.database_url)
    Session = sessionmaker(bind=engine)
    
    with Session() as session:
        # 检查是否已有Collection数据
        result = session.execute(select(Collection))
        existing_collections = result.scalars().all()
        
        if existing_collections:
            print(f"已存在 {len(existing_collections)} 个合集，跳过创建")
            return
        
        # 获取现有照片
        result = session.execute(select(Photo))
        photos = result.scalars().all()
        
        if len(photos) < 6:
            print("照片数量不足，无法创建示例合集")
            return
        
        # 创建示例合集
        collections_data = [
            {
                "title": "未来城市愿景",
                "description": "探索可持续发展的未来城市设计，展现绿色建筑与科技的完美融合。",
                "slug": "future-cities",
                "cover_photo_id": photos[0].id,
                "is_published": True
            },
            {
                "title": "绿色能源革命",
                "description": "太阳能、风能等可再生能源技术的创新应用与美学表达。",
                "slug": "green-energy",
                "cover_photo_id": photos[1].id,
                "is_published": True
            },
            {
                "title": "生态共生空间",
                "description": "人与自然和谐共处的生活空间设计，体现生态平衡之美。",
                "slug": "eco-spaces",
                "cover_photo_id": photos[2].id,
                "is_published": True
            }
        ]
        
        created_collections = []
        for collection_data in collections_data:
            collection = Collection(**collection_data)
            session.add(collection)
            session.flush()  # 获取ID
            created_collections.append(collection)
        
        # 为每个合集分配照片
        for i, collection in enumerate(created_collections):
            # 每个合集分配3-4张照片
            start_idx = i * 2
            end_idx = min(start_idx + 4, len(photos))
            collection_photo_ids = [photos[j].id for j in range(start_idx, end_idx)]
            
            # 添加到关联表
            for photo_id in collection_photo_ids:
                session.execute(
                    insert(collection_photos).values(
                        collection_id=collection.id,
                        photo_id=photo_id
                    )
                )
        
        session.commit()
        print(f"成功创建 {len(created_collections)} 个示例合集")
        
        # 显示创建的合集信息
        for collection in created_collections:
            print(f"- {collection.title} (/{collection.slug})")

if __name__ == "__main__":
    create_sample_collections()