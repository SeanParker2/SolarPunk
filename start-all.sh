#!/bin/bash

# start-all.sh - 一键启动所有服务的脚本

# 设置颜色，方便阅读
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${GREEN}### 启动 Solarpunk Hub 所有服务 ###${NC}"

# 检查PostgreSQL是否在运行 (这是一个简单的检查，可能需要根据您的系统调整)
# 对于大多数情况，我们假设用户已手动启动了数据库服务。
echo "=> 步骤 1: 请确保您的 PostgreSQL 数据库服务正在运行..."
# (您可以在这里添加检查数据库连接的命令，但为保持简单，我们暂时省略)

# 启动后端服务
echo "=> 步骤 2: 正在后台启动 FastAPI 后端服务..."
cd backend
# 使用 uvicorn 启动，并将其放入后台运行
# 将进程ID (PID) 保存到文件中，方便后续停止
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
echo $BACKEND_PID > ../.backend.pid
echo -e "后端服务已启动，PID: ${GREEN}$BACKEND_PID${NC}"
cd ..

# 启动前端服务
echo "=> 步骤 3: 正在后台启动 Next.js 前端服务..."
cd frontend
# 启动开发服务器，并将其放入后台运行
# 将进程ID (PID) 保存到文件中
PORT=3003 npm run dev &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../.frontend.pid
echo -e "前端服务已启动，PID: ${GREEN}$FRONTEND_PID${NC}"
cd ..

echo ""
echo -e "${GREEN}### 所有服务均已启动！ ###${NC}"
echo "----------------------------------------"
echo -e "您可以访问:"
echo -e "- 前端网站:  ${GREEN}http://localhost:3003${NC}"
echo -e "- 后端API文档: ${GREEN}http://localhost:8000/docs${NC}"
echo -e "- 管理后台:    ${GREEN}http://localhost:8000/admin${NC}"
echo "----------------------------------------"
echo "要停止所有服务, 请运行 ./stop-all.sh"