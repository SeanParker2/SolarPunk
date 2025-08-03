# backend/app/admin_auth.py

import os
from passlib.context import CryptContext
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.responses import RedirectResponse

# 密码哈希上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AdminAuth(AuthenticationBackend):
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """验证明文密码与哈希密码"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """生成密码哈希"""
        return pwd_context.hash(password)
    
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username, password = form.get("username"), form.get("password")

        # 从环境变量获取管理员凭证，这是安全的做法
        ADMIN_USER = os.environ.get("ADMIN_USER", "admin")
        ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")

        if not ADMIN_PASSWORD:
            print("错误：ADMIN_PASSWORD 环境变量未设置！")
            return False

        # 密码验证：支持哈希密码和明文密码（向后兼容）
        if username == ADMIN_USER:
            # 如果密码看起来像哈希值（以$2b$开头），使用哈希验证
            if ADMIN_PASSWORD.startswith('$2b$'):
                password_valid = self.verify_password(password, ADMIN_PASSWORD)
            else:
                # 兼容明文密码（开发环境）
                password_valid = password == ADMIN_PASSWORD
                
            if password_valid:
                request.session.update({"token": "admin_logged_in"})
                return True

        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")
        if not token:
            # 如果需要，可以重定向到登录页面
            # return RedirectResponse(request.url_for("admin:login"), status_code=302)
            return False
        
        return token == "admin_logged_in"