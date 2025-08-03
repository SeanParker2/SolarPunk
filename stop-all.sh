#!/bin/bash

# stop-all.sh - 一键停止所有服务的脚本

RED='\033[0;31m'
NC='\033[0m'

echo -e "${RED}### 停止 Solarpunk Hub 所有服务 ###${NC}"

# 停止后端服务
if [ -f .backend.pid ]; then
    PID=$(cat .backend.pid)
    echo "=> 正在停止后端服务 (PID: $PID)..."
    kill $PID
    rm .backend.pid
    echo "后端服务已停止。"
else
    echo "未找到后端服务的PID文件，可能未启动。"
fi

# 停止前端服务
if [ -f .frontend.pid ]; then
    PID=$(cat .frontend.pid)
    echo "=> 正在停止前端服务 (PID: $PID)..."
    kill $PID
    rm .frontend.pid
    echo "前端服务已停止。"
else
    echo "未找到前端服务的PID文件，可能未启动。"
fi

echo ""
echo -e "${RED}### 所有服务均已停止。 ###${NC}"