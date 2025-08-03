# backend/app/admin.py

from sqladmin import ModelView
from app.models import User, Photo, Tag, Collection

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.username, User.role]
    name_plural = "Users"
    icon = "fa-solid fa-user"
    can_create = True  # 允许在后台创建用户
    can_delete = False  # 不允许在后台删除用户

class PhotoAdmin(ModelView, model=Photo):
    # 在列表页显示的列
    column_list = [Photo.id, "thumbnail_url", Photo.title, Photo.public_id, Photo.tags, Photo.download_count, Photo.is_featured]
    # 自定义列的格式，让缩略图URL显示为图片
    column_formatters = {
        "thumbnail_url": lambda m, a: f'<img src="{m.thumbnail_url}" width="100">'
    }
    # 可以被搜索的列
    column_searchable_list = [Photo.title, Photo.public_id]
    # 在表单中显示的列
    form_columns = [Photo.public_id, Photo.title, Photo.tags, Photo.r2_object_key, Photo.aspect_ratio, Photo.download_count, Photo.is_featured]
    # 可以排序的列
    column_sortable_list = [Photo.id, Photo.title, Photo.download_count, Photo.created_at]
    name_plural = "Photos"
    icon = "fa-solid fa-camera-retro"

class TagAdmin(ModelView, model=Tag):
    column_list = [Tag.id, Tag.name]
    column_searchable_list = [Tag.name]
    name_plural = "Tags"
    icon = "fa-solid fa-tag"

class CollectionAdmin(ModelView, model=Collection):
    # 在列表页显示的列
    column_list = [Collection.id, Collection.title, Collection.slug, Collection.is_published, Collection.view_count, Collection.created_at]
    # 可以被搜索的列
    column_searchable_list = [Collection.title, Collection.slug, Collection.description]
    # 在表单中显示的列
    form_columns = [Collection.title, Collection.description, Collection.slug, Collection.cover_photo_id, Collection.is_published]
    # 可以排序的列
    column_sortable_list = [Collection.title, Collection.view_count, Collection.created_at, Collection.updated_at]
    name_plural = "Collections"
    icon = "fa-solid fa-layer-group"