import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqladmin import Admin
from app.api.photos import router as photos_router
from app.api.collections import router as collections_router
from app.db.database import engine
from app.admin_auth import AdminAuth
from app.admin import UserAdmin, PhotoAdmin, TagAdmin, CollectionAdmin
from app.dashboard import DashboardView
from app.core.config import settings

# --- App Initialization ---
app = FastAPI(title="Solarpunk Hub API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://10.0.0.12:3000",
        "http://10.0.0.12:3002",
        "http://10.0.0.12:3003"
    ],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routers ---
app.include_router(photos_router, prefix="/api/v1")
app.include_router(collections_router, prefix="/api/v1")

# --- Admin Panel Setup ---
# 1. 初始化认证后端
# !! 重要: 'your_strong_secret_key' 应该从环境变量加载 !!
SECRET_KEY = os.environ.get("ADMIN_SECRET_KEY", "your_strong_secret_key_for_session")
authentication_backend = AdminAuth(secret_key=SECRET_KEY)

# 2. 初始化 Admin 界面
admin = Admin(
    app,
    engine,
    title="Solarpunk Hub Admin",
    authentication_backend=authentication_backend
)

# 3. 注册所有 Admin 视图
admin.add_view(DashboardView)
admin.add_view(UserAdmin)
admin.add_view(PhotoAdmin)
admin.add_view(TagAdmin)
admin.add_view(CollectionAdmin)

# --- Root Endpoint ---
@app.get("/")
def read_root():
    return {"message": "Welcome to Solarpunk Hub API"}