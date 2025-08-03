# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://user:password@localhost/SolarPunk_db"
    
    # Cloudflare R2
    r2_endpoint_url: str
    r2_access_key_id: str
    r2_secret_access_key: str
    r2_bucket_name: str
    r2_public_url: str
    
    # API
    api_v1_prefix: str = "/api/v1"
    
    # Admin Panel
    admin_user: str = "admin"
    admin_password: str
    admin_secret_key: str
    cdn_base_url: str
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()