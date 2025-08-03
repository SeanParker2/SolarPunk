# Solarpunk Gallery 生产环境部署指南

## 🛡️ 安全加固

### 1. 密码哈希 ✅

系统已集成 `passlib` 库进行密码哈希处理：

- ✅ 管理员密码使用 bcrypt 哈希存储
- ✅ 登录验证支持哈希密码比对
- ✅ 向后兼容明文密码（首次登录后自动转换）

### 2. 环境变量安全检查

使用安全检查脚本：

```bash
# 运行安全检查
python check_env.py
```

**关键环境变量清单：**
- `DATABASE_URL` - 数据库连接URL
- `ADMIN_PASSWORD` - 管理员密码（12+字符，包含大小写、数字、特殊字符）
- `ADMIN_SECRET_KEY` - 会话密钥（强随机字符串）
- `R2_ACCESS_KEY_ID` - Cloudflare R2 访问密钥
- `R2_SECRET_ACCESS_KEY` - R2 秘密访问密钥
- `R2_BUCKET_NAME` - R2 存储桶名称
- `R2_ENDPOINT_URL` - R2 端点URL
- `R2_PUBLIC_URL` - R2 公共访问URL

### 3. HTTPS 部署检查清单

- [ ] 确认部署平台已启用 SSL/TLS 证书
- [ ] 所有 API 调用使用 HTTPS
- [ ] 管理后台强制 HTTPS 访问
- [ ] 检查混合内容警告

**常见平台 SSL 设置：**
- **Vercel/Netlify/Render**: 自动启用 HTTPS
- **Heroku**: 需要在设置中手动启用

## 💾 数据备份策略

### 自动备份脚本

```bash
# 完整备份（数据库文件 + JSON导出）
python backup_data.py

# 仅备份数据库文件
python backup_data.py --db-only

# 仅导出JSON数据
python backup_data.py --json-only

# 自定义清理策略（保留15天）
python backup_data.py --cleanup-days 15
```

### 推荐备份策略

1. **每日自动备份**（推荐凌晨2点执行）
   ```bash
   # 添加到 crontab
   0 2 * * * cd /path/to/project && python backup_data.py
   ```

2. **云端备份**
   - 使用数据库托管服务的自动备份功能
   - 将本地备份上传到云存储（AWS S3, Google Drive等）

3. **备份保留策略**
   - 每日备份保留 7 天
   - 每周备份保留 4 周
   - 每月备份保留 12 个月

## 📊 新功能概览

### 1. 下载统计功能 ✅

**数据库更新：**
- `photos` 表新增 `download_count` 字段
- `photos` 表新增 `is_featured` 字段

**API 端点：**
```http
POST /api/v1/photos/{public_id}/download
```

**前端集成示例：**
```javascript
// 用户点击下载时
const handleDownload = async (publicId, downloadUrl) => {
  // 1. 异步记录下载统计（不等待结果）
  fetch(`/api/v1/photos/${publicId}/download`, { method: 'POST' })
    .catch(err => console.log('统计记录失败:', err));
  
  // 2. 立即触发下载
  window.open(downloadUrl, '_blank');
};
```

### 2. 管理后台增强 ✅

**新增功能：**
- ✅ 仪表盘页面（访问 `/admin/dashboard`）
- ✅ 下载统计显示和编辑
- ✅ 精选图片标记功能
- ✅ 图片列表排序（按下载量、创建时间等）

**仪表盘指标：**
- 总图片数
- 总下载量
- 精选图片数
- 用户数
- 标签数
- 最受欢迎图片列表
- 最新上传图片列表

### 3. 精选图片功能 ✅

**后台操作：**
1. 在图片管理页面，编辑图片
2. 设置 `is_featured` 为 `true`
3. 前端可优先展示精选图片

**前端查询示例：**
```javascript
// 获取精选图片
const featuredPhotos = await fetch('/api/v1/photos?featured=true');
```

## 🚀 部署流程

### 1. 环境准备

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 运行数据库迁移
alembic upgrade head

# 3. 运行安全检查
python check_env.py
```

### 2. 生产环境配置

**在部署平台设置环境变量：**

```bash
# 数据库
DATABASE_URL=postgresql://user:pass@host:port/dbname

# 管理员账户
ADMIN_USER=admin
ADMIN_PASSWORD=your_strong_password_here
ADMIN_SECRET_KEY=your_secret_key_here

# Cloudflare R2
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-domain.com
```

### 3. 首次部署后

1. **访问管理后台**: `https://your-domain.com/admin`
2. **使用管理员账户登录**
3. **查看仪表盘**: `https://your-domain.com/admin/dashboard`
4. **开始上传和管理图片**

## 📋 维护检查清单

### 每日
- [ ] 检查备份是否正常执行
- [ ] 监控服务器状态和错误日志

### 每周
- [ ] 运行安全检查脚本
- [ ] 检查磁盘空间使用情况
- [ ] 清理过期的备份文件

### 每月
- [ ] 更新依赖包到最新版本
- [ ] 轮换管理员密码和密钥
- [ ] 测试备份恢复流程
- [ ] 检查 SSL 证书有效期

## 🔧 故障排除

### 常见问题

1. **管理后台无法访问**
   - 检查环境变量是否正确设置
   - 确认 HTTPS 配置
   - 查看服务器错误日志

2. **下载统计不工作**
   - 确认数据库迁移已执行
   - 检查 API 端点是否可访问
   - 查看前端控制台错误

3. **备份失败**
   - 检查磁盘空间
   - 确认数据库文件权限
   - 查看备份脚本错误输出

### 紧急联系

如遇到严重问题，请：
1. 立即停止服务
2. 检查最近的备份
3. 查看详细错误日志
4. 必要时回滚到上一个稳定版本

---

**🎉 恭喜！您的 Solarpunk Gallery 现在已经具备了生产环境的安全性和可靠性！**