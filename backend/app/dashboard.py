# backend/app/dashboard.py

from sqladmin import BaseView, expose
from sqlalchemy import func
from app.models import Photo, User, Tag
from app.db.database import get_db
from starlette.requests import Request
from starlette.responses import Response

class DashboardView(BaseView):
    name = "Dashboard"
    icon = "fa-solid fa-chart-line"
    
    @expose("/dashboard", methods=["GET"])
    async def dashboard(self, request: Request) -> Response:
        """仪表盘页面"""
        db = next(get_db())
        
        try:
            # 统计数据
            total_photos = db.query(func.count(Photo.id)).scalar()
            total_downloads = db.query(func.sum(Photo.download_count)).scalar() or 0
            featured_photos = db.query(func.count(Photo.id)).filter(Photo.is_featured == 'true').scalar()
            total_users = db.query(func.count(User.id)).scalar()
            total_tags = db.query(func.count(Tag.id)).scalar()
            
            # 最受欢迎的图片（按下载量排序）
            popular_photos = db.query(Photo).order_by(Photo.download_count.desc()).limit(5).all()
            
            # 最新上传的图片
            recent_photos = db.query(Photo).order_by(Photo.created_at.desc()).limit(5).all()
            
            dashboard_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Solarpunk Gallery Dashboard</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                <style>
                    .metric-card {{
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border-radius: 10px;
                        padding: 20px;
                        margin-bottom: 20px;
                    }}
                    .metric-value {{
                        font-size: 2.5rem;
                        font-weight: bold;
                    }}
                    .metric-label {{
                        font-size: 0.9rem;
                        opacity: 0.8;
                    }}
                    .photo-thumbnail {{
                        width: 60px;
                        height: 60px;
                        object-fit: cover;
                        border-radius: 5px;
                    }}
                </style>
            </head>
            <body>
                <div class="container-fluid p-4">
                    <h1 class="mb-4"><i class="fas fa-chart-line"></i> Solarpunk Gallery Dashboard</h1>
                    
                    <!-- 关键指标 -->
                    <div class="row">
                        <div class="col-md-2">
                            <div class="metric-card text-center">
                                <div class="metric-value">{total_photos}</div>
                                <div class="metric-label"><i class="fas fa-images"></i> 总图片数</div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="metric-card text-center">
                                <div class="metric-value">{total_downloads}</div>
                                <div class="metric-label"><i class="fas fa-download"></i> 总下载量</div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="metric-card text-center">
                                <div class="metric-value">{featured_photos}</div>
                                <div class="metric-label"><i class="fas fa-star"></i> 精选图片</div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="metric-card text-center">
                                <div class="metric-value">{total_users}</div>
                                <div class="metric-label"><i class="fas fa-users"></i> 用户数</div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="metric-card text-center">
                                <div class="metric-value">{total_tags}</div>
                                <div class="metric-label"><i class="fas fa-tags"></i> 标签数</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-4">
                        <!-- 最受欢迎的图片 -->
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">
                                    <h5><i class="fas fa-fire"></i> 最受欢迎图片</h5>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>缩略图</th>
                                                    <th>标题</th>
                                                    <th>下载量</th>
                                                </tr>
                                            </thead>
                                            <tbody>
            """
            
            for photo in popular_photos:
                dashboard_html += f"""
                                                <tr>
                                                    <td><img src="{photo.thumbnail_url}" class="photo-thumbnail" alt="{photo.title}"></td>
                                                    <td>{photo.title}</td>
                                                    <td><span class="badge bg-primary">{photo.download_count or 0}</span></td>
                                                </tr>
                """
            
            dashboard_html += f"""
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 最新上传的图片 -->
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">
                                    <h5><i class="fas fa-clock"></i> 最新上传</h5>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>缩略图</th>
                                                    <th>标题</th>
                                                    <th>上传时间</th>
                                                </tr>
                                            </thead>
                                            <tbody>
            """
            
            for photo in recent_photos:
                dashboard_html += f"""
                                                <tr>
                                                    <td><img src="{photo.thumbnail_url}" class="photo-thumbnail" alt="{photo.title}"></td>
                                                    <td>{photo.title}</td>
                                                    <td>{photo.created_at.strftime('%Y-%m-%d %H:%M') if photo.created_at else 'N/A'}</td>
                                                </tr>
                """
            
            dashboard_html += """
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
            """
            
            return Response(dashboard_html, media_type="text/html")
            
        finally:
            db.close()