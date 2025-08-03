### **项目需求文档 (PRD): SolarPunk Image Hub**

  * **项目名称:** SolarPunk Image Hub
  * **版本:** 1.0 (MVP)
  * **日期:** 2025年8月2日
  * **撰写人:** Gemini

#### 1\. 项目概述 (Project Overview)

本项目旨在创建一个名为 “SolarPunk Image Hub” 的图片分享网站。与通用型图库不同，本站**深度垂直于 “光合朋克 (SolarPunk)” 美学风格**，为设计师、内容创作者、科幻爱好者及可持续发展领域的从业者提供高质量、风格统一、免费可商用的图片资源。MVP（最小可行产品）阶段的目标是快速上线一个核心功能完整的网站，以验证市场对此细分领域的需求。

#### 2\. 核心目标 (Core Objectives)

  * **价值验证:** 验证市场对高质量 SolarPunk 风格免费图片存在真实需求（以图片下载量为核心衡量指标）。
  * **快速上线:** 在 2-3 周内完成 MVP 的开发、部署和上线。
  * **低成本运营:** 技术选型和架构设计需将初期运营成本（尤其是服务器和带宽费用）降至最低。

#### 3\. 角色与用户场景 (Personas & User Stories)

  * **角色 1: 管理员 (Admin - 即项目创始人)**
      * **场景:** 作为管理员，我需要一种高效的方式上传新的图片及其相关信息（如标签），以不断丰富网站内容。
  * **角色 2: 内容创作者 (User - 如博客作者、设计师)**
      * **场景 1:** 作为用户，我希望一进入网站就能直观地浏览所有 SolarPunk 风格的图片，快速获得灵感。
      * **场景 2:** 作为用户，当我看到感兴趣的图片时，我希望能方便地查看大图。
      * **场景 3:** 作为用户，我希望能一键免费下载高质量的图片原图，并清楚地了解其使用授权。

#### 4\. MVP 功能需求文档 (Functional Requirements)

##### 4.1. 技术栈与架构 (Tech Stack & Architecture)

  * **前端:** Next.js (React)
  * **后端:** FastAPI (Python)
  * **数据库:** PostgreSQL
  * **图片存储与分发:** Cloudflare R2
  * **部署:** 前端部署于 Vercel，后端和数据库可部署于 Render, Heroku 或其他 PaaS 平台。

##### 4.2. 数据模型 / 数据库设计 (Data Model)

为简化 MVP，我们只需要一张核心数据表。

**数据表: `photos`**

| 字段名 (Field Name) | 数据类型 (Data Type) | 描述 (Description) | 备注 (Notes) |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | 主键，唯一标识符 | 自动生成，作为内部ID |
| `public_id` | `VARCHAR(255)` | 公开的、人类可读的ID | 例如 `SolarPunk-city-garden-01` |
| `title` | `VARCHAR(255)` | 图片标题 | 用于 SEO 和显示 |
| `tags` | `TEXT[]` | 标签数组 | PostgreSQL 的数组类型，如 `{'city', 'green', 'future'}` |
| `r2_object_key` | `VARCHAR(255)` | 图片在 Cloudflare R2 中的 Object Key | 例如 `images/original/abc-123.webp` |
| `aspect_ratio` | `FLOAT` | 图片宽高比 (宽/高) | 用于前端瀑布流布局计算，避免页面抖动 |
| `created_at` | `TIMESTAMP` | 创建时间 | 自动生成 |

##### 4.3. 功能模块详述 (Functional Modules)

-----

**模块 1: 后端 API (FastAPI)**

  * **目标:** 提供前端所需的数据接口。

  * **Endpoint 1: 获取图片列表**

      * **方法:** `GET`
      * **路径:** `/api/v1/photos`
      * **功能:** 返回数据库中所有图片的数据。按 `created_at` 降序排列。
      * **查询参数 (Query Params):**
          * `page` (int, default=1): 页码
          * `limit` (int, default=20): 每页数量
      * **成功响应 (200 OK):**
        ```json
        {
          "items": [
            {
              "public_id": "SolarPunk-city-garden-01",
              "title": "SolarPunk City Garden",
              "tags": ["city", "green", "future"],
              "thumbnail_url": "https://<your-r2-public-url>/images/thumb/abc-123.webp",
              "aspect_ratio": 1.77
            },
            // ... more items
          ],
          "total": 50,
          "page": 1,
          "pages": 3
        }
        ```
      * **备注:** `thumbnail_url` 由后端根据 `r2_object_key` 拼接生成。缩略图的处理见模块3。

  * **Endpoint 2: 获取单张图片详情 (用于下载)**

      * **方法:** `GET`
      * **路径:** `/api/v1/photos/{public_id}`
      * **功能:** 返回特定 `public_id` 图片的详细信息，主要是原图下载链接。
      * **成功响应 (200 OK):**
        ```json
        {
          "public_id": "SolarPunk-city-garden-01",
          "title": "SolarPunk City Garden",
          "tags": ["city", "green", "future"],
          "download_url": "https://<your-r2-public-url>/images/original/abc-123.webp",
          "license": "Free to use under SolarPunk License (CC0)."
        }
        ```

-----

**模块 2: 前端应用 (Next.js)**

  * **目标:** 实现用户面向的核心浏览和下载体验。

  * **2.1 首页 - 图片瀑布流 (`/`)**

      * **需求:**
        1.  页面加载时，调用后端 `/api/v1/photos` 接口获取第一页数据。
        2.  使用瀑布流 (Masonry) 布局展示图片缩略图。
        3.  每张图片需能响应点击事件。
        4.  实现无限滚动：当用户滚动到页面底部时，自动加载下一页数据。
        5.  布局必须是响应式的，在桌面和移动设备上都有良好表现。
        6.  使用 `aspect_ratio` 数据来预设图片容器高度，防止图片加载时页面重排。

  * **2.2 图片详情弹窗 (Modal)**

      * **需求:**
        1.  点击瀑布流中的任意图片，弹出一个居中的模态窗口 (Modal)。
        2.  Modal 背景应变暗，内容区展示更高清的图片预览。
        3.  Modal 内必须包含一个清晰、显眼的“下载”按钮。
        4.  Modal 内需展示图片标题和许可信息。
        5.  提供关闭按钮（如右上角的 'X'），且点击背景或按 `ESC` 键也能关闭。

  * **2.3 下载功能**

      * **需求:**
        1.  点击“下载”按钮后，应直接触发浏览器下载行为，而不是在新标签页中打开图片。
        2.  这可以通过在 `<a>` 标签上使用 `download` 属性实现。链接指向后端返回的 `download_url`。

-----

**模块 3: 内容管理脚本 (Python Script)**

  * **目标:** 替代后台管理界面，实现内容的快速上传。这是一个本地运行的命令行工具。

  * **脚本执行流程:** `python upload_script.py <file_path>`

    1.  接收一个本地图片文件路径作为参数。
    2.  **图片处理:**
          * 使用 `Pillow` 库读取图片。
          * 获取图片宽高，计算 `aspect_ratio`。
          * **生成缩略图:** 创建一个宽度为 400px 的缩略图，并保存为 `.webp` 格式。
          * **处理原图:** 将原图也转换为 `.webp` 格式以优化体积。
    3.  **命令行交互:**
          * 提示管理员输入图片的 `public_id`、`title` 和逗号分隔的 `tags`。
    4.  **上传至 R2:**
          * 使用 `boto3` 库。
          * 将处理后的原图上传到 R2 的 `images/original/` 目录下。
          * 将缩略图上传到 R2 的 `images/thumb/` 目录下。
    5.  **写入数据库:**
          * 使用 `psycopg2` 或 `SQLAlchemy` 库。
          * 将所有信息（`public_id`, `title`, `tags` 数组, `r2_object_key`, `aspect_ratio`）写入 PostgreSQL 的 `photos` 表。
    6.  完成后，在命令行输出 “Success\!”。

##### 4.4. 非功能性需求 (Non-Functional Requirements)

  * **性能:** 首页 LCP (Largest Contentful Paint) 时间应小于 2.5 秒。
  * **响应式:** 网站必须在主流移动设备（375px+）和桌面设备上适配。
  * **安全:** 所有 API 接口应考虑基本的速率限制，防止恶意请求。

-----

### **项目开发计划 (Project Plan)**

**总周期: 2周 (10个工作日)**

#### **Phase 0: 准备工作 (Day 0)**

  * [ ] 创建 GitHub 仓库。
  * [ ] 注册 Cloudflare 账号，创建 R2 Bucket。
  * [ ] 创建 PostgreSQL 数据库实例 (如在 Render.com)。
  * [ ] 初始化 Next.js 和 FastAPI 项目骨架。
  * [ ] 配置环境变量 (`.env` 文件) 管理所有密钥和配置。

#### **Phase 1: Sprint 1 (Week 1 - 后端与核心逻辑)**

  * **目标:** 完成数据通路，让图片能被上传并被接口消费。
  * **Day 1:**
      * [ ] 设计并创建 `photos` 数据表。
      * [ ] 开发 **内容管理脚本 (模块3)** 的基本框架，实现命令行交互和数据库写入。
  * **Day 2:**
      * [ ] 在脚本中集成图片处理（Pillow）和上传至 R2（boto3）的功能。
      * [ ] 手动上传第一张测试图片，验证整个流程。
  * **Day 3:**
      * [ ] 开发后端 **API Endpoint 1 (`/api/v1/photos`)**。
      * [ ] 使用 Postman 或类似工具进行接口测试。
  * **Day 4:**
      * [ ] 开发后端 **API Endpoint 2 (`/api/v1/photos/{public_id}`)**。
      * [ ] 完善后端的错误处理和日志记录。
  * **Day 5:**
      * [ ] 编写单元测试或集成测试，联调和代码审查。
      * [ ] 部署后端应用到线上 PaaS 平台，确保 API 可通过公网访问。

#### **Phase 2: Sprint 2 (Week 2 - 前端实现与上线)**

  * **目标:** 完成用户界面，联调前后端，并部署上线。
  * **Day 6 (Mon):**
      * [ ] 开发 **首页瀑布流布局 (模块 2.1)**，搭建静态 UI 框架。
      * [ ] 集成 API，实现从后端获取数据并展示。
  * **Day 7 (Tue):**
      * [ ] 实现瀑布流的**无限滚动**功能。
      * [ ] 优化图片加载性能（懒加载）。
  * **Day 8 (Wed):**
      * [ ] 开发**图片详情弹窗 (模块 2.2)** 的 UI 和交互逻辑。
      * [ ] 实现点击图片弹出 Modal 并展示大图的功能。
  * **Day 9 (Thu):**
      * [ ] 实现**下载功能 (模块 2.3)**，完成前后端联调。
      * [ ] 全面测试响应式布局，修复 CSS bug。
  * **Day 10 (Fri):**
      * [ ] **部署！** 将 Next.js 应用部署到 Vercel。
      * [ ] 配置域名、DNS、HTTPS。
      * [ ] 进行端到端（E2E）的最终验收测试。
      * [ ] 使用内容管理脚本上传最初的 50 张图片。
      * **正式上线！**

-----

### **验收标准 (MVP Acceptance Criteria)**

  * [ ] 管理员可以通过本地脚本成功上传一张新图片。
  * [ ] 用户可以在首页看到所有图片，并能无限滚动加载。
  * [ ] 用户点击任意图片可以打开详情弹窗。
  * [ ] 用户可以从详情弹窗中成功下载图片原图。
  * [ ] 网站在手机和桌面浏览器上均可正常使用。

### **未来迭代方向 (Post-MVP)**

  * **V1.1:** 搜索功能 (集成 Algolia 或 Meilisearch)。
  * **V1.2:** 分类/专题页面。
  * **V2.0:** 用户系统（注册、登录、收藏图片）。
  * **V2.1:** 创作者系统（允许外部用户上传、审核流程）。


  # 启动所有服务
./start-all.sh

# 停止所有服务
./stop-all.sh